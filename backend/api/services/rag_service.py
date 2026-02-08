from dotenv import load_dotenv
load_dotenv()
import os
from django.conf import settings

# --- MODERN LANGCHAIN IMPORTS ---
try:
    from langchain_groq import ChatGroq
    from langchain_pinecone import PineconeVectorStore
    from langchain_huggingface import HuggingFaceEndpointEmbeddings
    from langchain_core.prompts import PromptTemplate
    from langchain_core.runnables import RunnablePassthrough
    from langchain_core.output_parsers import StrOutputParser
except ImportError as e:
    print(f"❌ Import Error: {e}. Run: pip install langchain-groq langchain-pinecone langchain-huggingface pinecone-client")
    PineconeVectorStore = None

class ImmunoRAG:
    def __init__(self):
        # Configuration - Get keys from Environment
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.pinecone_api_key = os.getenv("PINECONE_API_KEY")
        self.hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
        
        # Ensure Environment Variables are set for libraries that rely on them implicitly
        if self.pinecone_api_key: os.environ['PINECONE_API_KEY'] = self.pinecone_api_key
        if self.hf_token: os.environ['HUGGINGFACEHUB_API_TOKEN'] = self.hf_token
        
        self.index_name = "immuno-rag" # Must match your ingestion script
        self.vector_store = None
        self.retriever = None
        
        self._initialize_service()

    def _initialize_service(self):
        if not PineconeVectorStore: return

        try:
            # 1. Initialize Embeddings 
            # (MUST match the model used in ingestion: sentence-transformers/all-MiniLM-L6-v2)
            embeddings = HuggingFaceEndpointEmbeddings(
                huggingfacehub_api_token=self.hf_token,
                model="sentence-transformers/all-MiniLM-L6-v2"
            )

            # 2. Connect to Existing Pinecone Index
            # We do NOT ingest here. We just connect to the cloud index.
            # FIX: Removed 'pinecone_api_key' argument, relying on os.environ set in __init__
            self.vector_store = PineconeVectorStore.from_existing_index(
                index_name=self.index_name,
                embedding=embeddings
            )
            
            # 3. Create Retriever
            self.retriever = self.vector_store.as_retriever(search_kwargs={"k": 3}) # Retrieve top 3 relevant chunks
            print("✅ Immuno-LLM Connected to Pinecone Cloud")

        except Exception as e:
            print(f"❌ RAG Connection Error: {e}")

    def get_answer(self, query, context_type="doctor"):
        if not self.vector_store:
            return "⚠️ AI Service Unavailable. Please check API connections."

        # Define Persona
        if context_type == "patient":
            system_instruction = "You are Dr. Immuno. Explain the medical information simply and reassuringly."
        else:
            system_instruction = "You are ImmunoAI, a specialized Neurologist assistant. Answer precisely based on the provided research context."

        # Llama 3 Prompt Template
        template = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>
        {system_instruction}
        Use the following Context to answer the Question. 
        If the answer is not in the context, say "I don't find that information in the provided research papers."
        <|eot_id|><|start_header_id|>user<|end_header_id|>
        Context: {{context}}
        Question: {{question}}
        Answer: 
        <|eot_id|><|start_header_id|>assistant<|end_header_id|>"""

        prompt = PromptTemplate.from_template(template)
        
        # Define LLM (Groq - Llama 3.3 Versatile)
        # FIX: Updated model name to replace decommissioned one
        llm = ChatGroq(
            model="llama-3.3-70b-versatile", 
            api_key=self.groq_api_key,
            temperature=0.3
        )
        
        rag_chain = (
            {"context": self.retriever, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )
        
        try:
            return rag_chain.invoke(query)
        except Exception as e:
            return f"AI Error: {str(e)}"