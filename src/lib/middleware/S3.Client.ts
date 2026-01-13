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

export async function uploadImageToS3(file:  Express.Multer.File) {
  try {
    const s3Client = new S3Client({ region: "ap-northeast-2" });

    const key = `images/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME || "BucketName",
      Key: key,
      Body:file.buffer
    });
    await s3Client.send(command);
    
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`
    return imageUrl
  } catch (error) {
    console.log(error);
    throw(error)
  }
}
export async function deleteImageToS3(key:string) {
  try {
    const s3Client = new S3Client({ region: "ap-northeast-2" });


    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME||"BucketName",
      Key: key,
    });
    await s3Client.send(command)
    return ;
  } catch (error) {
    console.log(error);
  }
}
