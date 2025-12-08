import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/server.js';
import { jest } from '@jest/globals';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Game } from '../src/models/Game.js';
import { Review } from '../src/models/Review.js';

jest.setTimeout(15000);

let token;
let userId;
let gameId;

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({});
  await Game.deleteMany({});
  await Review.deleteMany({});

  const registerRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'ReviewUser',
      email: 'review@example.com',
      password: 'Password123'
    });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'review@example.com',
      password: 'Password123'
    });

  token = loginRes.body.token;
  userId = loginRes.body.user.id;

  const game = await Game.create({
    name: 'Test Game for Reviews',
    genre: 'Adventure',
    platform: 'PC',
    year: 2023,
    image: 'test.png'
  });
  gameId = game._id.toString();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Review Routes', () => {
  describe('GET /api/reviews', () => {
    it('should get all reviews', async () => {
      await Review.create({
        user: userId,
        game: gameId,
        stars: 5,
        text: 'An amazing game!'
      });

      const res = await request(app).get('/api/reviews');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('user');
      expect(res.body[0]).toHaveProperty('game');
    });
  });

  describe('POST /api/reviews/:gameId', () => {
    it('should create a new review for a game', async () => {
      const reviewData = {
        stars: 4,
        text: 'Really enjoyed this one.'
      };

      const res = await request(app)
        .post(`/api/reviews/${gameId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(reviewData);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Reseña creada correctamente');
      expect(res.body.review.stars).toBe(4);
      expect(res.body.review.user).toBe(userId);
    });

    it('should return 401 if no token is provided', async () => {
        const reviewData = { stars: 4, text: 'This should fail.' };
        const res = await request(app)
            .post(`/api/reviews/${gameId}`)
            .send(reviewData);
        
        expect(res.statusCode).toBe(401);
    });

    it('should return 400 for an invalid game ID', async () => {
        const reviewData = { stars: 5, text: 'A review.' };
        const res = await request(app)
            .post('/api/reviews/invalidId')
            .set('Authorization', `Bearer ${token}`)
            .send(reviewData);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('ID de juego no válido');
    });

    it('should return 404 for a non-existent game', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        const reviewData = { stars: 5, text: 'A review.' };
        const res = await request(app)
            .post(`/api/reviews/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(reviewData);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Juego no encontrado');
    });

    it('should return 400 for invalid star rating', async () => {
        const reviewData = { stars: 0, text: 'This rating is invalid.' }; // stars < 1
        const res = await request(app)
            .post(`/api/reviews/${gameId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(reviewData);
            
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Las estrellas deben estar entre 1 y 5');

        const reviewData2 = { stars: 6, text: 'This rating is also invalid.' }; // stars > 5
        const res2 = await request(app)
            .post(`/api/reviews/${gameId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(reviewData2);

        expect(res2.statusCode).toBe(400);
    });

    it('should handle server errors during review creation', async () => {
        const createStub = jest.spyOn(Review, 'create').mockImplementationOnce(() => {
            throw new Error('Test server error');
        });

        const reviewData = { stars: 5, text: 'A review.' };
        const res = await request(app)
            .post(`/api/reviews/${gameId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(reviewData);

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe('Error al crear la reseña');
        createStub.mockRestore();
    });
  });
});
