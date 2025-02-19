import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from 'fs';

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    console.log('file uploaded ');
    return response;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    console.log(err, ' error uploading file', response.url);
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default uploadOnCloudinary;
