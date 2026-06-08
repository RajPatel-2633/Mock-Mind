import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface import  HuggingFaceEmbeddings

embedding_model = HuggingFaceEmbeddings(
    model_name= "sentence-transformers/all-MiniLM-L6-v2"
)

def create_vector_db():
    if os.path.exists("./chroma_db"):
        return
    
    loader = PyPDFLoader("./QuestionBank.pdf")
    
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=700,
        chunk_overlap=50,
        separators=[
        "DOMAIN",
        "---",
        "\n\n",
        "\n",
        " "
    ]
    )

    chunks=splitter.split_documents(documents)

    for chunk in chunks:

        text = chunk.page_content.lower()


        if "domain 1: reactjs" in text:
            current_domain = "react"

        elif "domain 2: node" in text:
            current_domain = "node"

        elif "domain 3" in text and "machine" in text:
            current_domain = "machine learning"

        elif "domain 5" in text and "generative" in text:
            current_domain = "genai"

        elif "domain 9: java" in text:
            current_domain = "java"

        if "--- easy" in text:
         current_difficulty = "easy"

        elif "--- medium" in text:
         current_difficulty = "medium"

        elif "--- hard" in text:
         current_difficulty = "hard"

        chunk.metadata["domain"] = current_domain
        chunk.metadata["difficulty"] = current_difficulty

    Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory="./chroma_db"
    )
    
    print("Vector DB Created Successfully")


def get_retriever(domain,difficulty):
    create_vector_db()

    db = Chroma(
        persist_directory="./chroma_db",
        embedding_function=embedding_model
    )
    
    return db.as_retriever(
       search_kwargs={

            "k":3,

            "filter":{
                "$and":[

                {
                "domain":
                domain.lower()
                },

                {
                "difficulty":
                difficulty.lower()
                }

            ]
            }

        }
    )


