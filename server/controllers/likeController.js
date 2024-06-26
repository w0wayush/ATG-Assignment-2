const Like = require("../models/likeSchema");
const Post = require("../models/postSchema");

exports.likePost = async (req, res) => {
  try {
    const { post, user } = req.body;
    const like = new Like({ post, user });
    const savedLike = await like.save();

    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $push: { likes: savedLike._id } },
      { new: true }
    );

    res.status(200).json({
      post: updatedPost,
      success: true,
      message: "Successfully liked post",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
      data: "Error while liking post",
    });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const { post, like } = req.body;
    const deletedLike = await Like.findOneAndDelete({ post: post, _id: like });

    if (!deletedLike) {
      return res.status(404).json({
        success: false,
        message: "Like not found or already deleted",
        data: "Error while unliking post",
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $pull: { likes: deletedLike._id } },
      { new: true }
    )
      .populate("likes")
      .exec();

    res.status(200).json({
      post: updatedPost,
      success: true,
      message: "Successfully unliked blog",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
      data: "Error while unliking post",
    });
  }
};
