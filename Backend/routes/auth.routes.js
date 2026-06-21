import express from "express"
import {registerUser,loginUser,getProfile,forgotPassword,verifyOTP,resetPassword,updateProfile,logoutUser,refreshAccessToken,googleAuthCallback} from "../controllers/auth.controllers.js"
import { authMiddleware } from "../middleware/auth.middleware.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${process.env.BASE_URL}/login`}),googleAuthCallback);

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",authMiddleware,getProfile);
router.post("/forgot-password",forgotPassword);
router.post("/verify-OTP",verifyOTP);
router.post("/reset-password",resetPassword);
router.patch("/update-profile",authMiddleware,updateProfile);
router.post("/logout",authMiddleware,logoutUser);
router.post("/refresh",refreshAccessToken);

export default router;