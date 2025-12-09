import express from 'express';

const router = express.Router();

router.get('/test', (_req, res) => {
  res.status(200).json({
    message: 'Test endpoint OK',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

export default router;
