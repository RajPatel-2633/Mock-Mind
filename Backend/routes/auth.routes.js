import express from "express"
import {registerUser,loginUser,getProfile,forgotPassword,verifyOTP,resetPassword,updateProfile,logoutUser,refreshAccessToken} from "../controllers/auth.controllers.js"
import { authMiddleware } from "../middleware/auth.middleware.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${process.env.BASE_URL}/login` }), (req, res) => {
    const user = req.user;
    const accessCookieOptions = { maxAge: 1000*60*15, httpOnly: true, secure: true, sameSite: "lax" };
    const refreshCookieOptions = { maxAge: 1000*60*60*24*7, httpOnly: true, secure: true, sameSite: "lax" };

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.redirect(`${process.env.BASE_URL}/dashboard`);
});

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