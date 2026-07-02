from fastapi import APIRouter

router = APIRouter(prefix="/v1")

@router.get("/health")
def health_check():
    return {"status": "healthy"}

@router.get("/version")
def version_check():
    return {"version": "1.0.0", "engine": "aegisllm"}
