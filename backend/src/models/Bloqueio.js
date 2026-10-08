import mongoose from 'mongoose';

const bloqueioSchema = new mongoose.Schema({
  pousadaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pousada', required: true, index: true },
  acomodacao: { type: mongoose.Schema.Types.ObjectId, ref: 'Acomodacao', required: true, index: true },
  data: { type: Date, required: true, index: true },
  origem: { type: String, enum: ['reserva', 'ical', 'email', 'manutencao'], required: true, index: true },
  referenciaId: { type: mongoose.Schema.Types.ObjectId, index: true },
  hash: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

bloqueioSchema.index({ pousadaId: 1, acomodacao: 1, data: 1, origem: 1 });
bloqueioSchema.index({ pousadaId: 1, hash: 1 }, { unique: true });

export default mongoose.model('Bloqueio', bloqueioSchema);