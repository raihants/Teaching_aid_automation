import psycopg2
from dotenv import load_dotenv
from core import state
import os
from datetime import datetime

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT"))
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

def get_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT
    )


def insert_production(data, mo_id):
    conn = get_connection()
    cursor = conn.cursor()
    
    try :
        state.end_time = datetime.fromisoformat(data["timestamp"])
            
        cursor.execute("""
            INSERT INTO production_history (product_id, mo_id, result, start_time, end_time)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            data.get("product_id"),
            mo_id,
            data.get("result"),
            state.start_time,
            state.end_time
        ))
        conn.commit()
    
    except Exception as e:
        conn.rollback()
        print("❌ DB Insert Error:", e)
    
    finally:
        cursor.close()
        conn.close()
        

def insert_mqtt_log(topic, payload):
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        timestamp = datetime.fromisoformat(payload["timestamp"])
        
        cursor.execute("""
            INSERT INTO workcenter_log 
            (product_id, workcenter, status, result, cycle_time, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            payload.get("product_id"),
            payload.get("workcenter"),
            payload.get("status"),
            payload.get("result"),
            payload.get("cycle_time"),
            timestamp
        ))
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print("❌ DB Insert Log Error:", e)
    
    finally:
        cursor.close()
        conn.close()

    
def get_history(workcenter=None, limit=50):
    conn = get_connection()
    cursor = conn.cursor()

    if workcenter:
        query = """
            SELECT id, product_id, workcenter, status, result, cycle_time, timestamp
            FROM workcenter_log
            WHERE workcenter = %s
            ORDER BY timestamp DESC, id DESC
            LIMIT %s
        """
        cursor.execute(query, (workcenter, limit))
    else:
        query = """
            SELECT id,product_id, workcenter, status, result, cycle_time, timestamp
            FROM workcenter_log
            ORDER BY timestamp DESC, id DESC
            LIMIT %s
        """
        cursor.execute(query, (limit,))

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    # convert ke dict biar enak jadi JSON
    result = []
    for row in rows:
        result.append({
            "product_id": row[1],
            "workcenter": row[2],
            "status": row[3],
            "result": row[4],
            "cycle_time": row[5],
            "timestamp": row[6].isoformat() if row[6] else None
        })

    return result

def get_production_history(mo_id=None, limit=50):
    conn = get_connection()
    cursor = conn.cursor()

    if mo_id:
        query = """
            SELECT product_id, mo_id, result, start_time, end_time
            FROM production_history
            WHERE mo_id = %s
            ORDER BY end_time DESC
            LIMIT %s
        """
        cursor.execute(query, (mo_id, limit))
    else:
        query = """
            SELECT product_id, mo_id, result, start_time, end_time
            FROM production_history
            ORDER BY end_time DESC
            LIMIT %s
        """
        cursor.execute(query, (limit,))

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    result = []
    for row in rows:
        result.append({
            "product_id": row[0],
            "mo_id": row[1],
            "result": row[2],
            "start_time": row[3].isoformat() if row[3] else None,
            "end_time": row[4].isoformat() if row[4] else None
        })

    return result
