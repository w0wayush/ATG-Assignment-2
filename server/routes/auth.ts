import {
  login,
  signup,
  setAvatar,
  meRoute,
} from "../controllers/userController";

import {
  resetPasswordToken,
  resetPassword,
} from "../controllers/resetPassword";

import authenticateJwt from "../middleware/auth";

import { Router } from "express";
const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/setavatar/:id", authenticateJwt, setAvatar);
router.get("/me", authenticateJwt, meRoute);

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password/:token", resetPassword);

export default router;
