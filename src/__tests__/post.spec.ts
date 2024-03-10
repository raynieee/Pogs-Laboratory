import { prisma } from "../routes";
import createServer from "../utils/server";
import supertest from 'supertest';

const app = createServer();

describe("test POST method", () => {
 describe("create a new pog", () => {
    let pogId: number;
    
    beforeEach(async() => {
      // Setup
      const newPog = await prisma.pogs.create({
        data: {
          name: "Rabbit",
          tickerSymbol: "PGRAAH",
          price: 5.25,
          color: "Yellow"
        },
      });
      pogId = newPog.id;
    });
    
    afterEach(async() => {
      // Teardown: Check if pogId is defined before attempting to delete
      if (pogId) {
        await prisma.pogs.delete({
          where: {id: pogId},
        });
      }
    });

    it("should create a pog", async() => {
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
          price: 5.25,
          color: "Yellow"
        })
      );
    });
 });

 describe("create a new pog", () => {
    it("should return a 422 error because the data is invalid", async() => {
      // Invocation
      const res = await supertest(app)
        .post("/api/pogs")
        .send({
          name: "Invalid Pog",
          price: -123, // Invalid price
        });

      // Assessment
      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty("error");
    });
 });
});