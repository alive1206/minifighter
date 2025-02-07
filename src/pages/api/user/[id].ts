import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  switch (req.method) {
    case "GET":
      return handleGetUser(id, res);
    case "PUT":
      return handleUpdateUser(id, req, res);
    case "DELETE":
      return handleDeleteUser(id, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function handleGetUser(id: string, res: NextApiResponse) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleUpdateUser(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...rest } = req.body;
    const updateData: any = { ...rest };

    if (updateData.username && updateData.username !== existingUser.username) {
      const existingUsername = await prisma.user.findFirst({
        where: { username: updateData.username },
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    if (updateData.email && updateData.email !== existingUser.email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email: updateData.email },
      });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleDeleteUser(id: string, res: NextApiResponse) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({ where: { id } });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
