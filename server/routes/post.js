const {
  createComment,
  retrieveComments,
} = require("../controllers/commentController");

const {
  likePost,
  unlikePost,
  checkLike,
} = require("../controllers/likeController");
const postController = require("../controllers/postController");

const upload = require("../utils/upload");

const router = require("express").Router();

// Route for creating a post
router.post("/create/:userId", postController.createPost);

// Route for getting all public posts
router.get("/public", postController.getPublicPosts);

// Route for getting post details by postId
router.get("/:postId", postController.getPostDetails);

// Route to like a post
router.post("/like", likePost);

// Route to unlike a post
router.post("/unlike", unlikePost);

//Route to checklike for a particular user on that post
router.get("/check-like/:postId/:userId", checkLike);

// Route to create a comment
router.post("/comment", createComment);

// Route to retrieve comments for a post
router.get("/comments/:postId", retrieveComments);

module.exports = router;
