from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from maut import calculate_maut_scores, CRITERIA_INFO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Candidate(BaseModel):
    name: str
    scores: List[float] # * ini buat ngurut nanti sesuai kriteria

class MAUTRequest(BaseModel):
    candidate: List[Candidate]

@app.post("/api/maut")
def calculate_maut(req: MAUTRequest):
    result = calculate_maut_scores(req.candidate)
    return {"result": result}