// s3Service.ts
import AWS from 'aws-sdk';
import axios from 'axios';
import path from 'path';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (imageUrl: string): Promise<string> => {
  try {
    // Download the image from the URL
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    // Generate a unique filename
    const filename = `${Date.now()}${path.extname(imageUrl)}`;

    const params = {
      Bucket: 'node-task',
      Key: `profile-pictures/${filename}`,
      Body: buffer,
      ContentType: response.headers['content-type'],
    };

    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};