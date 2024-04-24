import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const prisma = new PrismaClient();
export default function signup(app: Express) {
  app.post("/signup", async (req: Request, res: Response) => {
    try {
      const { email, firstName, lastName, position, password } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already in use." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          position,
          hashedPassword,
          eWalletAmount: 10000.00,
        },
      });

      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "An error occurred during signup." });
    }
  });
}
