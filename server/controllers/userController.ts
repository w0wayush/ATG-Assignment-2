import { Request, Response, NextFunction } from "express";
import User from "../models/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import avatarGenerator from "../utils/avatarGenerator";
import dotenv from "dotenv";
dotenv.config();

interface MeRequest extends Request {
  user: {
    username: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface SignupRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

interface SetAvatarRequest extends Request {
  params: {
    id: string;
  };
  body: {
    image: string;
  };
}

export const meRoute = async (
  req: MeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(403).json({ msg: "User doesn't exist" });
    }

    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const login = async (
  req: LoginRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }

    const SECRET = process.env.JWT_SECRET;
    if (!SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ username: user.username }, SECRET, {
      expiresIn: "1h",
    });

    const imgLink = avatarGenerator(email?.split("@")[0]);

    const userDetails = await User.findByIdAndUpdate(
      user._id,
      { avatarImage: imgLink, isAvatarImageSet: true },
      { new: true }
    );

    if (!userDetails) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { password: userPassword, ...userWithoutPassword } =
      userDetails.toObject();
    return res.json({ status: true, token, userDetails: userWithoutPassword });
  } catch (ex) {
    console.error(ex);
    next(ex);
  }
};

export const signup = async (
  req: SignupRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    const usernameCheck = await User.findOne({ username });

    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    if (password !== confirmPassword) {
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

    const { password: userPassword, ...userWithoutPassword } = user.toObject();
    return res.json({ status: true, user: userWithoutPassword });
  } catch (ex) {
    console.error(ex);
    next(ex);
  }
};

export const setAvatar = async (
  req: SetAvatarRequest,
  res: Response,
  next: NextFunction
) => {
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

    if (!userData) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    console.error(ex);
    next(ex);
  }
};
