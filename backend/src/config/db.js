import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      dbName: process.env.MONGODB_DB_NAME || undefined,
    });
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar MongoDB: ${error.message}`);
    throw new Error('Verifique MONGODB_URI e acesso ao MongoDB');
  }
};

export default connectDB;
