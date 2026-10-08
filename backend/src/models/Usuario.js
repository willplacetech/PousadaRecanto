import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  nome: { type: String, trim: true },
  senhaHash: { type: String, required: true },
  pousadaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pousada', required: true },
  role: { type: String, enum: ['dono', 'gestor', 'gerente', 'visualizacao'], default: 'gestor' },
  primeiroAcesso: { type: Boolean, default: true },
  ativo: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

usuarioSchema.pre('save', async function(next) {
  this.updatedAt = new Date();
  if (this.isModified('senhaHash')) {
    this.senhaHash = await bcrypt.hash(this.senhaHash, 12);
  }
  next();
});

usuarioSchema.methods.compararSenha = async function(senha) {
  return bcrypt.compare(senha, this.senhaHash);
};

export default mongoose.model('Usuario', usuarioSchema);
