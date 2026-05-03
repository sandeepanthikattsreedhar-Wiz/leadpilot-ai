from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from models import Task
from schemas import TaskCreate
from models import Task, Meeting, MeetingLog
from schemas import TaskCreate, MeetingCreate, NotesUpdate
from datetime import datetime

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "LeadPilot Running"}

# ----------------------------
# GET TASKS
# ----------------------------
@app.get("/tasks")
def get_tasks(
    search: str = Query(default=""),
    status: str = Query(default=""),
    db: Session = Depends(get_db)
):
    query = db.query(Task)

    if search:
        query = query.filter(Task.task_title.contains(search))

    if status:
        query = query.filter(Task.status == status)

    return query.order_by(Task.id.desc()).all()

# ----------------------------
# ADD TASK
# ----------------------------
@app.post("/tasks")
def add_task(task: TaskCreate, db: Session = Depends(get_db)):
    item = Task(**task.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

# ----------------------------
# UPDATE TASK
# ----------------------------
@app.put("/tasks/{task_id}")
def update_task(task_id: int, data: TaskCreate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in data.dict().items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    return task

# ----------------------------
# DELETE TASK
# ----------------------------
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Deleted"}


@app.get("/dashboard-full")
def dashboard_full(db: Session = Depends(get_db)):
    total = db.query(Task).count()
    completed = db.query(Task).filter(Task.status == "Completed").count()
    pending = db.query(Task).filter(Task.status == "Pending").count()
    progress = db.query(Task).filter(Task.status == "In Progress").count()

    recent = db.query(Task).order_by(Task.id.desc()).limit(5).all()

    return {
        "stats": {
            "total": total,
            "completed": completed,
            "pending": pending,
            "inprogress": progress
        },
        "priority": {
            "high": 0,
            "medium": 0,
            "low": 0
        },
        "productivity": round((completed / total) * 100) if total else 0,
        "recent": recent
    }

@app.get("/scheduler-data")
def scheduler_data(db: Session = Depends(get_db)):
    engineers = [
        "Rakshitha",
        "Gokul",
        "Javeri",
        "Divya"
    ]

    result = []

    for name in engineers:
        user_tasks = db.query(Task).filter(
            Task.assigned_to == name
        ).all()

        total = len(user_tasks)

        pending = len([
            t for t in user_tasks
            if t.status == "Pending"
        ])

        progress = len([
            t for t in user_tasks
            if t.status == "In Progress"
        ])

        completed = len([
            t for t in user_tasks
            if t.status == "Completed"
        ])

        available = total < 4
        overloaded = total >= 4

        utilization = min(total * 25, 100)

        result.append({
            "name": name,
            "tasks": total,
            "pending": pending,
            "progress": progress,
            "completed": completed,
            "available": available,
            "overloaded": overloaded,
            "utilization": utilization
        })

    return result

@app.get("/meetings")
def get_meetings(db: Session = Depends(get_db)):
    meetings = db.query(Meeting).all()
    logs = db.query(MeetingLog).all()

    result = []

    for m in meetings:
        meeting_logs = [
            {
                "id": l.id,
                "date": l.date,
                "notes": l.notes
            }
            for l in logs if l.meeting_id == m.id
        ]

        result.append({
            "id": m.id,
            "title": m.title,
            "owner": m.owner,
            "time": m.time,
            "agenda": m.agenda,
            "logs": meeting_logs   # ✅ JSON format
        })

    return result


@app.post("/meetings")
def add_meeting(
    data: MeetingCreate,
    db: Session = Depends(get_db)
):
    item = Meeting(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@app.put("/meetings/{meeting_id}/notes")
def update_notes(
    meeting_id: int,
    data: NotesUpdate,
    db: Session = Depends(get_db)
):
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id
    ).first()

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    meeting.notes = data.notes
    db.commit()
    db.refresh(meeting)

    return meeting


@app.delete("/meetings/{meeting_id}")
def delete_meeting(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id
    ).first()

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    db.delete(meeting)
    db.commit()

    return {"message": "Deleted"}

@app.get("/performance-data")
def performance_data(db: Session = Depends(get_db)):
    engineers = [
        "Rakshitha",
        "Gokul",
        "Javeri",
        "Divya"
    ]

    result = []

    for name in engineers:
        tasks = db.query(Task).filter(
            Task.assigned_to == name
        ).all()

        completed = len([
            t for t in tasks
            if t.status == "Completed"
        ])

        pending = len([
            t for t in tasks
            if t.status in [
                "Pending",
                "In Progress"
            ]
        ])

        result.append({
            "name": name,
            "completed": completed,
            "pending": pending
        })

    return result

@app.get("/followup-data")
def followup_data(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()

    result = []

    for t in tasks:
        # Calculate days since end_date (simple logic)
        days = 0
        if t.end_date:
            try:
                from datetime import datetime
                end = datetime.strptime(t.end_date, "%Y-%m-%d")
                days = (datetime.now() - end).days
            except:
                days = 0

        priority = "High" if days >= 3 else "Medium" if days >= 1 else "Low"

        result.append({
            "id": t.id,
            "owner": t.assigned_to,
            "task": t.task_title,
            "days": max(days, 0),
            "priority": priority,
            "status": t.status
        })

    return result

@app.get("/capacity-data")
def capacity_data(db: Session = Depends(get_db)):
    engineers = [
        {"name": "Rakshitha", "skill": "Integration"},
        {"name": "Gokul", "skill": "Integration"},
        {"name": "Javeri", "skill": "Integration"},
        {"name": "Divya", "skill": "Integration"},
    ]

    result = []

    for index, user in enumerate(engineers, start=1):
        tasks = db.query(Task).filter(
            Task.assigned_to == user["name"]
        ).all()

        total_tasks = len(tasks)

        # 1 task = 2 hours
        allocated = total_tasks * 2

        result.append({
            "id": index,
            "name": user["name"],
            "allocated": allocated,
            "capacity": 8,
            "skill": user["skill"]
        })

    return result

@app.get("/reports-data")
def reports_data(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()

    total = len(tasks)

    completed = len([
        t for t in tasks
        if t.status == "Completed"
    ])

    pending = len([
        t for t in tasks
        if t.status == "Pending"
    ])

    progress = len([
        t for t in tasks
        if t.status == "In Progress"
    ])

    owners = {}

    for t in tasks:
        name = t.assigned_to or "Unassigned"
        owners[name] = owners.get(name, 0) + 1

    top_owner = "N/A"

    if owners:
        top_owner = max(owners, key=owners.get)

    productivity = (
        round((completed / total) * 100)
        if total > 0 else 0
    )

    weekly_body = f"""
Team completed {completed} tasks this week.
{pending} items are pending.
{progress} items are in progress.
Overall delivery health is stable.
Productivity improved to {productivity}%.
"""

    client_body = f"""
Project execution is active.
Completed items: {completed}
Pending items: {pending}
In progress items: {progress}
Expected milestone closures continue as planned.
"""

    risk_body = f"""
1. {pending} pending tasks may impact timelines.
2. Work in progress needs monitoring.
3. Resource allocation should be reviewed.
"""

    productivity_body = f"""
Top contributor: {top_owner}
Average closure rate: {productivity}%
Pending tasks count: {pending}
Lead efficiency score: {min(productivity + 5, 100)}%
"""

    return {
        "weekly": {
            "title": "Weekly Team Report",
            "body": weekly_body.strip()
        },
        "client": {
            "title": "Client Status Report",
            "body": client_body.strip()
        },
        "risks": {
            "title": "Risk Summary Report",
            "body": risk_body.strip()
        },
        "productivity": {
            "title": "Productivity Report",
            "body": productivity_body.strip()
        }
    }

@app.get("/smart-insights")
def smart_insights(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()

    total = len(tasks)

    pending = [t for t in tasks if t.status == "Pending"]
    progress = [t for t in tasks if t.status == "In Progress"]

    owners = {}

    for t in tasks:
        name = t.assigned_to or "Unassigned"
        owners[name] = owners.get(name, 0) + 1

    overloaded = [
        f"{k} has {v} tasks"
        for k, v in owners.items()
        if v >= 4
    ]

    risk = "Low"
    if len(pending) > 5:
        risk = "High"
    elif len(pending) > 2:
        risk = "Medium"

    recommendations = []

    if len(progress) > 5:
        recommendations.append("Too many tasks in progress")

    if len(pending) > 0:
        recommendations.append("Follow up on pending tasks")

    if total == 0:
        recommendations.append("No tasks created yet")

    return {
        "risk": risk,
        "pending": len(pending),
        "inprogress": len(progress),
        "high_priority": 0,
        "overloaded": overloaded,
        "recommendations": recommendations
    }

@app.post("/meeting-log/{meeting_id}")
def save_log(meeting_id: int, data: dict, db: Session = Depends(get_db)):
    log = MeetingLog(
        meeting_id=meeting_id,
        date=datetime.now().strftime("%Y-%m-%d"),
        notes=data.get("notes")
    )

    db.add(log)
    db.commit()
    db.refresh(log)   # ✅ IMPORTANT

    return log        # ✅ return saved object