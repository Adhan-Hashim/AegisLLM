from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AegisLLM API Gateway",
    description="Enterprise-Grade AI Firewall & Guardrails Platform",
    version="0.1.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AegisLLM API Gateway is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
