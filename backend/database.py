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
            type TEXT NOT NULL CHECK(type IN ('benefit', 'cost')),
            min_value REAL DEFAULT 0,
            max_value REAL DEFAULT 100,
            decimal BOOLEAN DEFAULT 1
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
            ("IPK", 0.18, "benefit", 0, 4.0, 1),
            ("Pengalaman Organisasi", 0.20, "benefit", 1, 5, 0),
            ("Komunikasi", 0.12, "benefit", 0, 100, 1),
            ("Visi Misi", 0.15, "benefit", 0, 100, 1),
            ("Inisiatif", 0.10, "benefit", 0, 100, 1),
            ("Penyelesaian Konflik", 0.10, "benefit", 0, 100, 1),
            ("Ketidakhadiran", 0.10, "cost", 0, 365, 0),
            ("Lama Studi", 0.05, "cost", 3.5, 7.0, 1),
        ]
        cursor.executemany('INSERT INTO criteria (name, weight, type, min_value, max_value, decimal) VALUES (?, ?, ?, ?, ?, ?)', default_criteria)
    
    conn.commit()
    conn.close()

def get_criteria():
    conn = sqlite3.connect('spk_maut.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, weight, type, min_value, max_value, decimal FROM criteria ORDER BY id')
    criteria = cursor.fetchall()
    conn.close()
    return [{"id": c[0], "name": c[1], "weight": c[2], "type": c[3], "min_value": c[4], "max_value": c[5], "decimal": bool(c[6])} for c in criteria]

def update_criteria(criteria_list):
    conn = sqlite3.connect('spk_maut.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM criteria')
    for c in criteria_list:
        cursor.execute('INSERT INTO criteria (name, weight, type, min_value, max_value, decimal) VALUES (?, ?, ?, ?, ?, ?)', 
                      (c["name"], c["weight"], c["type"], c.get("min_value", 0), c.get("max_value", 100), c.get("decimal", True)))
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