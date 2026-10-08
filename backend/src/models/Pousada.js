import mongoose from 'mongoose';

const pousadaSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  whatsapp: { type: String, required: true, trim: true },
  plano: { type: String, enum: ['free', 'starter', 'pro', 'enterprise'], default: 'free' },
  icalToken: { type: String, unique: true, sparse: true },
  imapConfig: {
    host: { type: String, default: 'imap.gmail.com' },
    port: { type: Number, default: 993 },
    user: String,
    pass: String
  },
  ativo: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

pousadaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (!this.icalToken) {
    this.icalToken = crypto.randomUUID();
  }
  next();
});

export default mongoose.model('Pousada', pousadaSchema);