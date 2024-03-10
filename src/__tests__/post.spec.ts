import { prisma } from "../routes";
import createServer from "../utils/server";
import supertest from 'supertest';

const app = createServer();

describe("test POST method", () => {
  describe("create a new pog", () => {

    it("should create a pog", async () => {
      // Invocation
      const res = await supertest(app)
        .post("/api/pogs")
        .send({
          name: "Rabbit",
          tickerSymbol: "PGRAAH",
          price: 5.25,
          color: "Yellow"
        });

      // Assessment
      expect(res.status).toBe(201);
      expect(res.body.pog).toEqual(
        expect.objectContaining({
          name: "Rabbit",
          tickerSymbol: "PGRAAH",
          price: "5.25",
          color: "Yellow"
        })
      );
    });
  });

  describe("create a new pog", () => {
    it("should return a 422 error because the data is invalid", async () => {
      // Invocation
      const res = await supertest(app)
        .post("/api/pogs")
        .send({
          name: "Invalid Pog",
          tickerSymbol: "PGINAP",
          price: -123, // Invalid price
          color: "#000000"
        });

      // Assessment
      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("Invalid price.");
    });
  });
});