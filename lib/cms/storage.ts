import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "";
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

export async function uploadToS3(
  buffer: Buffer,
  fileName: string,
  contentType = "image/webp",
): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error("AWS S3 bucket name is not configured");
  }

  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read",
  });

  await s3Client.send(command);

  // Return CloudFront URL if configured, otherwise construct S3 URL
  return CLOUDFRONT_URL
    ? `${CLOUDFRONT_URL}/${key}`
    : `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

export async function getPresignedUploadUrl(
  fileName: string,
  contentType: string,
): Promise<{ url: string; fields: Record<string, string> }> {
  if (!BUCKET_NAME) {
    throw new Error("AWS S3 bucket name is not configured");
  }

  const key = `uploads/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return {
    url,
    fields: {
      key,
      "Content-Type": contentType,
      acl: "public-read",
    },
  };
}
