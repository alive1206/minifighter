import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/config";

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        return await handleGetAssets(req, res);
      case "DELETE":
        return await handleDeleteAsset(req, res);
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

async function handleGetAssets(req: NextApiRequest, res: NextApiResponse) {
  const { next_cursor } = req.query;

  const response = await cloudinary.search
    .expression("folder:minifighter/upload")
    .max_results(15)
    .next_cursor(next_cursor ? String(next_cursor) : undefined)
    .execute();

  return res.status(200).json(response);
}

async function handleDeleteAsset(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { public_id } = req.query;

    if (!public_id || typeof public_id !== "string") {
      return res.status(400).json({ error: "Missing or invalid public_id" });
    }

    await cloudinary.api.delete_resources([public_id], {
      resource_type: "image",
    });

    return res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "Server error", details: error.message });
  }
}
