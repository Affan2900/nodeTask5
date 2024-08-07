// s3Service.ts
import AWS from 'aws-sdk';
import path from 'path';
import fs from 'fs';
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (file: Express.Multer.File): Promise<string | undefined> => {
  const filePath = file.path;
  try {
    const fileContent = fs.readFileSync(filePath);

    // Generate a unique filename
    // Generate a unique filename
    const filename = path.basename(filePath);

    const params = {
      Bucket: 'node-task',
      Key: `profile-pictures/${filename}`,
      Body: fileContent,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return undefined;
  } finally{
    fs.unlinkSync(filePath);
  }
};