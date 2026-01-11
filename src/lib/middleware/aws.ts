import { S3Client } from "@aws-sdk/client-s3";

const awsConfig = {
  region: process.env.AWS_REGION || "your-region",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
};

const s3Client = new S3Client(awsConfig);

export default s3Client;