import { Router } from 'express';
import mongoose from 'mongoose';
import { Game } from '../models/Game.js';

const router = Router();

/** GET /api/games -> todos los juegos */
router.get('/', async (req, res, next) => {
  try {
    const games = await Game.find().lean();
    res.json(games);
  } catch (err) {
    next(err);
  }
});

/** GET /api/games/:id -> juego por id */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID no válido' });
    }
    const game = await Game.findById(id).lean();
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' });
    res.json(game);
  } catch (err) {
    next(err);
  }
});

export default router;
