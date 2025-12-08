import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/server.js';
import { Post } from '../src/models/Post.js';
import { User } from '../src/models/User.js';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.js';
import { connectDB } from '../src/config/db.js';

describe('Post Routes', () => {
    let token;
    let userId;

    beforeAll(async () => {
        await connectDB();

        // Create a test user
        const user = new User({
            name: 'Test User',
            email: 'test@example.com',
            passwordHash: 'hashedpassword'
        });
        await user.save();
        userId = user._id;

        // Generate token
        token = jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: '1h' });
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Post.deleteMany({});
    });

    describe('GET /api/posts', () => {
        it('should return an empty list initially', async () => {
            const res = await request(app).get('/api/posts');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('should return a list of posts', async () => {
            await Post.create({
                text: 'Hello World',
                user: userId
            });

            const res = await request(app).get('/api/posts');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].text).toBe('Hello World');
            expect(res.body[0].user.name).toBe('Test User');
        });
    });

    describe('POST /api/posts', () => {
        it('should create a new post when authenticated', async () => {
            const res = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    text: 'New Post',
                    videoUrl: 'https://youtube.com/watch?v=123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.post.text).toBe('New Post');
            expect(res.body.post.videoUrl).toBe('https://youtube.com/watch?v=123');

            const posts = await Post.find();
            expect(posts.length).toBe(1);
        });

        it('should fail if text is empty', async () => {
            const res = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    text: '   '
                });

            expect(res.statusCode).toBe(400);
        });

        it('should fail if not authenticated', async () => {
            const res = await request(app)
                .post('/api/posts')
                .send({
                    text: 'New Post'
                });

            expect(res.statusCode).toBe(401);
        });
    });
});
