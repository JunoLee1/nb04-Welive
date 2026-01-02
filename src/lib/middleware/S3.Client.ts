import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadText() {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME || "BucketName",
      Key: "text.txt",
      Body: "text",
    });
    const respone = await s3Client.send(command);
  } catch (error) {
    console.log(error);
  }
}
export async function delText() {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME||"BucketName",
      Key: "text.txt",
    });
  } catch (error) {
    console.log(error);
  }
}
