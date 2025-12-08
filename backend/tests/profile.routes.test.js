import request from "supertest";
import mongoose from "mongoose";
import { app } from "../src/server.js";
import { jest } from '@jest/globals'; // Added

import { connectDB } from "../src/config/db.js";
import { User } from '../src/models/User.js'; // Importar el modelo de usuario

jest.setTimeout(15000);

let token;
let userId;

beforeAll(async () => {
  await connectDB();
  // Registramos y logueamos un usuario de prueba
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({
      name: "TestUser",
      email: "test@example.com",
      password: "Abc12345"
    });

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({
      email: "test@example.com",
      password: "Abc12345"
    });

  token = loginRes.body.token;
  userId = loginRes.body.user.id; // Guardar el ID del usuario para futuras pruebas
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Profile routes", () => {
  test("GET /api/profile/me sin token → debería denegar acceso", async () => {
    const res = await request(app).get("/api/profile/me");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("No autorizado");
  });

  test("GET /api/profile/me con token válido → debería devolver el perfil", async () => {
    const res = await request(app)
      .get("/api/profile/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email");
    expect(res.body.email).toBe("test@example.com");
    expect(res.body.name).toBe("TestUser");
  });

  describe("PUT /api/profile/me", () => {
    test("Debería actualizar el perfil del usuario con datos válidos", async () => {
      const updatePayload = {
        name: "Updated Name",
        bio: "This is my updated bio.",
        links: { twitch: "https://twitch.tv/updated", psn: "updatedPSN" }
      };

      const res = await request(app)
        .put("/api/profile/me")
        .set("Authorization", `Bearer ${token}`)
        .send(updatePayload);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(updatePayload.name);
      expect(res.body.bio).toBe(updatePayload.bio);
      expect(res.body.links.twitch).toBe(updatePayload.links.twitch);
      expect(res.body.links.psn).toBe(updatePayload.links.psn);

      const userInDb = await User.findById(userId);
      expect(userInDb).not.toBeNull();
      expect(userInDb.name).toBe(updatePayload.name);
      expect(userInDb.bio).toBe(updatePayload.bio);
      expect(userInDb.links.twitch).toBe(updatePayload.links.twitch);
    });

    test("Debería devolver 400 si el nombre es demasiado corto", async () => {
      const updatePayload = { name: "A" }; // Menos de 2 caracteres
      const res = await request(app)
        .put("/api/profile/me")
        .set("Authorization", `Bearer ${token}`)
        .send(updatePayload);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Dades invàlides");
      expect(res.body.details[0].message).toContain("Min 2 caràcters");
    });
    
    test("Debería devolver 400 si el nombre es demasiado largo", async () => {
      const updatePayload = { name: "A".repeat(61) };
      const res = await request(app)
        .put("/api/profile/me")
        .set("Authorization", `Bearer ${token}`)
        .send(updatePayload);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Dades invàlides");
      expect(res.body.details[0].message).toContain("Max 60 caràcters");
    });

    test("Debería devolver 400 si la bio es demasiado larga", async () => {
      const updatePayload = { bio: "A".repeat(251) };
      const res = await request(app)
        .put("/api/profile/me")
        .set("Authorization", `Bearer ${token}`)
        .send(updatePayload);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Dades invàlides");
      expect(res.body.details[0].message).toContain("Max 250 caràcters");
    });

    test("Debería devolver 400 si el URL de Twitch es inválido", async () => {
      const updatePayload = { links: { twitch: "invalid-url" } };
      const res = await request(app)
        .put("/api/profile/me")
        .set("Authorization", `Bearer ${token}`)
        .send(updatePayload);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Dades invàlides");
      expect(res.body.details[0].message).toContain("URL de Twitch invàlida");
    });

    test("PUT /api/profile/me sin token → debería denegar acceso", async () => {
      const res = await request(app)
        .put("/api/profile/me")
        .send({ name: "Unauthorized" });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("No autorizado");
    });
  });

  describe("POST /api/profile/me/media", () => {
    test("Debería subir un avatar y devolver la URL", async () => {
      const res = await request(app)
        .post("/api/profile/me/media")
        .set("Authorization", `Bearer ${token}`)
        .attach('avatar', 'tests/fixtures/test-image.png');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('avatarUrl');
      expect(res.body.avatarUrl).toContain('.png');
    });

    test("Debería subir un banner y devolver la URL", async () => {
      const res = await request(app)
        .post("/api/profile/me/media")
        .set("Authorization", `Bearer ${token}`)
        .attach('banner', 'tests/fixtures/test-image.png');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('bannerUrl');
      expect(res.body.bannerUrl).toContain('.png');
    });

    test("Debería devolver 400 si el fichero es demasiado grande", async () => {
      const res = await request(app)
        .post("/api/profile/me/media")
        .set("Authorization", `Bearer ${token}`)
        .attach('avatar', 'tests/fixtures/large-image.png');
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('FILE_TOO_LARGE');
    });

  });
});