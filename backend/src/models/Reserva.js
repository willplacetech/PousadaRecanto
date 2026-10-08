import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  pousadaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pousada', required: true, index: true },
  codigo: { type: String, required: true, unique: true, uppercase: true, trim: true },
  hospede: {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    telefone: { type: String, required: true, trim: true }
  },
  acomodacao: { type: mongoose.Schema.Types.ObjectId, ref: 'Acomodacao', required: true, index: true },
  checkin: { type: Date, required: true, index: true },
  checkout: { type: Date, required: true, index: true },
  numHospedes: { type: Number, required: true, min: 1 },
  valorTotal: { type: Number, required: true, min: 0 },
  canal: { type: String, enum: ['direto', 'airbnb', 'booking', 'expedia', 'outro'], required: true },
  status: { type: String, enum: ['pendente', 'confirmada', 'cancelada', 'checkin', 'checkout'], default: 'pendente', index: true },
  codigoExterno: { type: String, trim: true, index: true },
  origem: { type: String, enum: ['manual', 'ical', 'email', 'api'], default: 'manual' },
  emailId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailReserva' },
  observacoes: { type: String, trim: true },
  bloqueioManualConfirmado: { type: Boolean, default: false },
  bloqueioManualConfirmadoEm: { type: Date },
  bloqueioManualPlataformas: [{ type: String, enum: ['airbnb', 'booking', 'expedia'] }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

reservaSchema.index({ pousadaId: 1, acomodacao: 1, checkin: 1, checkout: 1 });
reservaSchema.index({ pousadaId: 1, codigoExterno: 1 });
reservaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (!this.codigo) {
    this.codigo = `RES-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
  next();
});

export default mongoose.model('Reserva', reservaSchema);