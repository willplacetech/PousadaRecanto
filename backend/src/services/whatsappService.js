import twilio from 'twilio';
import { Pousada } from '../models/index.js';

export const enviarWhatsApp = async (pousadaId, mensagem) => {
  try {
    if (process.env.WHATSAPP_ENABLED !== 'true' || !process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return false;
    const pousada = await Pousada.findById(pousadaId);
    if (!pousada || !pousada.whatsapp || !pousada.whatsappAtivo) {
      console.warn('Pousada sem WhatsApp configurado:', pousadaId);
      return false;
    }

    const to = pousada.whatsapp.startsWith('whatsapp:') ? pousada.whatsapp : `whatsapp:${pousada.whatsapp}`;

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to,
      body: mensagem
    });

    return true;
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    return false;
  }
};

export const enviarAlertaOverbooking = async (pousadaId, reservaA, reservaB, acomodacaoNome, data) => {
  const msg = `🚨 OVERBOOKING DETECTADO 🚨\n\n` +
    `Acomodação: ${acomodacaoNome}\n` +
    `Data: ${new Date(data).toLocaleDateString('pt-BR')}\n\n` +
    `Reserva A: ${reservaA.codigo} (${reservaA.canal}) - ${reservaA.hospede.nome}\n` +
    `Reserva B: ${reservaB.codigo} (${reservaB.canal}) - ${reservaB.hospede.nome}\n\n` +
    `AÇÃO NECESSÁRIA IMEDIATA!`;

  return enviarWhatsApp(pousadaId, msg);
};
