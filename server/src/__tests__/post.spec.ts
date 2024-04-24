import { prisma } from "../routes/home/pogs";
import createServer from "../routes/server";
import supertest from "supertest";

const app = createServer();

describe("test POST method", () => {
  afterEach(async () => {
    //Teardown
    await prisma.pogs.deleteMany();
  });

  describe("create a new pog", () => {
    it("should create a pog", async () => {
      // Invocation
      const createPog = await supertest(app).post("/api/pogs").send({
        name: "Rabbit",
        tickerSymbol: "PGRAAH",
        price: 5.25,
        color: "Yellow",
      });

      // Assessment
      expect(createPog.status).toBe(201);
      expect(createPog.body.pog).toEqual(
        expect.objectContaining({
          name: "Rabbit",
          tickerSymbol: "PGRAAH",
          price: "5.25",
          color: "Yellow",
        })
      );
    });
  });

  describe("create a new invalid pog", () => {
    it("should return a 422 error because the data is invalid", async () => {
      // Invocation
      const invalidPog = await supertest(app).post("/api/pogs").send({
        name: "Invalid Pog",
        tickerSymbol: "PGINAP",
        price: -123, // Invalid price
        color: "#000000",
      });

      // Assessment
      expect(invalidPog.statusCode).toBe(422);
      expect(invalidPog.body).toHaveProperty("error");
      expect(invalidPog.body.error).toBe("Invalid price.");
    });
  });
});
