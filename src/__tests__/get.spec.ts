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
                name: "Winnie the Pooh", 
                tickerSymbol: "PGWPAB",
                price: 5.25,
                color: "##fff19c"
              },
              {
                name: "Piglet",
                tickerSymbol: "PGPIAC",
                price: 5.25,
                color: "Pink"
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
                name: "Winnie the Pooh", 
                tickerSymbol: "PGWPAB",
                price: "5.25",
                color: "#fff19c"
              }),
              expect.objectContaining({
                name: "Piglet",
                tickerSymbol: "PGPIAC",
                price: "5.25",
                color: "Pink"
              }),
            ])
          );
        });
        
      });
    });
});

describe("test GET method", () => {
    describe("show one pog", () => {
        describe("given a couple of pogs exists in the database", () => {
            beforeAll(async () => {
                // Setup
                await prisma.pogs.createMany({
                    data: [
                        {
                          name: "Kanga",
                          tickerSymbol: "PGKAAD",
                          price: 5.25,
                          color: "Brown"
                        },
                        {
                          name: "Roo",
                          tickerSymbol: "PGROAE",
                          price: 5.25,
                          color: "Blue"
                        }
                    ]
                });
            });

            afterAll(async () => {
                // Teardown
                await prisma.pogs.deleteMany();
            })

            it("should return one pog", async () => {
                // Invocation
                const firstPog = await prisma.pogs.findFirst({orderBy: {id: 'asc'}})
                var pogId = firstPog?.id
                const res = await supertest(app).get(`/api/pogs/${pogId}`);

                // Assessment
                expect(res.statusCode).toBe(200);
                expect(res.body).toEqual(
                    expect.objectContaining({
                        id: pogId,
                        name: "Kanga",
                        tickerSymbol: "PGKAAD",
                        price: "5.25",
                        color: "Brown",
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String) 
                    })
                );
            });
        });
    });
});