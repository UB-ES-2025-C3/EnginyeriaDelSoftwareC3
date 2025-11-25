import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import solicitudRoutes from '../src/routes/solicitud.routes.js';
import { Solicitud } from '../src/models/Solicitud.js';
import { connectDB } from '../src/config/db.js';

const app = express();
app.use(express.json());
app.use('/api', solicitudRoutes);

describe('Solicitud Routes', () => {

  beforeAll(async () => {
    await connectDB();
    await Solicitud.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/solicitudes', () => {
    it('should create a new solicitud without files', async () => {
      const solicitudData = {
        nombre: 'John Doe',
        email: 'john@example.com',
        tipo: 'queja',
        asunto: 'Test Asunto',
        mensaje: 'Test Mensaje',
      };

      const res = await request(app)
        .post('/api/solicitudes')
        .send(solicitudData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('John Doe');
      
      const savedSolicitud = await Solicitud.findById(res.body.data._id);
      expect(savedSolicitud).not.toBeNull();
    });

    it('should return 400 if required fields are missing', async () => {
        const res = await request(app)
            .post('/api/solicitudes')
            .send({ nombre: 'John Doe' });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Tots els camps són obligatoris');
    });
  });

  describe('GET /api/solicitudes', () => {
    let solicitudId;

    beforeAll(async () => {
        const solicitud = new Solicitud({
            nombre: 'Get Test',
            email: 'get@test.com',
            tipo: 'comentario',
            asunto: 'Get All',
            mensaje: 'Test for GET routes'
        });
        const saved = await solicitud.save();
        solicitudId = saved._id.toString();
    });

    it('should get all solicitudes', async () => {
        const res = await request(app).get('/api/solicitudes');
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should get a single solicitud by ID', async () => {
        const res = await request(app).get(`/api/solicitudes/${solicitudId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data._id).toBe(solicitudId);
    });

    it('should return 404 for a non-existent solicitud ID', async () => {
        const nonExistentId = '605cde4f1f292e0015a1b555';
        const res = await request(app).get(`/api/solicitudes/${nonExistentId}`);
        expect(res.statusCode).toEqual(404);
    });
  });

  describe('PATCH and DELETE', () => {
    let solicitudId;

    beforeEach(async () => {
        const solicitud = new Solicitud({
            nombre: 'Modify Test',
            email: 'modify@test.com',
            tipo: 'queja',
            asunto: 'Modify',
            mensaje: 'Test for PATCH/DELETE',
            leido: false,
        });
        const saved = await solicitud.save();
        solicitudId = saved._id.toString();
    });

    it('should mark a solicitud as read', async () => {
        const res = await request(app).patch(`/api/solicitudes/${solicitudId}/leido`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.leido).toBe(true);
    });

    it('should delete a solicitud', async () => {
        const res = await request(app).delete(`/api/solicitudes/${solicitudId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Solicitud eliminada correctament');

        const found = await Solicitud.findById(solicitudId);
        expect(found).toBeNull();
    });
  });
});
