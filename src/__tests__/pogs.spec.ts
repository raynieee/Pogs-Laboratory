import { prisma } from "../routes";
import createServer from "../utils/server";
import supertest from 'supertest';

const app = createServer();

describe("test GET method", () => {
  describe("show all pogs", () => {
    describe("given a couple of pogs exists in the database", () => {
      beforeEach(async () => {
        // Setup
        await prisma.pogs.createMany({
          data: [
            {
              name: "Eeyore", 
              tickerSymbol: "PGEEAC",
              price: 5.25,
              color: "#7BA1D2"
            },
            {
              name: "Tigger",
              tickerSymbol: "PGTIAD",
              price: 5.25,
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
        expect(res.body.pogs).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: "Eeyore",
              tickerSymbol: "PGEEAC",
              price: "5.25",
              color: "#7BA1D2",
            }),
            expect.objectContaining({
              name: "Tigger",
              tickerSymbol: "PGTIAD",
              price: "5.25",
              color: "Orange",
            }),
          ])
        );
      });
    });
  });
});

describe("test PATCH method", () => {
  describe("update a pog", () => {
    let pogId: number;

    beforeEach(async() => {
      // Setup
      const newPog = await prisma.pogs.create({
        data: {
          name: "Eeyore",
          tickerSymbol: "PGEEAC",
          price: 5.25,
          color: "7BA1D2",
        }
      });
      pogId = newPog.id;
    });

    afterEach(async() => {
      // Teardown
      await prisma.pogs.delete({
        where: {id:pogId},
      });
    });

    it("should update a pog", async() => {

      // Invocation
      const res = await supertest(app)
      .patch(`/api/pogs/${pogId}`)
      .send({
        name: "Eeyore Updated",
        tickerSymbol: "PGEEAC",
        price: 6.25,
        color: "#7BA1D2"
      });

      // Assessment
      expect(res.statusCode).toBe(200);
      expect(res.body.pog).toEqual(
        expect.objectContaining({
          name: "Eeyore Updated",
          tickerSymbol: "PGEEAC",
          price: 6.25,
          color: "#7BA1D2"
        })
      );
    });
  });
});

describe("test DELETE method", () => {
  describe("delete a pog", () => {
    let pogId: number;

    beforeEach(async() => {
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

    it("should delete a pog", async() => {

      // Invocation
      const res = await supertest(app).delete(`/api/pogs/${pogId}`);

      // Assessment
      expect(res.statusCode).toBe(200);
      expect(res.body.pog).toEqual(
        expect.objectContaining({
          name: "Eeyore",
          tickerSymbol: "PGEEAC",
          price: 5.25,
          color: "#7BA1D2"
        })
      );

      const deletedPog = await prisma.pogs.findUnique({
        where: {id: pogId},
      });
      expect(deletedPog).toBeNull();
    });
  });
});