# Autenticação por SMS (Supabase + Twilio)

O login usa um código de 6 dígitos enviado por SMS. O app chama `supabase.auth.signInWithOtp` e `verifyOtp`; o Supabase gera, expira e valida o código, e envia o SMS pelo Twilio.

## 1. Twilio

1. Crie a conta e, em **Messaging > Services**, crie um **Messaging Service** (anote o `Messaging Service SID`, começa com `MG`).
2. Contas de teste (trial) só enviam para números verificados em **Verified Caller IDs**. Para o piloto, faça o upgrade da conta.
3. Habilite o envio para o Brasil em **Messaging > Settings > Geo permissions**.
4. Anote o `Account SID` e o `Auth Token` (Console > Account Info).

Atenção: SMS para o Brasil costuma exigir remetente registrado/aprovado pelas operadoras. Se o SMS não chegar mesmo com tudo configurado, veja os logs em **Monitor > Logs > Messaging** do Twilio (o código de erro explica o motivo). Se a entrega no Brasil for ruim, considere OTP por WhatsApp.

## 2. Supabase

1. **Authentication > Providers > Phone**: ative e escolha **Twilio**.
2. Preencha `Account SID`, `Auth Token` e `Message Service SID`.
3. Ajuste **OTP expiry** (sugestão: 300 segundos) e o comprimento do código para **6**.
4. **Authentication > Rate Limits**: mantenha o limite de SMS baixo (cada SMS é cobrado). O app também bloqueia reenvio por 45 s.
5. (Opcional, teste) Em **Phone > Test phone numbers and OTPs**, cadastre números fictícios com código fixo, sem gastar SMS.

## 3. Variáveis do app

```bash
cp .env.example .env.local
# preencha EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY
bun run dev
```

A `anon key` é pública por desenho, mas a **`service_role` key nunca deve entrar no app**.

Para EAS Build, cadastre as mesmas variáveis como *environment variables* do projeto no EAS.

## 4. Modo de desenvolvimento (sem SMS)

Com `EXPO_PUBLIC_DEV_OTP_BYPASS=true` e o app em modo dev (`__DEV__`), o código `123456` é aceito sem enviar SMS. Em builds de produção o atalho não existe.

## 5. Pendências conhecidas

- **Exclusão de conta (LGPD):** `deleteAccount` só encerra a sessão. A exclusão real exige uma Edge Function com a service role key.
- **Nome do usuário:** ainda é provisório; falta a etapa de cadastro do nome.
- **Perfil e consentimento LGPD** ainda ficam só no aparelho; devem ir para o banco (com RLS) antes do piloto.
- **Armazenamento da sessão:** usa AsyncStorage. Para endurecer, trocar por adaptador com `expo-secure-store`.
