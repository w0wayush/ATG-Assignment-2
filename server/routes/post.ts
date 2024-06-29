import {
  createComment,
  retrieveComments,
} from "../controllers/commentController";

import { likePost, unlikePost, checkLike } from "../controllers/likeController";

import {
  createPost,
  getPublicPosts,
  getPostDetails,
} from "../controllers/postController";

import upload from "../utils/upload";

import { Router } from "express";
const router = Router();

// Route for creating a post
router.post("/create/:userId", createPost);

// Route for getting all public posts
router.get("/public", getPublicPosts);

// Route for getting post details by postId
router.get("/:postId", getPostDetails);

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

export default router;
