import mongoose from 'mongoose';

const acomodacaoSchema = new mongoose.Schema({
  pousadaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pousada', required: true, index: true },
  nome: { type: String, required: true, trim: true },
  tipo: { type: String, enum: ['standard', 'luxo', 'suite', 'chalé', 'bangalô', 'outro'], required: true },
  maxHospedes: { type: Number, required: true, min: 1 },
  camas: { type: String, required: true, trim: true },
  valorPadrao: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['ativa', 'inativa', 'manutencao'], default: 'ativa' },
  descricao: { type: String, trim: true },
  fotos: [{ type: String }],
  versaoDisponibilidade: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

acomodacaoSchema.index({ pousadaId: 1, nome: 1 }, { unique: true });
acomodacaoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Acomodacao', acomodacaoSchema);
