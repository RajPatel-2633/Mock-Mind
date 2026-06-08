from fastapi import FastAPI
from pydantic import BaseModel
from typing import List,Optional
from fastapi.middleware.cors import CORSMiddleware 

from graph import question_graph,answer_graph,report_graph

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)

class StartInterviewRequest(BaseModel):
    session_id:str
    tech_stack:str
    difficulty:str
    experience:str


class SubmitAnswerRequest(BaseModel):
    session_id:str
    tech_stack:str
    experience:str
    question:str
    answer:str
    difficulty:str
    history:list=[]
    retrieved_context:str=""
    score:int=0
    feedback:str=""
    asked_questions:List[str]=[]
    report:str=""


class ReportRequest(BaseModel):
    session_id:str
    history:list


def config(session_id):
    return{
        "configurable":{
            "thread_id":session_id
        }
    }


@app.post("/")
def health():
    return {
        "status":"AI service running"
    }

@app.post("/start-interview")
def start(data:StartInterviewRequest):
    request = data.model_dump()

    session_id = request.pop("session_id")
    state={
        **request,
        "question":"",
        "answer":"",
        "retrieved_context":"",
        "score":0,
        "feedback":"",
        "history":[],
        "report":"" ,
        "asked_questions":[]          
    }
    result = question_graph.invoke(
        state,
        config(data.session_id)
    )

    return {
        "question":result["question"],
        "difficulty":result["difficulty"]
    }


@app.post("/submit-answer")
def submit(data:SubmitAnswerRequest):
    request = data.model_dump()
    session_id = request.pop("session_id")
    
    result =  answer_graph.invoke(
        data,
        config(data.session_id)
    )

    return {
        "feedback":result["feedback"],
        "difficulty":result["difficulty"]
        }

@app.post("/report")
def report(data:ReportRequest):
    request = data.model_dump()
    session_id = request.pop("session_id")
    
    result =  report_graph.invoke(
        request,
        config(data.session_id)
    )
    return {
        "report":result["report"]
    }