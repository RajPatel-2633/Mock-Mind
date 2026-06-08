import express from "express";
import {authMiddleware} from "../middleware/auth.middleware.js"
import {createInterview,startInterview,submitAnswer,generateReport,getInterviews,getInterviewById,deleteInterview} from "../controllers/interview.controllers.js"

const router = express.Router();

router.post("/createInterview",authMiddleware,createInterview);
router.post("/startInterview/:id",authMiddleware,startInterview);
router.post("/answer/:id",authMiddleware,submitAnswer);
router.post("/report/:id",authMiddleware,generateReport);
router.get("/getInterviews",authMiddleware,getInterviews);
router.get("/getInterviewById/:id",authMiddleware,getInterviewById);
router.delete("/:id",authMiddleware,deleteInterview);



export default router;