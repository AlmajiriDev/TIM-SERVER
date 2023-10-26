const { cloudinary } = require('../utils/cloudinary');

// Function to upload image to Cloudinary and return image URL
const uploadImageCloudinary = async (file, options) => {
  if (!file) {
    console.log("Image not uploaded")
    return null;
  } else {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, options, (error, result) => {
          if (error) {
            console.error(error);
            reject('Error uploading image to Cloudinary');
          } else {
            resolve(result);
          }
        });
      });
      return result.secure_url;
    } catch (err) {
      console.error(err);
      throw new Error('Error uploading image to Cloudinary');
    }
  }
};

module.exports = uploadImageCloudinary;
