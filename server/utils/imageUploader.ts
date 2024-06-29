import cloudinary from "cloudinary";
cloudinary.v2;

type Props = {
  imageUrl: String;
  folder: String;
  height?: String;
  quality?: String;
};

const uploadImageToCloudinary = async ({
  imageUrl,
  folder,
  height,
  quality,
}: Props) => {
  try {
    const options = { folder };
    if (height) {
      // @ts-ignore
      options.height = height;
    }
    if (quality) {
      // @ts-ignore
      options.quality = quality;
    }
    // @ts-ignore
    options.resource_type = "auto";
    console.log("OPTIONS", options);

    // @ts-ignore
    const result = await cloudinary.uploader.upload(imageUrl, options);
    // const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

export default uploadImageToCloudinary;
