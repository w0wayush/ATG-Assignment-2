const {
  login,
  signup,
  setAvatar,
  meRoute,
} = require("../controllers/userController");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword");
const { authenticateJwt } = require("../middleware/auth");

const router = require("express").Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/setavatar/:id", authenticateJwt, setAvatar);
router.get("/me", authenticateJwt, meRoute);

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password/:token", resetPassword);

module.exports = router;

module.exports = router;
