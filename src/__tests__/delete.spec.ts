import { prisma } from "../routes";
import createServer from "../utils/server";
import supertest from 'supertest';

const app = createServer();

describe("test DELETE method", () => {
  describe("delete a pog", () => {
    let pogId: number;

    beforeEach(async() => {
      // Setup
      await prisma.pogs.deleteMany();

      const newPog = await prisma.pogs.create({
        data: {
          name: "Christopher Robin", 
          tickerSymbol: "PGCRAA",
          price: 5.25,
          color: "Beige"
        },
      });
      pogId = newPog.id;
    });

    it("should delete a pog", async() => {

      // Invocation
      const res = await supertest(app).delete(`/api/pogs/${pogId}`);

      // Assessment
      expect(res.statusCode).toBe(204);
      const deletedPog = await prisma.pogs.findUnique({
        where: {id: pogId},
      });
      expect(deletedPog).toBeNull();
    });
  });
});


describe("test DELETE method", () => {
  describe("delete a non-existent pog", () => {
    it("should return a 404 error because the pog does not exist.", async() => {

    // Invocation
    const res = await supertest(app)
    .delete("/api/pogs/99999")
    .send();

    // Assessment
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
      
    })
  });
});