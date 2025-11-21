import { Router } from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Game } from '../models/Game.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

/** GET /api/reviews -> todas las reviews */
router.get('/', async (req, res, next) => {
  try {
    const reviews = await Review.find().lean();
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

/** POST /api/reviews/:gameId -> crear una review para un juego */
router.post('/:gameId', auth, async (req, res) => {
  try {
    const { gameId } = req.params;
    const { stars, text } = req.body;

    // Validar ID de juego
    if (!mongoose.isValidObjectId(gameId)) {
      return res.status(400).json({ message: 'ID de juego no válido' });
    }

    // Comprobar que el juego existe
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    // Validar estrellas
    if (typeof stars !== 'number' || stars < 1 || stars > 5) {
      return res.status(400).json({ message: 'Las estrellas deben estar entre 1 y 5' });
    }

    // Crear la review
    const review = await Review.create({
      user: req.user.id,
      game: gameId,
      stars,
      text
      // createdAt se genera solo por timestamps
    });

    res.status(201).json({
      message: 'Reseña creada correctamente',
      review
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear la reseña' });
  }
});


export default router;
