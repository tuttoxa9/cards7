import { S3Client } from "@aws-sdk/client-s3";

// Конфигурация для Cloudflare R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://2d16ebaf34d96e6d891d5b0a20364b20.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: "72a508bedb9c6ecad15a012b136ed0fb",
    secretAccessKey: "e69813546a23e04b562fcb1290887ea433e5b86b74a078edf06fe7f424126ff9",
  },
});

export const R2_BUCKET_NAME = "cards";
export const R2_PUBLIC_URL = `https://cards.2d16ebaf34d96e6d891d5b0a20364b20.r2.cloudflarestorage.com`;
