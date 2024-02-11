import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"   // file system  
const cloudinaryupdate = async (localFilePath) => {
  
  try {
    if (!localFilePath)
          return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    //console.log(response);
  
   
    fs.unlinkSync(localFilePath)
    return response;

  } catch (error) {
    //console.log(error.message);
    fs.unlinkSync(localFilePath)  // remove the lovcalluy saved temporary file as the upload operation got  failed:;
    return null;
  }
}
export { cloudinaryupdate }