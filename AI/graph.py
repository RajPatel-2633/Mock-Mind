from typing import TypedDict, List
from langgraph.graph import START,END,StateGraph
from langgraph.checkpoint.memory import MemorySaver
from llm import llm
from rag import get_retriever
import re
import json



class InterviewState(TypedDict):
    tech_stack:str
    difficulty:str
    experience:str
    question:str
    answer:str
    retrieved_context:str
    score:int
    feedback:str
    history:List[dict]
    report:str
    asked_questions:List[str]
    current_question: int
    total_questions: int
    next_action: str
    mode: str



def retrieve_agent(state):

    retriever = get_retriever(
        state["tech_stack"],
        state["difficulty"]
    )
    prompt = f"""
You are a Retriever who would fetch the related interview questions of the Domain of the tech stack and level of difficulty provided.
DOMAIN{state['tech_stack']}
LEVEL{state['difficulty']}
Interview Questions
"""
    
    docs = retriever.invoke(prompt)
    context = "\n".join(
        doc.page_content
        for doc in docs
    )

    return {"retrieved_context":context}


def question_agent(state):
    prompt = f"""
    You are an AI Interviewer. Use these questions as context/inspiration: {state['retrieved_context']}.
    Strictly pick only ONE question based on the difficulty level of {state['difficulty']} and the level of experience of the candidate is {state['experience']} years.

    CRITICAL INSTRUCTION - ALREADY ASKED QUESTIONS:
    Do NOT ask any of the following questions, as they have already been asked:
    {state['asked_questions']}

    Rules:
    - Ask only the question, do not give any hints or answers.
    - You MUST pick a question that is different from the ALREADY ASKED QUESTIONS.
    - Do not provide any explanation, just the question.
    - Output ONLY the interview question.
    - Do not Mention Difficulty
    - Do not Add any sort of greetings.
    - Maximum one sentence.
"""
    
    response = llm.invoke(prompt)
    asked = state["asked_questions"]
    asked.append(response.content)
    return {"question":response.content,"asked_questions":asked}


def evaluation_agent(state):
    prompt = f"""
 You are an AI Evaluator. Based on the question and answer provided, evaluate the candidate.
 Question:{state['question']}
 Answer:{state['answer']}
 
 You MUST output your evaluation EXACTLY as a raw JSON object with no additional text or formatting. Use this schema:
 {{
   "score": <integer between 1 and 10>,
   "feedback": "<string: detailed explanation of the evaluation>"
 }}
"""
    
    response = llm.invoke(prompt)
    
    try:
        content = response.content
        match = re.search(r"\{.*\}", content, re.DOTALL)
        if match:
            parsed = json.loads(match.group(0))
        else:
            parsed = json.loads(content)
        
        score = int(parsed.get("score", 0))
        feedback = parsed.get("feedback", response.content)
    except Exception as e:
        print(f"Error parsing evaluation JSON: {e}")
        score = 0
        feedback = response.content

    history = state.get("history",[])
    history.append({
        "question":state["question"],
        "answer":state["answer"],
        "evaluation":feedback,
        "score":score
    })

    return {
        "score":score,
        "feedback":feedback,
        "history":history
    }


def difficulty_agent(state):
    score = state["score"]
    
    if score>=8:
        difficulty="hard"
    elif score<=5:
        difficulty="easy"
    else:
        difficulty="medium"
    return {
        "difficulty":difficulty
    }

def followup_agent(state):
    prompt = f"""
You are an interviewer. The candidate was previously asked this question: {state["question"]} to which candidate gave this answer: {state["answer"]}.
After this answer to the question candidate got this feedback from the Judge {state["feedback"]}. This means the candidate is weak in this topic. 
Ask one follow-up question targetting the weak area of the candidate.
Rules:
-Only return the follow-up question.
-No hints, no clues nothing.
- Also it should strictly be a follow up question.

"""
    response = llm.invoke(prompt)
    asked = state["asked_questions"]
    asked.append(response.content)

    return {
        "question": response.content,
        "asked_question":asked,
        "next_action":"answer_required"
    }

def report_agent(state):
    prompt = f"""
Your task is to generate a Final Report based on the Interview History.
Be Honest and Highlight all the Strong Areas and Weak Areas. Do not SugerCoat, stay raw and give feedbacks with utmost honesty.
Interview:{state["history"]}

You MUST output your report EXACTLY as a raw JSON object with no additional text or formatting. Use this schema:
{{
  "overall_score": <integer between 1 and 100>,
  "metrics": {{
     "communication": <integer between 1 and 100>,
     "problem_solving": <integer between 1 and 100>,
     "technical_knowledge": <integer between 1 and 100>,
     "confidence": <integer between 1 and 100>,
     "pace": <integer between 1 and 100>
  }},
  "strengths": ["<string>", "<string>"],
  "weaknesses": ["<string>", "<string>"],
  "suggestions": ["<string>", "<string>"]
}}
"""
    
    response = llm.invoke(prompt)
    
    try:
        content = response.content
        match = re.search(r"\{.*\}", content, re.DOTALL)
        if match:
            parsed_text = match.group(0)
        else:
            parsed_text = content
        
        # Ensure it's valid JSON
        json.loads(parsed_text)
        final_report = parsed_text
    except Exception as e:
        print(f"Error parsing report JSON: {e}")
        final_report = '{"overall_score": 0, "metrics": {"communication": 0, "problem_solving": 0, "technical_knowledge": 0, "confidence": 0, "pace": 0}, "strengths": [], "weaknesses": ["Failed to generate valid report"], "suggestions": []}'

    return {"report": final_report}

def start_router(state):
    if state["mode"] == "question":
        return "retrieve"
    elif state["mode"]  == "answer":
        return "evaluate"
    elif state["mode"] == "report":
        return "report"
    



def  interview_router(state):
    if state["current_question"] + 1 >= state["total_questions"]:
        return "end"
    
    if state["score"] <=3:
        return "followup"
    
    return "next_question"  


memory = MemorySaver()

builder = StateGraph(
    InterviewState
)

builder.add_node("retrieve",retrieve_agent)
builder.add_node("question",question_agent)
builder.add_node("evaluate",evaluation_agent)
builder.add_node("difficulty",difficulty_agent)
builder.add_node("followup",followup_agent)
builder.add_node("report",report_agent)




builder.add_conditional_edges(START,start_router,{
     "retrieve":"retrieve",
     "evaluate":"evaluate",
     "report":"report"
})
builder.add_edge("retrieve","question")
builder.add_edge("question",END)
builder.add_edge("evaluate","difficulty")
builder.add_conditional_edges("difficulty",interview_router,{
    "followup":"followup",
    "next_question":"retrieve",
    "report":"report",
    "end":END
})

builder.add_edge("followup",END)
builder.add_edge("report",END)

interview_graph = builder.compile(
    checkpointer=memory
).with_config(
    {
        "run_name":"Interview_Graph"
    }
)

