from sqlalchemy import Column, Integer, String
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    task_title = Column(String)
    task_name = Column(String)

    assigned_to = Column(String)

    start_date = Column(String)
    end_date = Column(String)

    remarks = Column(String)

    status = Column(String, default="Pending")


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    time = Column(String)
    owner = Column(String)
    agenda = Column(String)
    notes = Column(String)
    score = Column(Integer)

class MeetingLog(Base):
    __tablename__ = "meeting_logs"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer)
    date = Column(String)   # "2026-04-30"
    notes = Column(String)