const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (imageUrl, folder, height, quality) => {
  try {
    const options = { folder };
    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }
    options.resource_type = "auto";
    console.log("OPTIONS", options);

    const result = await cloudinary.uploader.upload(imageUrl, options);
    // const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
