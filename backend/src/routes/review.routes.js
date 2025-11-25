import { Router } from 'express';

const router = Router();

// Placeholder routes to avoid missing module errors while reviews feature is not implemented
router.get('/', (_req, res) => {
  res.status(501).json({ error: 'Reviews API not implemented' });
});

export default router;
