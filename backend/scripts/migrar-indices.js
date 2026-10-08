import 'dotenv/config';
import mongoose from 'mongoose';
import { EmailReserva, Reserva, Alerta } from '../src/models/index.js';
// Explicit opt-in: this script changes indexes, never deletes records.
try {
  if (!process.argv.includes('--confirmar')) throw new Error('Faça backup e execute com --confirmar para migrar índices existentes');
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME || undefined });
  for (const [model, key] of [[EmailReserva, { pousadaId: 1, messageId: 1 }], [Reserva, { pousadaId: 1, canal: 1, codigoExterno: 1 }], [Alerta, { pousadaId: 1, chave: 1 }]]) {
    // Create the new compound index first; duplicates abort without dropping protection.
    const optional = model === Reserva ? 'codigoExterno' : model === Alerta ? 'chave' : null;
    await model.collection.createIndex(key, { unique: true, ...(optional ? { partialFilterExpression: { [optional]: { $type: 'string' } } } : {}) });
    if (model === EmailReserva) {
      const indexes = await model.collection.indexes();
      for (const idx of indexes) if (idx.unique && Object.keys(idx.key).length === 1 && idx.key.messageId) await model.collection.dropIndex(idx.name);
    }
  }
  await Alerta.updateMany({ createdAt: { $exists: false } }, [{ $set: { createdAt: '$data' } }]);
  console.log('Índices migrados; nenhum registro removido.');
} catch (e) { console.error('Migração interrompida:', e.message); process.exitCode = 1; }
finally { await mongoose.disconnect(); }
