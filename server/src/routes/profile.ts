import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export default function profile(app: Express) {
  app.get("/profile/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const user = await prisma.users.findUnique({
        where: { id: Number(id) },
      })

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const userDetails = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      };

      res.status(200).json(userDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching user details." });
    }
  });
}