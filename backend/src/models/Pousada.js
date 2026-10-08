import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';

const pousadaSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  whatsapp: { type: String, required: true, trim: true },
  endereco: { type: String, trim: true },
  whatsappAtivo: { type: Boolean, default: false },
  ultimoPullIcal: Date,
  ipUltimoPull: String,
  plano: { type: String, enum: ['free', 'starter', 'pro', 'enterprise'], default: 'free' },
  icalToken: { type: String, unique: true, sparse: true },
  imapConfig: {
    ativo: { type: Boolean, default: false },
    uidValidity: String,
    ultimoUid: { type: Number, default: 0 },
    host: { type: String, default: 'imap.gmail.com' },
    port: { type: Number, default: 993 },
    user: String,
    pass: { type: String, select: false }
  },
  ativo: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

pousadaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (!this.icalToken) {
    this.icalToken = randomUUID();
  }
  next();
});

export default mongoose.model('Pousada', pousadaSchema);
