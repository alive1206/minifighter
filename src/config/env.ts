export const env = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  APP_API: process.env.APP_API as string,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET as string,
  CLOUDINARY_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
  CLOUDINARY_UPLOAD_PRESET: process.env
    .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
};
