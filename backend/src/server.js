import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';
try {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET deve ter no mínimo 32 caracteres');
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI não configurada');
  await connectDB();
  const server = app.listen(process.env.PORT || 3000, () => console.log('API da pousada iniciada'));
  const stop = () => server.close(async () => { await mongoose.disconnect(); process.exit(0); });
  process.on('SIGTERM', stop); process.on('SIGINT', stop);
} catch (e) { console.error('Não foi possível iniciar a API:', e.message); process.exitCode = 1; }
