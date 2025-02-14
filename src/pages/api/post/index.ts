import { prisma } from "@/config";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return handleGetPosts(req, res);
    case "POST":
      return handleCreatePost(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function handleGetPosts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page = "1", title = "" } = req.query;

    const currentPage = Math.max(1, parseInt(page as string, 10));
    const pageSize = 6;
    const skip = (currentPage - 1) * pageSize;

    const posts = await prisma.post.findMany({
      where: title
        ? { title: { contains: title as string, mode: "insensitive" } }
        : {},
      take: pageSize,
      skip: skip,
    });

    const totalPosts = await prisma.post.count({
      where: title
        ? { title: { contains: title as string, mode: "insensitive" } }
        : {},
    });

    return res.status(200).json({
      data: posts,
      pagination: {
        totalPosts,
        totalPages: Math.ceil(totalPosts / pageSize),
        currentPage,
      },
    });
  } catch (error) {
    console.error("Error fetching Posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleCreatePost(req: NextApiRequest, res: NextApiResponse) {
  const { title, content, image } = req.body;

  try {
    const existingPost = await prisma.post.findFirst({ where: { title } });
    if (existingPost) {
      return res.status(400).json({ message: "Post already exists" });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        image,
      },
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
