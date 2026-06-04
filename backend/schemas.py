from pydantic import BaseModel

class TaskCreate(BaseModel):
    task_title: str
    task_name: str
    assigned_to: str
    start_date: str
    end_date: str
    remarks: str
    status: str = "Yet to Start"
    priority: str = "Medium"
    next_followup_date: str | None = None
    followup_status: str = "Pending"
    followup_notes: str = ""

class MeetingCreate(BaseModel):
    title: str
    time: str
    owner: str
    agenda: str
    notes: str = ""
    score: int = 80

class NotesUpdate(BaseModel):
    notes: str