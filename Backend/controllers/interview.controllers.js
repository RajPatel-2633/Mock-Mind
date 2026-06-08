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
        difficulty:data.difficulty
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

    const {data:evaluation} = await aiMicroservice.post("/submit-answeer",{
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
        report:""
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

    const {data:nextQuestion} = await aiMicroservice.post("/start-interview",{
        session_id:interview._id.toString(),
        tech_stack:interview.techStack,
        difficulty:interview.difficulty,
        experience:interview.experience
    });

    const newQuestion = await Question.create({
        interview: interview._id,
        question: nextQuestion.question,
        difficulty: nextQuestion.difficulty
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

});

const getInterviews =  asyncHandler(async(req,res)=>{

});

const getInterviewById = asyncHandler(async(req,res)=>{

});

const deleteInterview = asyncHandler(async(req,res)=>{

});


export {createInterview,startInterview,submitAnswer,generateReport,getInterviews,getInterviewById,deleteInterview};
