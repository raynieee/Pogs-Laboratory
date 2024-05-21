import { Express, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default function signup(app: Express) {
  app.post("/signup", async (req: Request, res: Response) => {
    console.log("Received signup request:", req.body);
    const { email, firstName, lastName, position, password } = req.body;

    // Validate input fields
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ error: "First name is required." });
    }
    if (!lastName || !lastName.trim()) {
      return res.status(400).json({ error: "Last name is required." });
    }
    if (!position || !position.trim()) {
      return res.status(400).json({ error: "Position is required." });
    }
    if (!password || password.length < 10) {
      return res.status(400).json({ error: "Password must be at least 10 characters long." });
    }

    try {
      const existingUser = await prisma.users.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already in use." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.users.create({
        data: {
          email,
          firstName,
          lastName,
          position,
          hashedPassword,
          eWalletAmount: 10000.0,
        },
      });
      console.log('Created user:', newUser);

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ error: "An error occurred during registration." });
    } finally {
      await prisma.$disconnect();
    }
  });
}