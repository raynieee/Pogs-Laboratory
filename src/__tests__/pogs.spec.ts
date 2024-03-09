import { prisma } from "../routes";
import createServer from "../utils/server";
import supertest from 'supertest';

const app = createServer();

describe("pog", () => {
  describe("show all pogs", () => {
    describe("given a couple of pogs exists in the database", () => {
      beforeEach(async () => {
        // Setup
        await prisma.pogs.createMany({
          data: [
            {
              name: "Eeyore", 
              tickerSymbol: "PGEEAC",
              price: 5,
              color: "#7BA1D2"
            },
            {
              name: "Tigger",
              tickerSymbol: "PGTIAD",
              price: 5,
              color: "Orange"
            }
          ]
        });
      });

      afterEach(async () => {
        // Teardown
        await prisma.pogs.deleteMany();
      })

      it("should return all pogs", async () => {

        // Invocation
        const res = await supertest(app).get("/api/pogs");

        // Assessment
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
      });
    });
  });
});