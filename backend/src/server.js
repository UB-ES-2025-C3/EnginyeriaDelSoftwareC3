import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import gameRoutes from './routes/game.routes.js';

const app = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());

app.use('/api/auth', rateLimit({ windowMs: 60_000, max: 20 }));
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/games', gameRoutes);

app.get('/health', (_, res) => res.json({ ok: true }));

const uploadsPath = path.join(process.cwd(), 'uploads');

app.use(
  '/uploads',
  cors({ origin: env.corsOrigin }), 
  helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }),
  express.static(uploadsPath)
);

app.use(helmet()); 
app.use(cors({ origin: env.corsOrigin, credentials: true }));

connectDB()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`🚀 API escuchando en http://localhost:${env.port}`);
    });
  })
  .catch((e) => {
    console.error('❌ Error conectando a MongoDB', e);
    process.exit(1);
  });
  