const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
require("dotenv").config();
const SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const { avatarGenerator } = require("../utils/avatarGenerator");

module.exports.meRoute = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    // console.log("In side me router - ", user);

    if (!user) {
      return res.status(403).json({ msg: "User doesn't exist" });
    }
    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    const token = jwt.sign({ username: user.username }, SECRET, {
      expiresIn: "1h",
    });

    const imgLink = avatarGenerator(email?.split("@")[0]);

    const userDetails = await User.findByIdAndUpdate(
      user._id,
      { avatarImage: imgLink, isAvatarImageSet: true },
      { new: true }
    );

    delete user.password;
    return res.json({ status: true, token, userDetails });
  } catch (ex) {
    next(ex);
  }
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    const usernameCheck = await User.findOne({ username });

    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    if (password != confirmPassword) {
      return res.json({
        msg: "Password does not match",
        status: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};
