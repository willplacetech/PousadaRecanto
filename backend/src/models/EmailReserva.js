import mongoose from 'mongoose';

const emailReservaSchema = new mongoose.Schema({
  pousadaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pousada', required: true, index: true },
  messageId: { type: String, required: true, unique: true },
  remetente: { type: String, required: true },
  assunto: { type: String, required: true },
  dataRecebido: { type: Date, default: Date.now, index: true },
  tipo: { type: String, enum: ['nova', 'alteracao', 'cancelamento', 'desconhecido'] },
  extraido: { type: Boolean, default: false },
  reservaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reserva' },
  dadosExtraidos: { type: mongoose.Schema.Types.Mixed },
  erroExtracao: { type: String },
  processado: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

emailReservaSchema.index({ pousadaId: 1, dataRecebido: -1 });
emailReservaSchema.index({ pousadaId: 1, processado: 1 });

export default mongoose.model('EmailReserva', emailReservaSchema);