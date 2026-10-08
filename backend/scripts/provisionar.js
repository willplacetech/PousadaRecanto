import 'dotenv/config';
import mongoose from 'mongoose';
import { Pousada, Usuario } from '../src/models/index.js';
try {
  const senha = process.env.ADMIN_INITIAL_PASSWORD;
  const email = process.env.ADMIN_EMAIL;
  if (!email || !senha || senha.length < 10) throw new Error('Defina ADMIN_EMAIL e ADMIN_INITIAL_PASSWORD (mínimo 10 caracteres) no ambiente privado');
  if (await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME || undefined, serverSelectionTimeoutMS: 10000 })) {
    if (await Usuario.exists({ email })) throw new Error('Usuário já existe; senha não foi alterada');
    const session = await mongoose.startSession();
    let pousada;
    try {
      await session.withTransaction(async () => {
        pousada = process.env.POUSADA_PUBLICA_ID ? await Pousada.findById(process.env.POUSADA_PUBLICA_ID).session(session) : null;
        if (!pousada) {
          if (!process.env.POUSADA_WHATSAPP) throw new Error('Defina POUSADA_WHATSAPP com o contato real da pousada');
          [pousada] = await Pousada.create([{ nome: process.env.POUSADA_NOME || 'Pousada Recanto da Paz', email: process.env.POUSADA_EMAIL || email, whatsapp: process.env.POUSADA_WHATSAPP }], { session });
        }
        await Usuario.create([{ nome: 'Administrador', email, senhaHash: senha, pousadaId: pousada._id, role: 'dono', primeiroAcesso: true }], { session });
      });
      console.log(`Administrador criado. Configure POUSADA_PUBLICA_ID=${pousada._id}. Ajuste contato e acomodações no painel antes de habilitar reservas públicas.`);
    } finally { await session.endSession(); }
  }
} catch (e) { console.error('Provisionamento interrompido:', e.message); process.exitCode = 1; }
finally { await mongoose.disconnect(); }
