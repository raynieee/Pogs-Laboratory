import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export default function pogs(app: Express) {
  app.post("/api/pogs", async (req: Request, res: Response) => {
    try {
      const { name, tickerSymbol, price, color } = req.body;

      if (price < 0) {
        return res.status(422).json({ error: "Invalid price."});
      }
      
      const newPog = await prisma.pogs.create({
        data: {
          name,
          tickerSymbol,
          price,
          color,
          previousPrice: 0,
        },
      });

      res.status(201).json({ message: "Pog successfully added!", pog: newPog });
    } catch (error) {
      res.status(500).json({ error: "Error adding pog." });
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
      res.status(500).json({ error: "Error fetching pog." });
    }
  });

  app.patch("/api/pogs/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, tickerSymbol, price, color } = req.body;

      const existingPog = await prisma.pogs.findUnique({
        where: { id: Number(id) },
      });

      if (!existingPog) {
        return res.status(404).json({ error: "Pog of that id cannot be found." });
      };

      if (typeof price !== "number" || price < 0) {
        return res.status(422).json({ error: "Invalid price." });
      }

      const updatedPog = await prisma.pogs.update({
        where: { id: Number(id) },
        data: { name, tickerSymbol, price, color },
      });

      res.status(200).json({ message: "Pog successfully updated.", pog: updatedPog });
    } catch (error) {
      res.status(500).json({ error: "Error updating pog." });
    };
  });

  app.delete("/api/pogs/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const existingPog = await prisma.pogs.findUnique({
        where: { id: Number(id) },
      });

      if (!existingPog) {
        return res.status(404).json({ error: "Pog of that id cannot be found." });
      };

      const deletedPog = await prisma.pogs.delete({
        where: { id: Number(existingPog.id) },
      });

      res.status(204).json({ message: "Pog successfully deleted.", pog: deletedPog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting pog." });
    }
  });
}