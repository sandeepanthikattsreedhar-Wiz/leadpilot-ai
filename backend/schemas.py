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

class MeetingCreate(BaseModel):
    title: str
    time: str
    owner: str
    agenda: str
    notes: str = ""
    score: int = 80

class NotesUpdate(BaseModel):
    notes: str