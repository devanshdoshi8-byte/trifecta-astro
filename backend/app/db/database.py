import sqlite3
import json
import os
from typing import Optional, Dict, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "trifecta.db")

def init_db(conn=None):
    should_close = False
    if conn is None:
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        should_close = True
    
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS targets (
        target_id TEXT PRIMARY KEY,
        tic_id TEXT,
        toi_id TEXT,
        host_name TEXT,
        ra_deg REAL,
        dec_deg REAL,
        metadata_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analyses (
        analysis_id TEXT PRIMARY KEY,
        target_id TEXT,
        status TEXT,
        sector_used INTEGER,
        result_json TEXT,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        software_version TEXT DEFAULT '0.1.0'
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cache_store (
        cache_key TEXT PRIMARY KEY,
        data_json TEXT,
        cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    conn.commit()
    if should_close:
        conn.close()

def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    init_db(conn)
    return conn

def save_analysis_record(analysis_id: str, target_id: str, status: str, sector: int, result_dict: Dict[str, Any]):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO analyses (analysis_id, target_id, status, sector_used, result_json, completed_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
    """, (analysis_id, target_id, status, sector, json.dumps(result_dict)))
    conn.commit()
    conn.close()

def get_cached_item(cache_key: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT data_json FROM cache_store WHERE cache_key = ?", (cache_key,))
    row = cursor.fetchone()
    conn.close()
    if row and row["data_json"]:
        return json.loads(row["data_json"])
    return None

def set_cached_item(cache_key: str, data: Dict[str, Any]):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO cache_store (cache_key, data_json, cached_at)
    VALUES (?, ?, datetime('now'))
    """, (cache_key, json.dumps(data)))
    conn.commit()
    conn.close()

# Auto-initialize on import
init_db()
