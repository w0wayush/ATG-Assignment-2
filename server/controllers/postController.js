const Post = require("../models/postSchema");
const User = require("../models/userSchema");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create a post
exports.createPost = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description, isPublic, imageLink } = req.body;
    //     const file = req.file.image; // Assuming a single image is uploaded

    if (!title || !description || !userId || !imageLink) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* // Assuming uploadImageToCloudinary function works correctly
    const uploadResult = await uploadImageToCloudinary(
      imageLink,
      process.env.FOLDER_NAME
    ); */

    const newPost = await Post({
      title,
      description,
      user: userId,
      imageLink: imageLink,
      //       uploadResult.secure_url, // Store the single image URL in an array
      isPublic,
    });
    await newPost.save();

    //     const newPost = await Post(req.body);
    //     await newPost.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    const populatedPost = await Post.findById(newPost._id).populate("user");

    res.status(200).json({
      success: true,
      data: populatedPost,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

// Get post details
exports.getPostDetails = async (req, res) => {
  try {
    //     console.log("Inside getPostDetails");
    const { postId } = req.params;

    const post = await Post.findById(postId).populate("user");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post details",
      error: error.message,
    });
  }
};

// Get all public posts
exports.getPublicPosts = async (req, res) => {
  try {
    //     console.log("Inside getPublicPosts");
    const publicPosts = await Post.find({ isPublic: true }).populate("user");

    res.status(200).json({
      success: true,
      data: publicPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch public posts",
      error: error.message,
    });
  }
};
