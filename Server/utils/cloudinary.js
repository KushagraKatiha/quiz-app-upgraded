import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({
    path: './.env'
})

// Configure Cloudinary with your credentials and timeout settings
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60000 // Timeout in milliseconds (e.g., 60 seconds)
});

const uploadToCloudinary = async (localFilePath) => {
    try {
        // Determine the image type based on the folder
        const imagePathParts = localFilePath.split('/');
        const imageType = imagePathParts[imagePathParts.length - 2]; // Assuming the type is determined by the second-to-last part of the path

        let transformation = [];
        // Conditionally apply transformations based on image type
        if (imageType === 'profileImages') {
            // Resize profile images to 200x200
            transformation.push({ width: 200, height: 200, crop: "fill" });
        } else if (imageType === 'coverImages') {
            // Resize cover images to 800x400
            transformation.push({ width: 800, height: 400, crop: "fill" });
        }
        
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            transformation: transformation
        });
        // Delete the local file after uploading
        fs.unlinkSync(localFilePath)
        return result;
    } catch (err) {
        // Delete the local file if an error occurs
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export default uploadToCloudinary;

// Retry logic function for retrying the upload operation
const retryUpload = async (localFilePath, maxRetries = 3, delayMs = 1000) => {
    let retries = 0;
    let uploadResult = null;
    while (retries < maxRetries) {
        try {
            uploadResult = await uploadToCloudinary(localFilePath);
            if (uploadResult) {
                // Upload successful, return the result
                return uploadResult;
            }
        } catch (error) {
        }
        retries++;
        // Delay before retrying
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    return null;
}

export { uploadToCloudinary, retryUpload };
