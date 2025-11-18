import request from "supertest";
import mongoose from "mongoose";
import { jest } from "@jest/globals";
import { app } from "../src/server.js";

import { connectDB } from "../src/config/db.js";

jest.setTimeout(15000);

let token;

beforeAll(async () => {
  await connectDB();
  // Registramos...
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
  });
});
