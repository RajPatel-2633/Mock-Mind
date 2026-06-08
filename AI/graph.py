from typing import TypedDict, List
from langgraph.graph import START,END,StateGraph
from langgraph.checkpoint.memory import MemorySaver
from llm import llm
from rag import get_retriever
import re



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
    You are an AI Interviewer. Use these questions: {state['retrieved_context']}.
    Strictly pick only One question based on the difficulty level of {state['difficulty']} and the level of experience of the candidate is {state['experience']} years.These are the already asked question {state['asked_questions']}

    Rules:
    - Ask only the question, do not give any hints or answers.
    - Do not repeat already asked questions
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
 You are an AI Evaluator. Based on the question and answer provided, you got to give a score on the scale from 1 to 10, and also feedback after evaluation.
 Question:{state['question']}
 Answer:{state['answer']}
 Give Output Exactly in the format :
 Score: x/10
 Feeback:.....
"""
    
    response = llm.invoke(prompt)
    match = re.search(
        r"Score:\s*(\d+)",
        response.content
    )

    if match:
        score = int(
            match.group(1)
        )
    else:
        score = 0

    history = state.get("history",[])
    history.append({
        "question":state["question"],
        "answer":state["answer"],
        "evaluation":response.content,
        "score":score
    })

    return {
        "score":score,
        "feedback":response.content,
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



def report_agent(state):
    prompt = f"""
Your task is to generate a Final Report based on the Interview History.
Be Honest and Highlight all the Strong Areas and Weak Areas. Do not SugerCoat, stay raw and give feedbacks with utmost honesty. Also do not forget to add suggestions at the end.
Interview:{state["history"]}

In the Final Report include:
-Overall Performance of the candidate based on the interview
-Strength of the candidate
-Weakness of the candidate
-Suggestions to candidate , if any
"""
    
    response = llm.invoke(prompt)
    return {"report":response.content}



memory = MemorySaver()

question_builder = StateGraph(
    InterviewState
)

question_builder.add_node("retrieve",retrieve_agent)
question_builder.add_node("question",question_agent)

question_builder.add_edge(START,"retrieve")
question_builder.add_edge("retrieve","question")
question_builder.add_edge("question",END)

question_graph = question_builder.compile(
    checkpointer=memory
).with_config(
    {
        "run_name":"Question_Generation_Graph"
    }
)


answer_builder = StateGraph(InterviewState)

answer_builder.add_node("evaluate",evaluation_agent)
answer_builder.add_node("difficulty",difficulty_agent)


answer_builder.add_edge(START,"evaluate")
answer_builder.add_edge("evaluate","difficulty")
answer_builder.add_edge("difficulty",END)

answer_graph = answer_builder.compile(
    checkpointer=memory
).with_config(
    {
        "run_name":"Answer_Evaluation_Graph"
    }
)


report_builder = StateGraph(InterviewState)

report_builder.add_node("report",report_agent)

report_builder.add_edge(START,"report")
report_builder.add_edge("report",END)

report_graph = report_builder.compile(
    checkpointer=memory
).with_config(
    {
        "run_name":"Report_Generation_Graph"
    }
)

