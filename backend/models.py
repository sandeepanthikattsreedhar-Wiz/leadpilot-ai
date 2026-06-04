import datetime

from sqlalchemy import Column, Integer, String,DateTime
from database import Base
from datetime import datetime, timezone

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    task_title = Column(String)
    task_name = Column(String)
    last_updated = Column(
    DateTime,
    default=datetime.utcnow,
    onupdate=datetime.utcnow

)
    assigned_to = Column(String)

    start_date = Column(String)
    end_date = Column(String)

    remarks = Column(String)

    status = Column(String, default="Yet to Start")
    priority = Column(String, default="Medium")
    start_date_dt = Column(DateTime)
    end_date_dt = Column(DateTime)
    next_followup_date = Column(String)
    followup_status = Column(String, default="Pending")
    followup_notes = Column(String)


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)
    time = Column(String)
    owner = Column(String)
    agenda = Column(String)

    notes = Column(String)

    # NEW
    transcript = Column(String)
    ai_summary = Column(String)
    action_items = Column(String)

    score = Column(Integer, default=0)

class MeetingLog(Base):
    __tablename__ = "meeting_logs"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer)
    date = Column(String)   # "2026-04-30"
    notes = Column(String)

class FollowUp(Base):
    __tablename__ = "followups"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer)
    owner = Column(String)
    task = Column(String)
    days = Column(Integer)
    priority = Column(String)
    status = Column(String, default="Pending")
    last_updated = Column(
    DateTime,
    default=datetime.utcnow,
    onupdate=datetime.utcnow
)
    
class FollowUpLog(Base):
    __tablename__ = "followup_logs"

    id = Column(Integer, primary_key=True, index=True)

    task_id = Column(Integer)

    status = Column(String)

    remarks = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )