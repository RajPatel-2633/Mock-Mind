import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq


load_dotenv()

api_key=os.environ["GROQ_API_KEY"]

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.3,
    groq_api_key=api_key
).with_config(
    {
        "run_name":"Groq_Llama_Model"
    }
)