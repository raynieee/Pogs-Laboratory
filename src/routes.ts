import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
function routes(app: Express) {
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
  });

  app.post("/api/pogs", async (req: Request, res: Response) => {
    try {
      const { name, tickerSymbol, price, color } = req.body;
      const newPog = await prisma.pogs.create({
        data: {
          name,
          tickerSymbol,
          price,
          color,
        },
      });
      res.status(201).json({ message: "Pog successfully added!", pog: newPog });
    } catch (error) {
      console.error(error);
      res.status(422).json({ error: "Please modify your entries." });
    }
  });

  app.get("/api/pogs", async (req: Request, res: Response) => {
    try {
      const pogs = await prisma.pogs.findMany();
      res.status(200).json({ message: "Successfully fetched pogs.", pogs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching pogs." });
    }
  });

  app.get("/api/pogs/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const pog = await prisma.pogs.findUnique({
        where: { id: Number(id) },
      });

      if (!pog) {
        res.status(404).json({ error: "Pog of that id cannot be found." });
      } else {
        res.status(200).json({ message: "Pog successfully fetched.", pog });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching pog." });
    }
  });

  app.patch("/api/pogs/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, tickerSymbol, price, color } = req.body;

      const updatedPog = await prisma.pogs.update({
        where: { id: Number(id) },
        data: { name, tickerSymbol, price, color },
      });

      if (!updatedPog) {
        res.status(404).json({ error: "Pog of that id cannot be found." });
      } else {
        res
          .status(200)
          .json({ message: "Pog successfully updated.", pog: updatedPog });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating pog." });
    }
  });

  app.delete("/api/pogs/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedPog = await prisma.pogs.delete({
        where: { id: Number(id) },
      });

      if (!deletedPog) {
        res.status(404).json({ error: "Pog of that id cannot be found." });
      } else {
        res
          .status(200)
          .json({ message: "Pog successfully updated.", pog: deletedPog });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting pog." });
    }
  });
}

export default routes;
