from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from maut import calculate_maut_scores
from database import init_db, get_criteria, update_criteria, save_calculation, get_calculations, delete_calculation
from auth import init_users_db, create_user, authenticate_user, create_token, get_current_user, admin_required, get_all_users

app = FastAPI()
init_db()
init_users_db()

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
    min_value: float = 0
    max_value: float = 100
    decimal: bool = True

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

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
def get_history(current_user: dict = Depends(get_current_user)):
    return {"history": get_calculations()}

@app.delete("/api/history/{calculation_id}")
def delete_history(calculation_id: int, current_user: dict = Depends(get_current_user)):
    delete_calculation(calculation_id)
    return {"message": "History deleted successfully"}

@app.post("/api/auth/register")
def register(user: UserRegister):
    new_user = create_user(user.name, user.email, user.password)
    token = create_token(new_user["id"], new_user["email"], new_user["role"])
    return {"user": new_user, "token": token}

@app.post("/api/auth/login")
def login(user: UserLogin):
    authenticated_user = authenticate_user(user.email, user.password)
    token = create_token(authenticated_user["id"], authenticated_user["email"], authenticated_user["role"])
    return {"user": authenticated_user, "token": token}

@app.get("/api/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {"user": current_user}

@app.get("/api/admin/users")
def get_users(current_user: dict = Depends(admin_required)):
    return {"users": get_all_users()}