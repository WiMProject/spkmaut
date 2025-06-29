import sqlite3
from datetime import datetime
import json

def init_db():
    conn = sqlite3.connect('spk_maut.db')
    cursor = conn.cursor()
    
    # Tabel kriteria
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS criteria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            weight REAL NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('benefit', 'cost'))
        )
    ''')
    
    # Tabel riwayat kalkulasi
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS calculations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            candidates_data TEXT NOT NULL,
            results_data TEXT NOT NULL
        )
    ''')
    
    # Insert default criteria jika belum ada
    cursor.execute('SELECT COUNT(*) FROM criteria')
    if cursor.fetchone()[0] == 0:
        default_criteria = [
            ("IPK", 0.18, "benefit"),
            ("Pengalaman Organisasi", 0.20, "benefit"),
            ("Komunikasi", 0.12, "benefit"),
            ("Visi Misi", 0.15, "benefit"),
            ("Inisiatif", 0.10, "benefit"),
            ("Penyelesaian Konflik", 0.10, "benefit"),
            ("Ketidakhadiran", 0.10, "cost"),
            ("Lama Studi", 0.05, "cost"),
        ]
        cursor.executemany('INSERT INTO criteria (name, weight, type) VALUES (?, ?, ?)', default_criteria)
    
    conn.commit()
    conn.close()

def get_criteria():
    conn = sqlite3.connect('spk_maut.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, weight, type FROM criteria ORDER BY id')
    criteria = cursor.fetchall()
    conn.close()
    return [{"id": c[0], "name": c[1], "weight": c[2], "type": c[3]} for c in criteria]

def update_criteria(criteria_list):
    conn = sqlite3.connect('spk_maut.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM criteria')
    for c in criteria_list:
        cursor.execute('INSERT INTO criteria (name, weight, type) VALUES (?, ?, ?)', 
                      (c["name"], c["weight"], c["type"]))
    conn.commit()
    conn.close()

def save_calculation(title, candidates, results):
    conn = sqlite3.connect('spk_maut.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO calculations (title, candidates_data, results_data) 
        VALUES (?, ?, ?)
    ''', (title, json.dumps(candidates), json.dumps(results)))
    conn.commit()
    conn.close()

def get_calculations():
    conn = sqlite3.connect('spk_maut.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, title, created_at, candidates_data, results_data FROM calculations ORDER BY created_at DESC')
    calculations = cursor.fetchall()
    conn.close()
    return [{
        "id": c[0], 
        "title": c[1], 
        "created_at": c[2],
        "candidates": json.loads(c[3]),
        "results": json.loads(c[4])
    } for c in calculations]

def delete_calculation(calculation_id):
    conn = sqlite3.connect('spk_maut.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM calculations WHERE id = ?', (calculation_id,))
    conn.commit()
    conn.close()