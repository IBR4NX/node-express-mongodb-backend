import { JWT_REFRESH_SECRET, JWT_ACCESS_SECRET } from "../../config.js";
import asyncHandler from "express-async-handler";
import modelUser from "../../database/models/modelUser.js"; 
import jwt from "jsonwebtoken";

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body; // أو من Cookie
  if (!refreshToken) {
    res.status(401);
    throw new Error("Refresh Token مطلوب");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch (err) {
    res.status(403);
    throw new Error("Refresh Token is ended");
  }

  const user = await modelUser.findById(decoded.id).select("+refreshToken").exec();

  if (!user || user.refreshToken !== refreshToken) {
    // console.log(r)
    res.status(403);
    throw new Error("Refresh Token is not recognized");
  }

  // إصدار Access Token جديد
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    JWT_ACCESS_SECRET,
    { expiresIn: "3m" }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1800000,
  });
  res.json({ accessToken });
});

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_ACCESS_SECRET,
    { expiresIn: "3m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export { refreshAccessToken, generateTokens };
