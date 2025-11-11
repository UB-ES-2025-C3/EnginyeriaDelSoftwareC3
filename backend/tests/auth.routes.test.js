import request from "supertest";
import mongoose from "mongoose";
import { app } from "../src/server.js";
import { User } from "../src/models/User.js";
import { connectDB } from "../src/config/db.js";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Auth routes", () => {
  test("POST /api/auth/register → debería registrar un usuario nuevo", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "TestUser",
        email: "test@example.com",
        password: "Abc12345"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("test@example.com");
  });

  test("POST /api/auth/login → debería iniciar sesión correctamente", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "Abc12345"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("GET /api/auth/me → debería devolver usuario con token válido", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "Abc12345" });

    const token = loginRes.body.token;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("test@example.com");
  });
});
