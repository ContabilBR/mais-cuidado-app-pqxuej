import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTemplateMessage, maskPhone, normalizePhone, parseHookPayload } from './lib.ts';

test('normalizePhone aceita formatos comuns e rejeita inválidos', () => {
  assert.equal(normalizePhone('5511999999999'), '5511999999999');
  assert.equal(normalizePhone('+55 (11) 99999-9999'), '5511999999999');
  assert.equal(normalizePhone('123'), null);
  assert.equal(normalizePhone('1'.repeat(16)), null);
  assert.equal(normalizePhone(undefined), null);
  assert.equal(normalizePhone(5511999999999), null);
});

test('parseHookPayload valida telefone e código', () => {
  const ok = parseHookPayload({ user: { phone: '5511999999999' }, sms: { otp: '561166' } });
  assert.deepEqual(ok, { phone: '5511999999999', otp: '561166' });
  assert.equal(parseHookPayload(null), null);
  assert.equal(parseHookPayload({}), null);
  assert.equal(parseHookPayload({ user: { phone: '5511999999999' }, sms: { otp: 'abc123' } }), null);
  assert.equal(parseHookPayload({ user: { phone: 'x' }, sms: { otp: '561166' } }), null);
  assert.equal(parseHookPayload({ user: { phone: '5511999999999' }, sms: { otp: 561166 } }), null);
});

test('maskPhone nunca expõe o número completo', () => {
  const masked = maskPhone('5511999999999');
  assert.equal(masked, '55*******9999');
  assert.ok(!masked.includes('99999999'));
  assert.equal(maskPhone('123'), '****');
});

test('buildTemplateMessage monta o corpo do template de autenticação', () => {
  const msg = buildTemplateMessage({
    to: '5511999999999',
    otp: '561166',
    templateName: 'codigo_verificacao',
    languageCode: 'pt_BR',
  });
  assert.equal(msg.messaging_product, 'whatsapp');
  assert.equal(msg.type, 'template');
  assert.equal(msg.to, '5511999999999');
  assert.equal(msg.template.name, 'codigo_verificacao');
  assert.equal(msg.template.language.code, 'pt_BR');
  assert.deepEqual(msg.template.components[0], {
    type: 'body',
    parameters: [{ type: 'text', text: '561166' }],
  });
  assert.deepEqual(msg.template.components[1], {
    type: 'button',
    sub_type: 'url',
    index: '0',
    parameters: [{ type: 'text', text: '561166' }],
  });
});
