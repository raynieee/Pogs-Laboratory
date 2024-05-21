import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const prisma = new PrismaClient();
export default function login(app: Express) {
  app.post("/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.users.findUnique({
        where: { email: email },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const ifMatch = await bcrypt.compare(password, user.hashedPassword) 

      if (!ifMatch) {
        return res.status(401).json({ error: "Invalid password."});
      }

      res.status(200).json({ message: "Login successful.", position: user.position, id: user.id })
    } catch (error) {
      res.status(500).json({ error: "Server error." })
    }
  })
}