import express from "express";
import {authMiddleware} from "../middleware/auth.middleware.js"
import {createInterview,startInterview,submitAnswer,generateReport,getInterviews,getInterviewById,deleteInterview,getDashboardStats,transcribeAudio} from "../controllers/interview.controllers.js"
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/createInterview",authMiddleware,createInterview);
router.post("/startInterview/:id",authMiddleware,startInterview);
router.post("/answer/:id",authMiddleware,submitAnswer);
router.post("/report/:id",authMiddleware,generateReport);
router.get("/getInterviews",authMiddleware,getInterviews);
router.get("/dashboard-stats",authMiddleware,getDashboardStats);
router.get("/getInterviewById/:id",authMiddleware,getInterviewById);
router.delete("/:id",authMiddleware,deleteInterview);
router.post("/transcribe", authMiddleware, upload.single("file"), transcribeAudio);

export default router;