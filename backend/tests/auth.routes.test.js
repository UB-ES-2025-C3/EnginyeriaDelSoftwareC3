import request from "supertest";
import mongoose from "mongoose";
import { app } from "../src/server.js";
import { User } from "../src/models/User.js";
import { connectDB } from "../src/config/db.js";
import { jest } from '@jest/globals';

jest.setTimeout(15000);

let existingUserToken;
const existingUserCredentials = {
  name: "ExistingUser",
  email: "existing@example.com",
  password: "Password123"
};

beforeAll(async () => {
  await connectDB();
  // Registrar un usuario que ya existe para pruebas de email duplicado
  await request(app).post("/api/auth/register").send(existingUserCredentials);
  const loginRes = await request(app).post("/api/auth/login").send({
    email: existingUserCredentials.email,
    password: existingUserCredentials.password
  });
  existingUserToken = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Auth routes", () => {
  describe("POST /api/auth/register", () => {
    test("debería registrar un usuario nuevo", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "NewUser",
          email: "newuser@example.com",
          password: "Abc12345"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe("newuser@example.com");
    });

    test("debería devolver 400 si faltan campos obligatorios", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "Incomplete", email: "incomplete@example.com" }); // Falta password

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Tots els camps són obligatoris");
    });

    test("debería devolver 400 si el email ya está registrado", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(existingUserCredentials);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Aquest correu ja està registrat");
    });
  });

  describe("POST /api/auth/login", () => {
    test("debería iniciar sesión correctamente con credenciales válidas", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send(existingUserCredentials);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe(existingUserCredentials.email);
    });

    test("debería devolver 400 si faltan email o password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "missing@example.com" }); // Falta password

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email i contrasenya són obligatoris");
      expect(res.body.errorType).toBe("MISSING_FIELDS");
    });

    test("debería devolver 401 si el email no está registrado", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nonexistent@example.com", password: "Password123" });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("El correu no està registrat");
      expect(res.body.errorType).toBe("EMAIL_NOT_FOUND");
    });

    // test("debería devolver 401 si la contraseña es incorrecta", async () => {
    //   const res = await request(app)
    //     .post("/api/auth/login")
    //     .send({ email: existingUserCredentials.email, password: "WrongPassword" });

    //   expect(res.statusCode).toBe(401);
    //   expect(res.body.error).toBe("La contrasenya no és correcta");
    //   expect(res.body.errorType).toBe("INVALID_PASSWORD");
    // });
  });

  describe("GET /api/auth/me", () => {
    // test("debería devolver usuario con token válido", async () => {
    //   const res = await request(app)
    //     .get("/api/auth/me")
    //     .set("Authorization", `Bearer ${existingUserToken}`);

    //   expect(res.statusCode).toBe(200);
    //   expect(res.body.user.email).toBe(existingUserCredentials.email);
    // });

    test("debería devolver 401 sin token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("No autorizado");
    });

    test("debería devolver 401 con token inválido", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer invalidtoken123`);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Token inválido");
    });
    
    // Este test es difícil de simular sin mocks más profundos de mongoose
    // test("debería devolver 404 si el usuario no es encontrado después de validar el token", async () => {
    //   // Simular un escenario donde el token es válido pero el usuario no existe en DB
    //   // Esto requeriría mockear jwt.verify para devolver un ID válido y luego User.findById para devolver null
    // });
  });
});