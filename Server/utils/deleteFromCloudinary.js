import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

// Configure Cloudinary with your credentials and timeout settings
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60000 // Timeout in milliseconds (e.g., 60 seconds)
});

const deleteFromCloudinary = async (imageURL) => {
    try {
        // Extract public ID from the imageURL
        const publicID = imageURL.split('/').pop().split('.')[0];
        
        // Delete the image from Cloudinary
        const result = await cloudinary.uploader.destroy(publicID);
        
        return result;
    } catch (error) {
        return null;
    }
};

export default deleteFromCloudinary;
