from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from maut import calculate_maut_scores
from database import init_db, get_criteria, update_criteria, save_calculation, get_calculations, delete_calculation

app = FastAPI()
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Candidate(BaseModel):
    name: str
    scores: List[float]

class MAUTRequest(BaseModel):
    candidate: List[Candidate]
    title: str = "Kalkulasi MAUT"

class CriteriaItem(BaseModel):
    name: str
    weight: float
    type: str

@app.get("/api/criteria")
def get_criteria_api():
    return {"criteria": get_criteria()}

@app.put("/api/criteria")
def update_criteria_api(criteria: List[CriteriaItem]):
    criteria_dict = [c.dict() for c in criteria]
    update_criteria(criteria_dict)
    return {"message": "Criteria updated successfully"}

@app.post("/api/maut")
def calculate_maut(req: MAUTRequest):
    result = calculate_maut_scores(req.candidate)
    candidates_data = [c.dict() for c in req.candidate]
    save_calculation(req.title, candidates_data, result)
    return {"result": result}

@app.get("/api/history")
def get_history():
    return {"history": get_calculations()}

@app.delete("/api/history/{calculation_id}")
def delete_history(calculation_id: int):
    delete_calculation(calculation_id)
    return {"message": "History deleted successfully"}