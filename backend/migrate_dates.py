from sqlalchemy.orm import Session
from datetime import datetime

# ✅ IMPORT THESE CORRECTLY
from database import SessionLocal   # your DB connection
from models import Task             # your model


# ✅ CREATE DB SESSION
db: Session = SessionLocal()


def parse_date(date_value):
    if not date_value:
        return None

    if isinstance(date_value, datetime):
        return date_value

    try:
        return datetime.fromisoformat(date_value)
    except:
        try:
            return datetime.strptime(date_value, "%Y-%m-%d")
        except:
            return None


try:
    tasks = db.query(Task).all()

    for t in tasks:
        t.start_date_dt = parse_date(t.start_date)
        t.end_date_dt = parse_date(t.end_date)

    db.commit()
    print("✅ Migration completed successfully")

except Exception as e:
    print("❌ Migration failed:", e)

finally:
    db.close()