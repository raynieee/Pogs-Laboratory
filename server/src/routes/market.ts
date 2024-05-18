import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export default function market(app: Express) {
  app.post("/buy/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userId, sharesToBuy } = req.body;

      // getting data of pog to be bought
      const pog = await prisma.pogs.findUnique({
        where: { id: Number(id) },
      });

      // null check, ensures pog is not null
      if (!pog) {
        return res.status(404).json({ error: "Pog not found." });
      }

      // convert pog price from decimal to number
      const sharePrice = pog.price.toNumber();
      const totalCost = sharePrice * sharesToBuy;

      // getting userId to determine amount in wallet
      const user = await prisma.users.findUnique({
        where: { id: userId },
      });

      // null check, ensures user is not null
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // convert pog price from decimal to number
      const userWalletAmount = user.eWalletAmount.toNumber();

      // checks if there is enough money to buy the shares
      if (userWalletAmount < totalCost) {
        return res.status(400).json({ error: "Insufficient funds." });
      }

      // update user's wallet balance
      await prisma.users.update({
        where: { id: userId },
        data: {
          eWalletAmount: user.eWalletAmount.minus(totalCost),
        },
      });

      // create a new userpogs entry
      await prisma.userpogs.create({
        data: {
          userId,
          pogId: pog.id,
          quantity: sharesToBuy,
        },
      });

      res.status(200).json({ message: "Shares purchased successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error processing the purchase." });
    }
  });

  app.post("/sell/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userId, sharesToSell } = req.body;

      const pog = await prisma.pogs.findUnique({
        where: { id: Number(id) },
      });

      if (!pog) {
        return res.status(404).json({ error: "Pog not found." });
      }

      const userPog = await prisma.userpogs.findUnique({
        where: {
          userId_pogId: {
            userId: userId,
            pogId: pog.id,
          },
        },
      });

      if (!userPog) {
        return res.status(404).json({ error: "User does not own any shares of this Pog." });
      }

      if (userPog.quantity < sharesToSell) {
        return res.status(400).json({ error: "Not enough shares to sell." });
      }

      const sharePrice = pog.price.toNumber();
      const totalSaleValue = sharePrice * sharesToSell;

      const updatedQuantity = userPog.quantity - sharesToSell;

      const user = await prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      await prisma.users.update({
        where: { id: userId },
        data: {
          eWalletAmount: user.eWalletAmount.plus(totalSaleValue),
        },
      });

      if (updatedQuantity === 0) {
        await prisma.userpogs.delete({
          where: {
            userId_pogId: {
              userId: userId,
              pogId: pog.id,
            },
          },
        });
      } else {
        await prisma.userpogs.update({
          where: {
            userId_pogId: {
              userId: userId,
              pogId: pog.id,
            },
          },
          data: {
            quantity: updatedQuantity,
          },
        });
      }

      res.status(200).json({ message: "Shares sold successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error processing the sale." });
    }
  });
}
