# Autenticação por código no WhatsApp (Supabase + WhatsApp Cloud API)

## Como funciona

1. O app chama `supabase.auth.signInWithOtp({ phone })`.
2. O Supabase gera o código de 6 dígitos e, em vez de mandar SMS, aciona o **Send SMS Hook**.
3. O hook é a Edge Function `supabase/functions/send-whatsapp-otp`, que confere a assinatura da chamada e envia o código pela **API oficial do WhatsApp** (template de autenticação).
4. O usuário digita o código no app e o app chama `verifyOtp`. O Twilio **não é mais necessário**.

O token da Meta fica apenas como segredo da Edge Function. Nunca vai para o app.

## 1. Meta (WhatsApp Business Platform)

1. Crie (ou use) uma conta **Meta Business** e um app do tipo *Business* em developers.facebook.com, com o produto **WhatsApp**.
2. Cadastre um número de telefone para a conta do WhatsApp Business (WABA). Para testes, a Meta oferece um número de teste que só envia para até 5 destinatários verificados. Para o piloto com usuários reais, é preciso um número próprio e a **verificação do negócio** (confirme os requisitos atuais no painel da Meta).
3. Crie um **usuário do sistema** com acesso ao app e à WABA, com as permissões `whatsapp_business_messaging` e `whatsapp_business_management`, e gere um **token permanente**.
4. Anote: `Phone Number ID`, `WhatsApp Business Account ID (WABA ID)` e o token.

## 2. Template de autenticação

Mensagens com código só podem ser enviadas por template aprovado, da categoria **AUTHENTICATION**. O texto é fixo e definido pela Meta; você só escolhe as opções. Crie com:

```bash
curl -X POST "https://graph.facebook.com/v23.0/<WABA_ID>/upsert_message_templates" \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{
    "name": "codigo_verificacao",
    "languages": ["pt_BR"],
    "category": "AUTHENTICATION",
    "components": [
      { "type": "BODY", "add_security_recommendation": true },
      { "type": "FOOTER", "code_expiration_minutes": 5 },
      { "type": "BUTTONS", "buttons": [{ "type": "OTP", "otp_type": "COPY_CODE" }] }
    ]
  }'
```

Aguarde a aprovação (status em WhatsApp Manager > Templates). Use `code_expiration_minutes` igual à expiração do código no Supabase (300 s).

## 3. Supabase

1. **Authentication > Providers > Phone**: ative o provedor de telefone (necessário para `signInWithOtp` com telefone). Com o hook ativo, não é preciso configurar Twilio.
2. **Deploy da função** (CLI do Supabase, na raiz do repositório):
   ```bash
   supabase functions deploy send-whatsapp-otp --no-verify-jwt
   ```
   `--no-verify-jwt` é necessário porque o Supabase chama a função com assinatura Standard Webhooks, não com JWT. A função rejeita qualquer chamada sem assinatura válida.
3. **Authentication > Hooks > Send SMS**: ative, escolha **HTTPS**, aponte para a URL da função (`https://<projeto>.supabase.co/functions/v1/send-whatsapp-otp`) e gere o segredo. Copie o segredo (formato `v1,whsec_...`).
4. **Segredos da função**:
   ```bash
   supabase secrets set \
     SEND_SMS_HOOK_SECRETS='v1,whsec_...' \
     WHATSAPP_ACCESS_TOKEN='...' \
     WHATSAPP_PHONE_NUMBER_ID='...'
   # opcionais (valores padrão entre parênteses):
   #   WHATSAPP_TEMPLATE_NAME (codigo_verificacao), WHATSAPP_TEMPLATE_LANGUAGE (pt_BR),
   #   WHATSAPP_API_VERSION (v23.0)
   ```
5. **Authentication > Rate Limits**: mantenha o limite de envios baixo (cada mensagem é cobrada).
6. Em **Authentication > Providers > Phone**, defina expiração do código em 300 s e tamanho 6.

## 4. App

```bash
cp .env.example .env.local   # EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY
bun run dev
```

A `anon key` é pública por desenho. A `service_role` key e o token da Meta **nunca** entram no app.

Sem WhatsApp configurado, use o modo de desenvolvimento: `EXPO_PUBLIC_DEV_OTP_BYPASS=true` aceita o código `123456` apenas com o app em `__DEV__`.

## 5. Testes e diagnóstico

- Lógica do hook: `bun run test:hook`.
- Se o app mostrar "Não foi possível enviar o código", veja **Edge Functions > send-whatsapp-otp > Logs** no Supabase. A função registra o código de erro da Meta (sem telefone completo nem o OTP):
  - `401 Assinatura inválida`: segredo do hook diferente do configurado em `SEND_SMS_HOOK_SECRETS`.
  - `132001`: template não existe ou o idioma não confere com `WHATSAPP_TEMPLATE_LANGUAGE`.
  - `131030`: número de destino fora da lista de teste (ainda no modo de teste da Meta).
  - `190`: token inválido ou expirado.

## 6. Custos e limitações

- A Meta cobra por **template entregue**, com tarifa por país e categoria. Consulte a tabela de preços vigente da Meta (a cobrança em BRL para o Brasil começou em 1º/07/2026).
- A mensagem só chega ao **WhatsApp do número informado**. Se o número não tiver WhatsApp, a falha pode ocorrer depois do envio e o app não é avisado: o usuário vê o botão de reenvio após 45 s. Um fallback por SMS pode ser adicionado depois.
- A Meta entrega mensagens de autenticação somente ao dispositivo principal do usuário.

## 7. Pendências conhecidas

- **Exclusão de conta (LGPD):** `deleteAccount` só encerra a sessão. A exclusão real exige uma Edge Function com a service role key.
- **Nome do usuário:** ainda é provisório; falta a etapa de cadastro do nome.
- **Perfil e consentimento LGPD** ainda ficam só no aparelho; devem ir para o banco (com RLS) antes do piloto.
- **Armazenamento da sessão:** usa AsyncStorage. Para endurecer, trocar por adaptador com `expo-secure-store`.
