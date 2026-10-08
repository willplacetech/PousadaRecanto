import mongoose from 'mongoose';

const calendarioICalSchema = new mongoose.Schema({
  pousadaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pousada', required: true, index: true },
  acomodacao: { type: mongoose.Schema.Types.ObjectId, ref: 'Acomodacao', required: true, index: true },
  canal: { type: String, enum: ['airbnb', 'booking', 'expedia', 'outro'], required: true },
  url: { type: String, required: true, trim: true },
  ultimaSincronizacao: { type: Date },
  ultimoPullIcal: { type: Date },
  ultimoPullIp: { type: String },
  status: { type: String, enum: ['ativo', 'inativo', 'erro'], default: 'ativo' },
  ultimoErro: { type: String },
  tentativasErro: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

calendarioICalSchema.index({ pousadaId: 1, acomodacao: 1, canal: 1 }, { unique: true });
calendarioICalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('CalendarioICal', calendarioICalSchema);