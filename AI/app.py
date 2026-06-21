from fastapi import FastAPI
from pydantic import BaseModel,Field
from typing import List,Optional
from fastapi.middleware.cors import CORSMiddleware 

from graph import interview_graph

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)

class StartInterviewRequest(BaseModel):
    session_id:str=""
    tech_stack:str=""
    difficulty:str=""
    experience:str=""
    asked_questions:List[str]=Field(default_factory=list)
    current_question:int=0
    total_questions:int=5


class SubmitAnswerRequest(BaseModel):
    session_id:str=""
    tech_stack:str=""
    experience:str=""
    question:str=""
    answer:str=""
    difficulty:str="medium"
    history:list=Field(default_factory=list)
    retrieved_context:str=""
    score:int=0
    feedback:str=""
    asked_questions:List[str]=[]
    current_question:int
    total_questions:int
    report:str=""


class ReportRequest(BaseModel):
    session_id:str=""
    history:list=[]
    tech_stack:str=""
    difficulty:str="medium"
    experience:str=""
    current_question:int=0
    total_questions:int=0


def config(session_id):
    return{
        "configurable":{
            "thread_id":session_id
        }
    }


@app.post("/")
async def health():
    return {
        "status":"AI service running"
    }

@app.post("/start-interview")
async def start(data:StartInterviewRequest):
    request = data.model_dump()

    session_id = request.pop("session_id")
    state={
        **request,
        "mode":"question",
        "question":"",
        "answer":"",
        "retrieved_context":"",
        "score":0,
        "feedback":"",
        "history":[],
        "report":"",
        "next_action":""
    }
    result = await interview_graph.ainvoke(
        state,
        config(session_id)
    )

    return {
        "question":result.get("question"),
        "difficulty":result.get("difficulty")
    }


@app.post("/submit-answer")
async def submit(data:SubmitAnswerRequest):
    request = data.model_dump()
    session_id = request.pop("session_id")

    state = {
        **request,
        "mode":"answer"
    }
    
    result = await interview_graph.ainvoke(
        state,
        config(session_id)
    )

    return {
        "score":result.get("score"),
        "feedback":result.get("feedback"),
        "difficulty":result.get("difficulty"),
        "question":result.get("question"),
        "next_action":result.get("next_action")
        }

@app.post("/report")
async def report(data:ReportRequest):
    request = data.model_dump()
    session_id = request.pop("session_id")

    state = {
        **request,
        "mode":"report",
        "question":"",
        "answer":"",
        "retrieved_context":"",
        "score":0,
        "feedback":"",
        "asked_questions":[],
        "next_action":""
    }
    
    result = await interview_graph.ainvoke(
        state,
        config(session_id)
    )
    return {
        "report":result["report"]
    }