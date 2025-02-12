import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    folder: env.CLOUDINARY_UPLOAD_FOLDER,
    timestamp: timestamp,
    upload_preset: env.CLOUDINARY_UPLOAD_PRESET,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    env.CLOUDINARY_API_SECRET
  );

  return res.status(200).json({
    ...paramsToSign,
    signature,
  });
}
