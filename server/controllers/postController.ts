import { Request, Response } from "express";
import Post from "../models/postSchema";
import User from "../models/userSchema";

interface CreatePostRequest extends Request {
  params: {
    userId: string;
  };
  body: {
    title: string;
    description: string;
    isPublic: boolean;
    imageLink: string;
  };
}

interface GetPostDetailsRequest extends Request {
  params: {
    postId: string;
  };
}

export const createPost = async (req: CreatePostRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { title, description, isPublic, imageLink } = req.body;

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

    const newPost = await Post.create({
      title,
      description,
      user: userId,
      imageLink,
      isPublic,
    });

    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    const populatedPost = await newPost.populate("user");

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

export const getPostDetails = async (
  req: GetPostDetailsRequest,
  res: Response
) => {
  try {
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

export const getPublicPosts = async (req: Request, res: Response) => {
  try {
    const publicPosts = await Post.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate("user");

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

export const getUsersAllPost = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // console.log("User id - ", userId);
    if (!userId) {
      return res.status(403).json({
        message: "Please Provide userID",
        success: false,
      });
    }

    const checkUser = await User.findById(userId);
    // console.log("User presend - ", checkUser);
    if (!checkUser) {
      return res.status(400).json({
        message: "User doesn't exist. Please signup first",
        success: false,
      });
    }

    const userPosts = await User.findById(userId).populate("posts").exec();

    // console.log("Users posts - ", userPosts);

    return res.status(200).json({
      message: "User's posts fetched successfully",
      success: true,
      user: checkUser,
      posts: userPosts?.posts,
    });
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
