import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async(localFilePath) => {
    try{
        const result = cloudinary.v2.uploader
        .upload(localFilePath, 
          {resource_type: "auto"})

          return result
    }catch(err){
        fs.unlinkSync(localFilePath)
        return null
    }
}

export default uploadToCloudinary

