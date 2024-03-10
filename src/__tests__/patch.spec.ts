import { prisma } from "../routes";
import createServer from "../utils/server";
import supertest from 'supertest';

const app = createServer();

describe("test PATCH method", () => {
  describe("update a single field in a pog", () => {
    let pogId: number;

    beforeEach(async() => {
      // Setup
      const newPog = await prisma.pogs.create({
        data: {
          name: "Tigger", 
          tickerSymbol: "PGTIAF",
          price: 5.25,
          color: "Red"
        },
      });
      pogId = newPog.id;
    });

    it("should update a single field only", async() => {

      // Invocation
      const res = await supertest(app)
      .patch(`/api/pogs/${pogId}`)
      .send({
        color: "Orange"
      });

      // Assessment
      expect(res.statusCode).toBe(200);
      expect(res.body.pog).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: "Tigger", 
          tickerSymbol: "PGTIAF",
          price: "5.25",
          color: "Orange",
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      );
    });
  });
});

describe("test PATCH method", () => {
  describe("update multiple fields of a pog", () => {
    let pogId: number;

    beforeEach(async() => {
      // Setup
      const newPog = await prisma.pogs.create({
        data: {
          name: "Eeyore", 
          tickerSymbol: "PGEEAG",
          price: 7.25,
          color: "#005681"
        },
      });
      pogId = newPog.id;
    });

    it("should update multiple fields of a pog", async() => {

      // Invocation
      const res = await supertest(app)
      .patch(`/api/pogs/${pogId}`)
      .send({
        price: 9.25,
        color: "#7BA1D2"
      });

      // Assessment
      expect(res.statusCode).toBe(200);
      expect(res.body.pog).toEqual(
        expect.objectContaining({
          name: "Eeyore", 
          tickerSymbol: "PGEEAG",
          price: "9.25",
          color: "#7BA1D2",
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      );
    });
  });
});

describe("test PATCH method", () => {
  describe("update a non-existent pog", () => {
    it("should return an error because the pog does not exist.", async() => {
      
    // Invocation
    const res = await supertest(app)
    .patch("/api/pogs/99999")
    .send({
      name: "Non-existent Pog"
    });

    // Assessment
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

describe("test PATCH method", () => {
  describe("update a pog with invalid data", () => {
    let pogId: number;

    beforeEach(async () => {
      // Setup
      const newPog = await prisma.pogs.create({
        data: {
          name: "Eeyore", 
          tickerSymbol: "PGEEAC",
          price: 5.25,
          color: "#7BA1D2"
        },
      });
      pogId = newPog.id;
    });

    afterEach(async () => {
      // Teardown
      await prisma.pogs.delete({
        where: { id: pogId },
      });
    });

    it("should return a 422 error because the data is invalid", async() => {
      // Invocation
      const res = await supertest(app)
        .patch(`/api/pogs/${pogId}`)
        .send({
          name: "Eeyore",
          price: -5.25, // Invalid price
        });

        // Assessment
        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty("error");
      })
    });
  });
});