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
export { app };

app.use(helmet());


// Frontends que tenen permís
const allowedOrigins = [
  'https://calm-forest-0e7ca3203.3.azurestaticapps.net', 
  'https://witty-bay-0f8f41603.3.azurestaticapps.net', 
  env.corsOrigin                                    
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Si no és a la llista, rebutja-la
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

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