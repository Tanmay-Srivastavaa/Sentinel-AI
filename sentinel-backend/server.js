import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import scanRoutes from './src/routes/scanRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI)
    .then(() => console.log('📦 MongoDB Connected: Sentinel DB active'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Mount routes
app.use('/api', scanRoutes);

app.listen(PORT, () => {
    console.log(`🛡️ Sentinel AI Engine is live on http://localhost:${PORT}`);
});