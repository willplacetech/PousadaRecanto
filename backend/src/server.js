import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import acomodacaoRoutes from './routes/acomodacoes.js';
import reservaRoutes from './routes/reservas.js';
import icalRoutes from './routes/ical.js';
import emailRoutes from './routes/email.js';
import alertaRoutes from './routes/alertas.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api', acomodacaoRoutes);
app.use('/api', reservaRoutes);
app.use('/api', icalRoutes);
app.use('/api', emailRoutes);
app.use('/api', alertaRoutes);

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

export default app;