import os
import sys
import django
from dotenv import load_dotenv

# 1. Load Environment Variables from .env file
load_dotenv()

# 2. Setup Django Environment
# This allows access to settings.BASE_DIR and other Django utilities
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
try:
    django.setup()
    from django.conf import settings
except Exception as e:
    print(f"❌ Django Setup Error: {e}")
    print("   Ensure you are running this script from the project root or your python path is correct.")
    sys.exit(1)

# 3. LangChain Imports
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

def validate_environment():
    """Ensures all necessary API keys are present."""
    required_keys = ["PINECONE_API_KEY", "HUGGINGFACEHUB_API_TOKEN"]
    missing = [key for key in required_keys if not os.getenv(key)]
    
    if missing:
        print(f"❌ Missing Environment Variables: {', '.join(missing)}")
        print("   Please ensure your .env file is set up correctly.")
        return False
    return True

def ingest_docs():
    # --- CONFIGURATION ---
    INDEX_NAME = "immuno-rag"
    
    if not validate_environment():
        return

    print("🚀 Starting Ingestion Process...")

    # --- STEP 1: LOAD PDFS ---
    # Construct path safely using Django settings
    data_path = os.path.join(settings.BASE_DIR, 'data') # Adjust 'data' if your folder is named differently
    
    if not os.path.exists(data_path):
        print(f"❌ Data folder missing: {data_path}")
        print(f"   Please create a folder named 'data' in your project root and add PDFs.")
        return

    print(f"📂 Loading PDFs from: {data_path}")
    
    try:
        # Load all PDFs in the directory
        loader = DirectoryLoader(data_path, glob="*.pdf", loader_cls=PyPDFLoader)
        raw_docs = loader.load()
        
        if not raw_docs:
            print("⚠️ No PDFs found! Make sure .pdf files are in the data directory.")
            return
            
        print(f"📄 Found {len(raw_docs)} document pages.")
        
    except Exception as e:
        print(f"❌ Error loading PDFs: {e}")
        return

    # --- STEP 2: SPLIT TEXT ---
    print("✂️ Splitting text into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    docs = text_splitter.split_documents(raw_docs)
    print(f"🧩 Created {len(docs)} text chunks.")

    # --- STEP 3: INITIALIZE EMBEDDINGS ---
    print("⚡ Initializing HuggingFace Embeddings...")
    try:
        embeddings = HuggingFaceEndpointEmbeddings(
            model="sentence-transformers/all-MiniLM-L6-v2"
            # api_key is automatically read from HUGGINGFACEHUB_API_TOKEN env var
        )
    except Exception as e:
        print(f"❌ Error initializing embeddings: {e}")
        return

    # --- STEP 4: UPLOAD TO PINECONE ---
    print(f"☁️ Uploading to Pinecone Index: '{INDEX_NAME}'...")
    try:
        # from_documents automatically reads PINECONE_API_KEY from env vars
        PineconeVectorStore.from_documents(
            docs, 
            embeddings, 
            index_name=INDEX_NAME
        )
        print("✅ Success! Research papers are now indexed in the cloud.")
        
    except Exception as e:
        print(f"❌ Error uploading to Pinecone: {e}")
        print("   Tip: Ensure the index exists in your Pinecone console and matches the dimensions (384 for MiniLM).")

if __name__ == "__main__":
    ingest_docs()