import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return handleGetUsers(req, res);
    case "POST":
      return handleCreateUser(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function handleGetUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page = "1", username = "" } = req.query;

    const currentPage = Math.max(1, parseInt(page as string, 10));
    const pageSize = 10;
    const skip = (currentPage - 1) * pageSize;

    const users = await prisma.user.findMany({
      where: username
        ? { username: { contains: username as string, mode: "insensitive" } }
        : {},
      take: pageSize,
      skip: skip,
    });

    const totalUsers = await prisma.user.count({
      where: username
        ? { username: { contains: username as string, mode: "insensitive" } }
        : {},
    });

    return res.status(200).json({
      data: users,
      pagination: {
        totalUsers,
        totalPages: Math.ceil(totalUsers / pageSize),
        currentPage,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleCreateUser(req: NextApiRequest, res: NextApiResponse) {
  const { username, password, name, email, image, role } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (email) {
      const existingEmail = await prisma.user.findFirst({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        image,
        role,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
