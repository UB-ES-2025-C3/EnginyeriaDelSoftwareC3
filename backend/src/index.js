import { app } from './server.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

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