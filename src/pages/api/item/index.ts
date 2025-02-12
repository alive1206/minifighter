import { prisma } from "@/config";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return handleGetItems(req, res);
    case "POST":
      return handleCreateItem(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function handleGetItems(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page = "1", name = "" } = req.query;

    const currentPage = Math.max(1, parseInt(page as string, 10));
    const pageSize = 10;
    const skip = (currentPage - 1) * pageSize;

    const items = await prisma.item.findMany({
      where: name
        ? { name: { contains: name as string, mode: "insensitive" } }
        : {},
      take: pageSize,
      skip: skip,
    });

    const totalItems = await prisma.item.count({
      where: name
        ? { name: { contains: name as string, mode: "insensitive" } }
        : {},
    });

    return res.status(200).json({
      data: items,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage,
      },
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleCreateItem(req: NextApiRequest, res: NextApiResponse) {
  const { name, price, image } = req.body;

  try {
    const existingItem = await prisma.item.findFirst({ where: { name } });
    if (existingItem) {
      return res.status(400).json({ message: "Item already exists" });
    }

    const newItem = await prisma.item.create({
      data: {
        name,
        price,
        image,
      },
    });

    return res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
