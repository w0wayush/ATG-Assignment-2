const { default: mongoose } = require("mongoose");
const Comment = require("../models/commentSchema");
const Post = require("../models/postSchema");
const User = require("../models/userSchema");
const { idText } = require("typescript");

exports.createComment = async (req, res) => {
  try {
    const { post, userId, description } = req.body;

    // Validate user ID
    const userDetails = await User.findOne({ _id: userId });
    if (!userDetails) {
      return res.status(403).json({
        success: false,
        message: "Provide correct userId",
      });
    }

    // Create new comment
    const comment = new Comment({
      post,
      user: userDetails._id, // Store user ID
      username: userDetails.username, // Store username
      description,
    });

    // Save comment to database
    const savedComment = await comment.save();

    // Update post with new comment
    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $push: { comments: savedComment._id } },
      { new: true }
    )
      .populate({
        path: "comments",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate("user")
      .exec();

    res.status(200).json({
      success: true,
      message: "Successfully created comment",
      comment: savedComment, // Return the saved comment data
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.retrieveComments = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(403).json({
        success: false,
        message: "Please provide a valid post ID",
      });
    }

    const post = await Post.findById(postId).populate("comments");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
        data: null,
      });
    }

    const comments = post.comments;

    res.status(200).json({
      success: true,
      message: "Successfully fetched all comments",
      comments: comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: "Internal Server Error",
    });
  }
};
