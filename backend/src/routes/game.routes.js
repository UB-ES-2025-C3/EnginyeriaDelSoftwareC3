import { Router } from 'express';
import mongoose from 'mongoose';
import { Game } from '../models/Game.js';

const router = Router();

/** GET /api/games -> listado con filtros, ordenación y paginación */
router.get('/', async (req, res, next) => {
  try {
    const parseArrayParam = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value.filter(Boolean);
      return String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    };

    const page = Math.max(parseInt(req.query.page ?? '1', 10) || 1, 1);
    const limitRaw = parseInt(req.query.limit ?? '12', 10) || 12;
    const limit = Math.min(Math.max(limitRaw, 1), 50);
    const skip = (page - 1) * limit;
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const genres = parseArrayParam(req.query.genres);
    const platforms = parseArrayParam(req.query.platforms);

    const filters = {};

    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      filters.$or = [
        { name: regex },
        { genre: regex },
        { platform: regex }
      ];
    }

    if (genres.length) filters.genre = { $in: genres };
    if (platforms.length) filters.platform = { $in: platforms };

    const sortKey = typeof req.query.sort === 'string' ? req.query.sort : 'best';
    const sortMap = {
      best:    { averageRating: -1, reviewCount: -1, year: -1 },
      worst:   { averageRating: 1, reviewCount: 1, year: -1 },
      year:    { year: -1, averageRating: -1 },
      reviews: { reviewCount: -1, averageRating: -1, year: -1 }
    };
    const selectedSort = sortMap[sortKey] || sortMap.best;

    const ratingFieldsStage = {
      $addFields: {
        reviewCount: { $size: '$reviews' },
        averageRating: {
          $round: [
            {
              $cond: [
                { $gt: [{ $size: '$reviews' }, 0] },
                {
                  $divide: [
                    {
                      $reduce: {
                        input: '$reviews',
                        initialValue: 0,
                        in: { $add: ['$$value', { $ifNull: ['$$this.stars', 0] }] }
                      }
                    },
                    { $size: '$reviews' }
                  ]
                },
                0
              ]
            },
            2
          ]
        }
      }
    };

    const [totalItems, items, rawGenres, rawPlatforms] = await Promise.all([
      Game.countDocuments(filters),
      Game.aggregate([
        { $match: filters },
        ratingFieldsStage,
        { $sort: selectedSort },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            name: 1,
            genre: 1,
            platform: 1,
            year: 1,
            image: 1,
            averageRating: 1,
            reviewCount: 1
          }
        }
      ]),
      Game.distinct('genre'),
      Game.distinct('platform')
    ]);

    const sanitizeList = (list) =>
      list
        .filter((item) => typeof item === 'string' && item.trim().length)
        .map((item) => item.trim())
        .sort((a, b) => a.localeCompare(b));

    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

    res.json({
      items,
      page,
      pageSize: limit,
      totalItems,
      totalPages,
      availableGenres: sanitizeList(rawGenres),
      availablePlatforms: sanitizeList(rawPlatforms)
    });
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
