import { prisma } from "../routes/pogs";
import createServer from "../routes/server";
import supertest from "supertest";

const app = createServer();

describe("test GET method", () => {
  afterEach(async () => {
    //Teardown
    await prisma.pogs.deleteMany();
  });

  describe("show all pogs", () => {
    describe("given a couple of pogs exists in the database", () => {
      beforeEach(async () => {
        // Setup
        await prisma.pogs.createMany({
          data: [
            {
              name: "Winnie the Pooh",
              tickerSymbol: "PGWPAB",
              price: 5.25,
              color: "#fff19c",
              previousPrice: 0.00
            },
            {
              name: "Piglet",
              tickerSymbol: "PGPIAC",
              price: 5.25,
              color: "Pink",
              previousPrice: 0.00
            },
          ],
        });
      });

      it("should return all pogs", async () => {
        // Invocation
        const res = await supertest(app).get("/api/pogs");

        // Assessment
        expect(res.statusCode).toBe(200);
        expect(res.body.pogs).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: "Winnie the Pooh",
              tickerSymbol: "PGWPAB",
              price: "5.25",
              color: "#fff19c",
            }),
            expect.objectContaining({
              name: "Piglet",
              tickerSymbol: "PGPIAC",
              price: "5.25",
              color: "Pink",
            }),
          ])
        );
      });
    });
  });
});

describe("show one pog", () => {
  describe("given a couple of pogs exists in the database", () => {
    let pogId1: number, pogId2: number;

    beforeAll(async () => {
      // Setup
      await prisma.pogs.deleteMany();

      const newPog1 = await prisma.pogs.create({
        data: {
          name: "Kanga",
          tickerSymbol: "PGKAAD",
          price: 5.25,
          color: "Brown",
          previousPrice: 0.00
        },
      });
      pogId1 = newPog1.id;

      const newPog2 = await prisma.pogs.create({
        data: {
          name: "Roo",
          tickerSymbol: "PGROAE",
          price: 5.25,
          color: "Blue",
          previousPrice: 0.00
        },
      });
      pogId2 = newPog2.id;
    });

    it("should return one pog", async () => {
      // Invocation
      const res = await supertest(app).get(`/api/pogs/${pogId1}`);

      // Assessment
      expect(res.statusCode).toBe(200);
      expect(res.body.pog).toEqual(
        expect.objectContaining({
          id: pogId1,
          name: "Kanga",
          tickerSymbol: "PGKAAD",
          price: "5.25",
          color: "Brown",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
    });
  });
});