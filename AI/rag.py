import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def _initialize_db():
    persist_dir = "./chroma_data4"
    if os.path.exists(persist_dir):
        return Chroma(
            collection_name="interview_questions",
            persist_directory=persist_dir,
            embedding_function=embedding_model
        )
    
    loader = PyPDFLoader("./QuestionBank.pdf")
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=700,
        chunk_overlap=50,
        separators=["DOMAIN", "---", "\n\n", "\n", " "]
    )
    chunks = splitter.split_documents(documents)

    current_domain = "general"
    current_difficulty = "medium"

    for chunk in chunks:
        text = chunk.page_content.lower()

        if "domain 1" in text:
            current_domain = "react"
        elif "domain 2" in text:
            current_domain = "node"
        elif "domain 3" in text:
            current_domain = "mern"
        elif "domain 4" in text:
            current_domain = "machine learning"
        elif "domain 5" in text:
            current_domain = "genai"
        elif "domain 6" in text:
            current_domain = "python"
        elif "domain 7" in text:
            current_domain = "dsa"
        elif "domain 8" in text:
            current_domain = "system design"
        elif "domain 9" in text:
            current_domain = "java"

        if "--- easy" in text:
            current_difficulty = "easy"
        elif "--- medium" in text:
            current_difficulty = "medium"
        elif "--- hard" in text:
            current_difficulty = "hard"

        chunk.metadata["domain"] = current_domain
        chunk.metadata["difficulty"] = current_difficulty

    db = Chroma.from_documents(
        collection_name="interview_questions",
        documents=chunks,
        embedding=embedding_model,
        persist_directory=persist_dir
    )
    
    print("Vector DB Created Successfully")
    return db

# Initialize globally to avoid concurrent access issues
vector_db = _initialize_db()

def get_retriever(domain, difficulty):
    domain_lower = domain.lower()
    mapped_domain = domain_lower
    
    if "react" in domain_lower or "frontend" in domain_lower:
        mapped_domain = "react"
    elif "node" in domain_lower or "backend" in domain_lower:
        mapped_domain = "node"
    elif "mern" in domain_lower or "fullstack" in domain_lower or "full stack" in domain_lower:
        mapped_domain = "mern"
    elif "gen" in domain_lower:
        mapped_domain = "genai"
    elif "machine" in domain_lower or "ml" in domain_lower or "ai" in domain_lower:
        mapped_domain = "machine learning"
    elif "java" in domain_lower:
        mapped_domain = "java"
    elif "python" in domain_lower:
        mapped_domain = "python"
    elif "data" in domain_lower or "dsa" in domain_lower or "algorithm" in domain_lower:
        mapped_domain = "dsa"
    elif "system" in domain_lower or "design" in domain_lower:
        mapped_domain = "system design"

    diff_lower = difficulty.lower()
    mapped_diff = "medium"
    if "easy" in diff_lower:
        mapped_diff = "easy"
    elif "hard" in diff_lower:
        mapped_diff = "hard"

    valid_domains = ["react", "node", "mern", "machine learning", "genai", "java", "python", "dsa", "system design"]
    
    filter_dict = {
        "$and": [
            {"domain": mapped_domain},
            {"difficulty": mapped_diff}
        ]
    } if mapped_domain in valid_domains else {"difficulty": mapped_diff}

    return vector_db.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": 3,
            "filter": filter_dict
        }
    )
