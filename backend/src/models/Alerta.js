import mongoose from 'mongoose';

const alertaSchema = new mongoose.Schema({
  pousadaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pousada', required: true, index: true },
  tipo: { type: String, enum: ['overbooking', 'sincronia_falhou', 'email_nao_processado', 'saude_sincronia'], required: true, index: true },
  severidade: { type: String, enum: ['baixa', 'media', 'alta', 'critica'], default: 'media' },
  mensagem: { type: String, required: true },
  detalhes: { type: mongoose.Schema.Types.Mixed },
  resolvido: { type: Boolean, default: false },
  resolvidoEm: { type: Date },
  resolvidoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  data: { type: Date, default: Date.now, index: true }
});

alertaSchema.index({ pousadaId: 1, resolvido: 1, data: -1 });
alertaSchema.index({ pousadaId: 1, tipo: 1, resolvido: 1 });

export default mongoose.model('Alerta', alertaSchema);