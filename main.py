from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="BLAZE AI Service")

class GenerationRequest(BaseModel):
    prompt: str
    style: str = "realistic"
    negative_prompt: str = ""
    aspect_ratio: str = "1:1"

@app.get("/")
async def root():
    return {"message": "BLAZE AI Service is running"}

@app.post("/generate")
async def generate(request: GenerationRequest):
    # This will be integrated with models and celery later
    return {
        "status": "queued",
        "task_id": "placeholder_task_id",
        "request": request
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
