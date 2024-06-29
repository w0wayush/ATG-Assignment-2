import User from "../models/userSchema";
import mailSender from "../utils/mailSender";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request, Response } from "express";

interface ResetPasswordTokenRequest extends Request {
  body: {
    email: string;
  };
}

interface ResetPasswordRequest extends Request {
  params: {
    token: string;
  };
  body: {
    password: string;
    confirmPassword: string;
  };
}

export const resetPasswordToken = async (
  req: ResetPasswordTokenRequest,
  res: Response
) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      });
    }
    const token = crypto.randomBytes(20).toString("hex");
    const expirationTime = Date.now() + 3600000;

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: expirationTime,
      },
      { new: true }
    );

    const url = `${process.env.REACT_APP_FRONTEND_URL}/update-password/${token}`;

    await mailSender(
      email,
      "Password Reset",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    );

    res.json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
      data: url,
      token: token,
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    });
  }
};

export const resetPassword = async (
  req: ResetPasswordRequest,
  res: Response
) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      });
    }
    const userDetails = await User.findOne({ token: token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      });
    }

    // @ts-ignore
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword, token: null, resetPasswordExpires: null },
      { new: true }
    );
    res.json({
      success: true,
      message: `Password Reset Successful`,
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    });
  }
};
