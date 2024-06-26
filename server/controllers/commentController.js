const { default: mongoose } = require("mongoose");
const Comment = require("../models/commentSchema");
const Post = require("../models/postSchema");

exports.createComment = async (req, res) => {
  try {
    const { post, user, body } = req.body;
    //const comment = await Comment.create({user, body});
    const comment = new Comment({
      post,
      user,
      body,
    });
    const savedComments = await comment.save();

    //find the post by ID, add the new comment to its comments array
    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $push: { comments: savedComments._id } },
      { new: true }
    )
      .populate("comments") //populate the comments array with comment document
      .exec();

    res.status(200).json({
      post: updatedPost,
      success: true,
      message: "Successfully created comment",
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
      data: comments,
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
