import { prisma } from "@/config";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  switch (req.method) {
    case "GET":
      return handleGetPost(id, res);
    case "PUT":
      return handleUpdatePost(id, req, res);
    case "DELETE":
      return handleDeletePost(id, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function handleGetPost(id: string, res: NextApiResponse) {
  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleUpdatePost(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { ...rest } = req.body;
    const updateData: any = { ...rest };

    if (updateData.title && updateData.title !== existingPost.title) {
      const existingPostTitle = await prisma.post.findFirst({
        where: { title: updateData.title },
      });
      if (existingPostTitle) {
        return res.status(400).json({ message: "Post already exists" });
      }
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating Post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleDeletePost(id: string, res: NextApiResponse) {
  try {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    await prisma.post.delete({ where: { id } });
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
