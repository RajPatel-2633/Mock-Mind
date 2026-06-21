import mongoose from "mongoose";
import Interview from "../models/Interview.models.js";
import Question from "../models/Question.models.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/AsyncHandler.utils.js";
import axios from "axios";

const createInterview = asyncHandler(async(req,res)=>{
    const user = req.user.id;
    const {techStack,role,experience,difficulty,interviewType,totalQuestions} = req.body;
    if(!techStack || !role || !experience){
        throw new BadRequestError("All Fields are Required");
    }

    const interview = await Interview.create({
        user,
        techStack,
        role,
        experience,
        difficulty,
        interviewType,
        totalQuestions,
        status:"created"
    });

    if(!interview){
        throw new InternalServerError("Interview Creation Failed");
    }

    return res.status(201).json(new ApiResponse(201,{
        success:true,
        interviewId: interview._id
    },"Interview Created Successfully"));
});

const startInterview = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const interview = await Interview.findById(id);
    if(!interview){
        throw new NotFoundError("Interview Not Found");
    }

    const aiMicroservice = axios.create({
        baseURL:process.env.AI_MICROSERVICE_URL
    });

    const {data} = await aiMicroservice.post("/start-interview",{
        session_id: interview._id.toString(),
        tech_stack: interview.techStack,
        difficulty: interview.difficulty,
        experience: interview.experience
    });


    const questionCollection = await Question.create({
        interview: interview._id,
        question:data.question,
        difficulty:data.difficulty,
});

    if(!questionCollection){
    throw new InternalServerError("Could not Create Question Collection");
    }

    
        interview.status="in-progress";

        await interview.save();
    

    return res.status(200).json(new ApiResponse(200,{
        questionId:questionCollection._id,
        question:data.question,
        difficulty:data.difficulty,
        interviewType: interview.interviewType,
        totalQuestions: interview.totalQuestions
    },"Interview Started Successfully"));

});

const submitAnswer = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const {questionId,answer} = req.body;
    const interview = await Interview.findById(id);
    if(!interview){
        throw new NotFoundError("Interview Not Found");
    }
    const questionDoc = await Question.findById(questionId);
    if(!questionDoc){
        throw new NotFoundError("Question Not Found");
    }

    const aiMicroservice = axios.create({
        baseURL:process.env.AI_MICROSERVICE_URL,
    });

    const {data:evaluation} = await aiMicroservice.post("/submit-answer",{
        session_id: interview._id.toString(),
        tech_stack: interview.techStack,
        difficulty: interview.difficulty,
        experience: interview.experience,
        question: questionDoc.question,
        answer,
        retrieved_context:"",
        score:0,
        feedback:"",
        history:[],
        asked_questions:[],
        report:"",
        current_question: interview.currentQuestion || 0,
        total_questions: interview.totalQuestions || 5
    });

    questionDoc.answer = answer;
    questionDoc.feedback = evaluation.feedback;
    questionDoc.score = evaluation.score || 0;

    await questionDoc.save()

    interview.currentQuestion +=1;
    interview.difficulty = evaluation.difficulty;

    if(interview.currentQuestion >= interview.totalQuestions){
        interview.status = "completed";
        await interview.save();
        return res.status(200).json(new ApiResponse(200,{
            completed:true
        },"Interview Completed"));
    }

    const newQuestion = await Question.create({
        interview: interview._id,
        question: evaluation.question,
        difficulty: evaluation.difficulty
    });
    await interview.save();

    return res.status(200).json(new ApiResponse(200,{
        completed:false,
        feedback: evaluation.feedback,
        nextQuestion: {
            questionId: newQuestion._id,
            question: newQuestion.question
        }
    },"Answer Submitted Successfully"));

});

const generateReport = asyncHandler(async(req,res)=>{
     const {id} = req.params;
     const {duration} = req.body;

     const interview = await Interview.findById(id);
     if(!interview){
        throw new NotFoundError("Interview Not Found");
     }
     const questions = await Question.find({
        interview:id
     });

     if(questions.length===0){
        throw new NotFoundError("Could not fetch questions");
     }

     const history = questions.map(q=>({
        question: q.question,
        answer: q.answer,
        evaluation: q.feedback,
        score: q.score
     }));

     const aiMicroservice = axios.create({
        baseURL:process.env.AI_MICROSERVICE_URL,
    });

    const {data} = await aiMicroservice.post("/report",{
        session_id:id,
        history
    });

    interview.report = data.report;

    try {
        const reportJson = JSON.parse(data.report);
        interview.overallScore = reportJson.overall_score || 0;
        interview.strengths = reportJson.strengths || [];
        interview.weaknesses = reportJson.weaknesses || [];
        interview.suggestions = reportJson.suggestions || [];
    } catch (error) {
        console.error("Failed to parse report JSON", error);
    }

    if (duration) {
        interview.duration = duration;
    }

    interview.status = "completed";
    
    interview.completedAt = new Date();

    await interview.save();

    return res.status(200).json(new ApiResponse(200,null,"Report Generated Successfully"));
});

