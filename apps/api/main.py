import time
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="AegisLLM API Gateway",
    description="Enterprise-Grade AI Firewall & Guardrails Platform",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# We will mount routers here later
from routers import system, analyze, rules, replay

app.include_router(system.router)
app.include_router(analyze.router)
app.include_router(rules.router)
app.include_router(replay.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
