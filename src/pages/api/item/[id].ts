import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  switch (req.method) {
    case "GET":
      return handleGetItem(id, res);
    case "PUT":
      return handleUpdateItem(id, req, res);
    case "DELETE":
      return handleDeleteItem(id, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function handleGetItem(id: string, res: NextApiResponse) {
  try {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleUpdateItem(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const existingItem = await prisma.item.findUnique({ where: { id } });
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    const { ...rest } = req.body;
    const updateData: any = { ...rest };

    if (updateData.name && updateData.name !== existingItem.name) {
      const existingItemName = await prisma.item.findFirst({
        where: { name: updateData.name },
      });
      if (existingItemName) {
        return res.status(400).json({ message: "Item already exists" });
      }
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleDeleteItem(id: string, res: NextApiResponse) {
  try {
    const existingItem = await prisma.item.findUnique({ where: { id } });
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    await prisma.item.delete({ where: { id } });
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