const getInterviews =  asyncHandler(async(req,res)=>{
    const id = req.user.id;
    const interviews = await Interview.find({
        user:id
    }).select(
        "techStack role difficulty overallScore status createdAt"
    ).sort({
        createdAt:-1
    });

    return res.status(200).json(new ApiResponse(200,interviews,"Interviews Fetched Successfully"));
});


const getInterviewById = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const interview = await Interview.findById(id);
    if(!interview){
        throw new NotFoundError("Interview Not Found");
    }

    const questions = await Question.find({
        interview:id
    });

    if(questions.length===0){
        throw new NotFoundError("Questions Not Found");
    }

    return res.status(200).json(new ApiResponse(200,{
        interview,
        questions
    },"Interviews and Questions Fetched Successfully"))
});

const deleteInterview = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const interview = await Interview.findOne({
        _id:id,
        user:req.user.id
    });

    if(!interview){
        throw new  NotFoundError("Could not Find Interviews");
    }
    await Interview.findByIdAndDelete(id);
    await Question.deleteMany({
        interview:id
    });
    return res.status(200).json(new ApiResponse(200,null,"Deleted Successfully"));
});

const getDashboardStats = asyncHandler(async(req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    const statsPipeline = await Interview.aggregate([
        { $match: { user: userId } },
        {
            $facet: {
                metrics: [
                    {
                        $group: {
                            _id: null,
                            totalInterviews: { $sum: 1 },
                            totalScore: {
                                $sum: {
                                    $cond: [{ $and: [{ $eq: ["$status", "completed"] }, { $gt: ["$overallScore", 0] }] }, "$overallScore", 0]
                                }
                            },
                            completedCount: {
                                $sum: {
                                    $cond: [{ $and: [{ $eq: ["$status", "completed"] }, { $gt: ["$overallScore", 0] }] }, 1, 0]
                                }
                            },
                            totalPracticeTime: {
                                $sum: {
                                    $cond: [
                                        { $gt: [{ $ifNull: ["$duration", 0] }, 0] }, "$duration",
                                        {
                                            $cond: [{ $eq: ["$status", "completed"] }, { $multiply: ["$totalQuestions", 5] }, 0]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ],
                recentInterviews: [
                    { $sort: { createdAt: -1 } },
                    { $limit: 4 },
                    { $project: { _id: 1, techStack: 1, role: 1, status: 1, overallScore: 1, createdAt: 1 } }
                ],
                dates: [
                    { $sort: { createdAt: -1 } },
                    { $project: { createdAt: 1, _id: 0 } }
                ]
            }
        }
    ]);

    const result = statsPipeline[0];
    const metrics = result.metrics[0] || { totalInterviews: 0, totalScore: 0, completedCount: 0, totalPracticeTime: 0 };
    
    const totalInterviews = metrics.totalInterviews;
    const averageScore = metrics.completedCount > 0 ? Math.round(metrics.totalScore / metrics.completedCount) : 0;
    const totalPracticeTime = metrics.totalPracticeTime;
    const recentInterviews = result.recentInterviews.map(i => ({
        id: i._id,
        techStack: i.techStack,
        role: i.role,
        status: i.status,
        overallScore: i.overallScore,
        createdAt: i.createdAt
    }));

    // Calculate Day Streak
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    
    const uniqueDates = [...new Set(result.dates.map(i => {
        const d = new Date(i.createdAt);
        d.setHours(0,0,0,0);
        return d.getTime();
    }))];

    let tempDate = new Date(currentDate);
    for (let time of uniqueDates) {
        if (time === tempDate.getTime()) {
            streak++;
            tempDate.setDate(tempDate.getDate() - 1);
        } else if (time < tempDate.getTime()) {
            break;
        }
    }
    if (streak === 0 && uniqueDates.length > 0) {
        let yesterday = new Date(currentDate);
        yesterday.setDate(yesterday.getDate() - 1);
        if (uniqueDates[0] === yesterday.getTime()) {
            streak = 1;
            tempDate = new Date(yesterday);
            tempDate.setDate(tempDate.getDate() - 1);
            for (let i = 1; i < uniqueDates.length; i++) {
                if (uniqueDates[i] === tempDate.getTime()) {
                    streak++;
                    tempDate.setDate(tempDate.getDate() - 1);
                } else {
                    break;
                }
            }
        }
    }

    return res.status(200).json(new ApiResponse(200, {
        totalInterviews,
        averageScore,
        totalPracticeTime,
        dayStreak: streak,
        recentInterviews
    }, "Dashboard Stats Fetched Successfully"));
});

const transcribeAudio = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new BadRequestError("Audio file is required");
    }

    try {
        const audioBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
        const formData = new FormData();
        formData.append("file", audioBlob, req.file.originalname || "audio.webm");
        formData.append("model", "whisper-large-v3");
        formData.append("response_format", "json");

        const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Groq API Error:", errorText);
            throw new InternalServerError("Failed to transcribe audio via Groq");
        }

        const data = await response.json();
        
        return res.status(200).json(
            new ApiResponse(200, { text: data.text }, "Audio transcribed successfully")
        );
    } catch (error) {
        console.error("Transcription error:", error);
        throw new InternalServerError("Error during transcription process");
    }
});

export {createInterview,startInterview,submitAnswer,generateReport,getInterviews,getInterviewById,deleteInterview,getDashboardStats,transcribeAudio};
