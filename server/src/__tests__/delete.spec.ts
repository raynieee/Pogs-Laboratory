import { prisma } from "../routes/pogs";
import createServer from "../routes/server";
import supertest from "supertest";

const app = createServer();

describe("test DELETE method", () => {
  afterEach(async () => {
    //Teardown
    await prisma.pogs.deleteMany();
  });

  describe("delete a pog", () => {
    let pogId: number;

    beforeEach(async () => {
      // Setup
      const newPog = await prisma.pogs.create({
        data: {
          name: "Christopher Robin",
          tickerSymbol: "PGCRAA",
          price: 5.25,
          color: "Beige",
        },
      });
      pogId = newPog.id;
    });

    it("should delete a pog", async () => {
      // Invocation
      const res = await supertest(app).delete(`/api/pogs/${pogId}`);

      // Assessment
      expect(res.statusCode).toBe(204);
      const deletedPog = await prisma.pogs.findUnique({
        where: { id: pogId },
      });
      expect(deletedPog).toBeNull();
    });
  });

  describe("delete a non-existent pog", () => {
    it("should return a 404 error because the pog does not exist.", async () => {
      // Invocation
      const res = await supertest(app).delete("/api/pogs/99999").send();

      // Assessment
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });
});