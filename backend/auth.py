import sqlite3
import hashlib
import jwt
import datetime
from functools import wraps
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = "spk_maut_secret_key_2024"
security = HTTPBearer()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_token(user_id: int, email: str, role: str) -> str:
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    return verify_token(token)

def admin_required(current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

def init_users_db():
    conn = sqlite3.connect('spk_maut.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create default admin
    cursor.execute('SELECT COUNT(*) FROM users WHERE role = "admin"')
    if cursor.fetchone()[0] == 0:
        admin_password = hash_password("admin123")
        cursor.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ("Admin", "admin@spkmaut.com", admin_password, "admin")
        )
    
    conn.commit()
    conn.close()

def create_user(name: str, email: str, password: str) -> dict:
    conn = sqlite3.connect('spk_maut.db')
    cursor = conn.cursor()
    
    try:
        hashed_password = hash_password(password)
        cursor.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            (name, email, hashed_password)
        )
        user_id = cursor.lastrowid
        conn.commit()
        return {"id": user_id, "name": name, "email": email, "role": "user"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        conn.close()

def authenticate_user(email: str, password: str) -> dict:
    conn = sqlite3.connect('spk_maut.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, name, email, password, role FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    conn.close()
    
    if not user or not verify_password(password, user[3]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"id": user[0], "name": user[1], "email": user[2], "role": user[4]}

def get_all_users():
    conn = sqlite3.connect('spk_maut.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC')
    users = cursor.fetchall()
    conn.close()
    return [{"id": u[0], "name": u[1], "email": u[2], "role": u[3], "created_at": u[4]} for u in users]