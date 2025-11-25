import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import gameRoutes from '../src/routes/game.routes.js';
import { Game } from '../src/models/Game.js';
import { connectDB } from '../src/config/db.js';

// Setup Express app
const app = express();
app.use(express.json());
app.use('/api/games', gameRoutes);

describe('Game Routes', () => {
  beforeAll(async () => {
    await connectDB();
    await Game.deleteMany({});
    await Game.insertMany([
      { name: 'Game A - RPG', genre: 'RPG', platform: 'PC', year: 2022, reviews: [{ stars: 5 }, { stars: 4 }] }, // Avg: 4.5, Reviews: 2
      { name: 'Game B - Action', genre: 'Action', platform: 'PS5', year: 2023, reviews: [{ stars: 3 }] }, // Avg: 3, Reviews: 1
      { name: 'Game C - Another RPG', genre: 'RPG', platform: 'Xbox', year: 2021, reviews: [{ stars: 5 }, { stars: 5 }, { stars: 5 }] }, // Avg: 5, Reviews: 3
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /api/games', () => {
    // it('should return a paginated list of games', async () => {
    //   const res = await request(app).get('/api/games');
    //   expect(res.statusCode).toEqual(200);
    //   expect(res.body.items).toHaveLength(3);
    //   expect(res.body.totalItems).toBe(3);
    //   expect(res.body.page).toBe(1);
    // });

    it('should filter by search query "Action"', async () => {
      const res = await request(app).get('/api/games?q=Action');
      expect(res.statusCode).toEqual(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].name).toBe('Game B - Action');
    });

    it('should filter by genre "RPG"', async () => {
      const res = await request(app).get('/api/games?genres=RPG');
      expect(res.statusCode).toEqual(200);
      expect(res.body.items).toHaveLength(2);
    });
    
    it('should sort by "best" (averageRating desc)', async () => {
        const res = await request(app).get('/api/games?sort=best');
        expect(res.statusCode).toEqual(200);
        expect(res.body.items[0].name).toBe('Game C - Another RPG'); // Avg 5
        expect(res.body.items[1].name).toBe('Game A - RPG'); // Avg 4.5
    });

    it('should sort by "worst" (averageRating asc)', async () => {
        const res = await request(app).get('/api/games?sort=worst');
        expect(res.statusCode).toEqual(200);
        expect(res.body.items[0].name).toBe('Game B - Action'); // Avg 3
        expect(res.body.items[1].name).toBe('Game A - RPG'); // Avg 4.5
    });

    it('should handle pagination correctly', async () => {
        const res = await request(app).get('/api/games?page=2&limit=2');
        expect(res.statusCode).toEqual(200);
        expect(res.body.items).toHaveLength(1);
        expect(res.body.page).toBe(2);
        expect(res.body.pageSize).toBe(2);
        expect(res.body.totalPages).toBe(2);
    });
  });

  describe('GET /api/games/:id', () => {
    it('should return a single game for a valid ID', async () => {
      const game = await Game.findOne({ name: 'Game A - RPG' });
      const res = await request(app).get(`/api/games/${game._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe('Game A - RPG');
    });

    it('should return 404 for a non-existent ID', async () => {
      const nonExistentId = '605cde4f1f292e0015a1b555';
      const res = await request(app).get(`/api/games/${nonExistentId}`);
      expect(res.statusCode).toEqual(404);
    });

    it('should return 400 for an invalid ID format', async () => {
      const invalidId = '123';
      const res = await request(app).get(`/api/games/${invalidId}`);
      expect(res.statusCode).toEqual(400);
    });
  });
});
