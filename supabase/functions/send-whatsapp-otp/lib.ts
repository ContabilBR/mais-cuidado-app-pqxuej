// Lógica pura (sem Deno nem rede) do hook de envio do código por WhatsApp.
// Fica separada de index.ts para poder ser testada com Node: `bun run test:hook`.

export interface HookInput {
  phone: string; // somente dígitos, com DDI (ex.: 5511999999999)
  otp: string;
}

/** Mantém só os dígitos. Aceita "+55...", "55..." e espaços/traços. Retorna null se inválido (E.164: 10 a 15 dígitos). */
export function normalizePhone(phone: unknown): string | null {
  if (typeof phone !== 'string') return null;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

/** Extrai e valida telefone e código do payload enviado pelo Supabase (Send SMS hook). */
export function parseHookPayload(payload: unknown): HookInput | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const { user, sms } = payload as { user?: { phone?: unknown }; sms?: { otp?: unknown } };
  const phone = normalizePhone(user?.phone);
  const otp = typeof sms?.otp === 'string' && /^\d{4,10}$/.test(sms.otp) ? sms.otp : null;
  return phone && otp ? { phone, otp } : null;
}

/** Máscara para logs: nunca registre o telefone completo nem o código. */
export function maskPhone(phone: string): string {
  return phone.length <= 4 ? '****' : `${phone.slice(0, 2)}${'*'.repeat(phone.length - 6)}${phone.slice(-4)}`;
}

/**
 * Corpo da chamada POST /{PHONE_NUMBER_ID}/messages para um template de AUTENTICAÇÃO.
 * O código vai no corpo e também no botão (necessário para o botão "Copiar código").
 */
export function buildTemplateMessage(args: {
  to: string;
  otp: string;
  templateName: string;
  languageCode: string;
}) {
  const { to, otp, templateName, languageCode } = args;
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      components: [
        { type: 'body', parameters: [{ type: 'text', text: otp }] },
        {
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [{ type: 'text', text: otp }],
        },
      ],
    },
  };
}
