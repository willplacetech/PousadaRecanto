import mongoose from 'mongoose';

const tarifaSchema = new mongoose.Schema({
  pousadaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pousada', required: true, index: true },
  acomodacao: { type: mongoose.Schema.Types.ObjectId, ref: 'Acomodacao', required: true, index: true },
  data: { type: Date, required: true, index: true },
  valor: { type: Number, required: true, min: 0 },
  bloqueado: { type: Boolean, default: false },
  motivoBloqueio: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

tarifaSchema.index({ pousadaId: 1, acomodacao: 1, data: 1 }, { unique: true });
tarifaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Tarifa', tarifaSchema);