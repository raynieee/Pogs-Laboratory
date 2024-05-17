import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export default function priceChange(app: Express) {
  app.post("/randomize-price", async (req: Request, res: Response) => {
    try {
      const pogs = await prisma.pogs.findMany();
  
      const updates = pogs.map(pog => {
        const currentPrice = pog.price.toNumber();
        const newPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.1); // random adjust by ±5%
        
        return prisma.pogs.update({
          where: { id: pog.id },
          data: { 
            price: newPrice,
            previousPrice: currentPrice
          },
        });
      });
  
      await Promise.all(updates);

      const updatedPogs = await prisma.pogs.findMany();
      const pogUpdates = updatedPogs.map(updatedPog => {
        let color = "red" || "green" || "black"
        let setPercentage: string;
        let price = updatedPog.price.toNumber();
        let previousPrice = updatedPog.previousPrice.toNumber();

        if (updatedPog.previousPrice.toNumber() === 0) { //new pog
          setPercentage = "0.00%";
          color = "black";
        } else {
          let percentage = ((price - previousPrice) / previousPrice) * 100

          if (percentage > 0) {
            setPercentage = `+${percentage.toFixed(2)}%`;
            color = "green";
          } else if (percentage < 0) {
            setPercentage = `-${percentage.toFixed(2)}%`;
            color = "red";
          } else {
            setPercentage = "0.00%"; //if no change in price
            color = "black";
          }
        }

        return {
          id: updatedPog.id,
          ticker_symbol: updatedPog.tickerSymbol,
          color: color,
          percentage: setPercentage,
        };
      });
  
      res.status(200).json({ message: "Pog prices randomized successfully.", updates: pogUpdates });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error randomizing pog prices." });
    }
  });
}