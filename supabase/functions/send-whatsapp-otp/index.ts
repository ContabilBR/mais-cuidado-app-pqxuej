// Send SMS Hook do Supabase Auth: em vez de SMS, envia o código por WhatsApp
// usando um template de autenticação da WhatsApp Cloud API (Meta).
//
// Deploy:  supabase functions deploy send-whatsapp-otp --no-verify-jwt
// (o Supabase chama esta função com assinatura Standard Webhooks, não com JWT)
//
// Segredos necessários (supabase secrets set ...): veja docs/autenticacao-whatsapp.md
import { Webhook } from 'npm:standardwebhooks@1.0.0';
import { buildTemplateMessage, maskPhone, parseHookPayload } from './lib.ts';

const HOOK_SECRET = (Deno.env.get('SEND_SMS_HOOK_SECRETS') ?? '').replace('v1,whsec_', '');
const ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
const TEMPLATE_NAME = Deno.env.get('WHATSAPP_TEMPLATE_NAME') ?? 'codigo_verificacao';
const TEMPLATE_LANGUAGE = Deno.env.get('WHATSAPP_TEMPLATE_LANGUAGE') ?? 'pt_BR';
const API_VERSION = Deno.env.get('WHATSAPP_API_VERSION') ?? 'v23.0';

// O Supabase aborta hooks HTTP após 5 s; abandonamos a chamada à Meta um pouco antes.
const META_TIMEOUT_MS = 4000;

function respond(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function fail(httpCode: number, message: string) {
  return respond(httpCode, { error: { http_code: httpCode, message } });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return fail(405, 'Método não permitido.');

  // Falha fechada: sem segredo configurado, nunca aceite requisições.
  if (!HOOK_SECRET || !ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    console.error('[send-whatsapp-otp] Configuração incompleta (segredos ausentes).');
    return fail(500, 'Serviço de verificação não configurado.');
  }

  const rawBody = await req.text();

  let payload: unknown;
  try {
    payload = new Webhook(HOOK_SECRET).verify(rawBody, Object.fromEntries(req.headers));
  } catch {
    console.warn('[send-whatsapp-otp] Assinatura inválida.');
    return fail(401, 'Assinatura inválida.');
  }

  const input = parseHookPayload(payload);
  if (!input) {
    console.error('[send-whatsapp-otp] Payload inesperado.');
    return fail(400, 'Requisição inválida.');
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;
  const message = buildTemplateMessage({
    to: input.phone,
    otp: input.otp,
    templateName: TEMPLATE_NAME,
    languageCode: TEMPLATE_LANGUAGE,
  });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
      signal: AbortSignal.timeout(META_TIMEOUT_MS),
    });

    if (!res.ok) {
      // Registra só códigos de erro, nunca o telefone completo nem o OTP.
      const detail = await res.json().catch(() => null);
      console.error(
        '[send-whatsapp-otp] Meta recusou o envio:',
        res.status,
        detail?.error?.code,
        detail?.error?.error_subcode,
        detail?.error?.type,
        maskPhone(input.phone),
      );
      return fail(500, 'Não foi possível enviar o código pelo WhatsApp.');
    }

    return respond(200, {});
  } catch (e) {
    console.error('[send-whatsapp-otp] Falha de rede/timeout:', (e as Error).name, maskPhone(input.phone));
    return fail(500, 'Não foi possível enviar o código pelo WhatsApp.');
  }
});
