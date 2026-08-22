import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import authRoutes from './routes/auth.js';
import barangRoutes from './routes/barang.js';
import kategoriRoutes from './routes/kategori.js';
import peminjamanRoutes from './routes/peminjaman.js';
import laporanRoutes from './routes/laporan.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/barang', authenticate, barangRoutes);
app.use('/api/kategori', authenticate, kategoriRoutes);
app.use('/api/peminjaman', authenticate, peminjamanRoutes);
app.use('/api/laporan', authenticate, laporanRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// Not Found Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Sync Database & Start Server
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Client URL: ${process.env.CLIENT_URL}`);
  });
}).catch(err => {
  console.error('❌ Database sync error:', err);
  process.exit(1);
});

export default app;
