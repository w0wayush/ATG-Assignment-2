import cloudinary from "cloudinary";
cloudinary.v2;

const cloudinaryConnect = () => {
  try {
    // @ts-ignore
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  } catch (error) {
    console.log(error);
  }
};

export default cloudinaryConnect;
