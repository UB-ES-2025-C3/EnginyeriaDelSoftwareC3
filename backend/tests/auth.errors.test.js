import request from "supertest";
import mongoose from "mongoose";
import { app } from "../src/server.js";
import { connectDB } from "../src/config/db.js";

describe("Auth routes - error paths", () => {
  beforeAll(async () => {
    await connectDB();
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Existing User",
        email: "existing-error@example.com",
        password: "Abc12345"
      });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  test("POST /api/auth/login amb contrasenya incorrecta → 401 INVALID_PASSWORD", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "existing-error@example.com",
        password: "WrongPass1!"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("errorType", "INVALID_PASSWORD");
    expect(res.body.error).toBe("La contrasenya no és correcta");
  });

  test("POST /api/auth/register amb email duplicat → 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: "existing-error@example.com",
        password: "Abc12345"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Aquest correu ja està registrat");
  });
});
