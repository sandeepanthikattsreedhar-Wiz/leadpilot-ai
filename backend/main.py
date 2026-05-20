from dotenv import load_dotenv
import os

load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi import UploadFile, File
from ai_memory import store_document, search_similar
from ai_engine import generate_summary
from pypdf import PdfReader
from database import SessionLocal, engine, Base
from migrate_dates import parse_date
from models import FollowUp, Task
from schemas import TaskCreate
from models import Task, Meeting, MeetingLog
from schemas import TaskCreate, MeetingCreate, NotesUpdate
from datetime import datetime, timezone
from fastapi import UploadFile, File
from openai import OpenAI
from vector_store import collection
import uuid
from pypdf import PdfReader
from ai_memory import store_document, search_similar

client = OpenAI(api_key=os.getenv("GROQ_API_KEY"),base_url="https://api.groq.com/openai/v1")
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

def extract_pdf(file):
    reader = PdfReader(file)
    text = ""

    for page in reader.pages:
        try:
            text += page.extract_text() or ""
        except:
            pass

    return text

def clean_text(text):
    return text.encode("utf-8", "ignore").decode("utf-8")

def safe_parse(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except:
        return None
    
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
    assigned_to: str = Query(default=""),
    db: Session = Depends(get_db)
):
    query = db.query(Task)

    if search:
        query = query.filter(Task.task_title.contains(search))

    if status:
        query = query.filter(Task.status == status)

    if assigned_to:
        query = query.filter(Task.assigned_to == assigned_to)

    return query.order_by(Task.id.desc()).all()
# ----------------------------
# ADD TASK
# ----------------------------
@app.post("/tasks")
def add_task(task: TaskCreate, db: Session = Depends(get_db)):
    item = Task(**task.dict())
    item.last_updated = datetime.utcnow()

    db.add(item)
    db.commit()
    db.refresh(item)
    return item

# ----------------------------
# UPDATE TASK
# ----------------------------
@app.put("/tasks/{task_id}")
def update_task(task_id: int, payload: TaskCreate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    task.task_title = payload.task_title
    task.task_name = payload.task_name
    task.assigned_to = payload.assigned_to
    task.start_date = payload.start_date
    task.end_date = payload.end_date
    task.remarks = payload.remarks
    task.status = payload.status
    task.priority = payload.priority


    # ✅ THIS IS THE FIX
    task.last_updated = datetime.utcnow()

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
    yet_to_start  = db.query(Task).filter(Task.status == "Yet to Start").count()
    progress = db.query(Task).filter(Task.status == "In Progress").count()

    recent = db.query(Task).order_by(Task.id.desc()).limit(5).all()

    return {
        "stats": {
            "total": total,
            "completed": completed,
            "yet_to_start": yet_to_start,
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
        "Divya",
        "Sandeep"
    ]

    result = []

    for name in engineers:

        # ✅ ALL TASKS
        all_tasks = db.query(Task).filter(
            Task.assigned_to == name
        ).all()

        # ✅ ACTIVE TASKS ONLY (Exclude Completed)
        active_tasks = [
            t for t in all_tasks
            if t.status != "Completed"
        ]

        # ✅ STATUS COUNTS
        yet_to_start = len([
            t for t in active_tasks
            if t.status == "Yet to Start"
        ])

        in_progress = len([
            t for t in active_tasks
            if t.status == "In Progress"
        ])

        in_qa = len([
            t for t in active_tasks
            if t.status == "In QA"
        ])

        in_uat = len([
            t for t in active_tasks
            if t.status == "In UAT"
        ])

        in_production = len([
            t for t in active_tasks
            if t.status == "In Production"
        ])

        blocked = len([
            t for t in active_tasks
            if t.status == "Blocked"
        ])

        completed = len([
            t for t in all_tasks
            if t.status == "Completed"
        ])

        # ✅ ACTIVE WORKLOAD
        workload = len(active_tasks)

        # ✅ UTILIZATION
        utilization = min(workload * 25, 100)

        # ✅ LOAD STATUS
        available = workload <= 2
        overloaded = workload >= 5

        # ✅ AI HEALTH SCORE
        health_score = max(
            0,
            100 - (
                blocked * 15 +
                overloaded * 10 +
                max(utilization - 80, 0)
            )
        )

        # ✅ AI RECOMMENDATION
        if overloaded:
            recommendation = "Redistribute workload immediately"
        elif blocked > 0:
            recommendation = "Resolve blockers quickly"
        elif utilization < 40:
            recommendation = "Can take additional tasks"
        else:
            recommendation = "Balanced allocation"

        result.append({
            "name": name,

            # totals
            "tasks": workload,
            "completed": completed,

            # statuses
            "yet_to_start": yet_to_start,
            "progress": in_progress,
            "qa": in_qa,
            "uat": in_uat,
            "production": in_production,
            "blocked": blocked,

            # metrics
            "utilization": utilization,
            "available": available,
            "overloaded": overloaded,
            "health_score": round(health_score),

            # ai
            "recommendation": recommendation
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
        "Divya",
        "Sandeep"
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

        yet_to_start = len([
            t for t in tasks
            if t.status == "Yet to Start"
        ])

        progress = len([
            t for t in tasks
            if t.status == "In Progress"
        ])

        qa = len([
            t for t in tasks
            if t.status == "In QA"
        ])

        uat = len([
            t for t in tasks
            if t.status == "In UAT"
        ])

        result.append({
            "name": name,
            "completed": completed,
            "yet_to_start": yet_to_start,
            "progress": progress,
            "qa": qa,
            "uat": uat
        })

    return result

from datetime import datetime, timedelta

@app.get("/followup-data")
def followup_data(db: Session = Depends(get_db)):

    tasks = db.query(Task).filter(
        Task.status != "Completed"
    ).all()

    result = []

    today = datetime.utcnow()

    for t in tasks:

        end = parse_date(t.end_date)

        if not end:
            continue

        days_left = (end - today).days

        priority = getattr(t, "priority", "Medium")

        priority_weight = {
            "High": 15,
            "Medium": 8,
            "Low": 3
        }.get(priority, 5)

        urgency_weight = max(0, 10 - days_left)

        score = priority_weight + urgency_weight

        # CRITICALITY
        if days_left <= 1:
            criticality = "High"
        elif days_left <= 4:
            criticality = "Medium"
        else:
            criticality = "Low"

        # AI ACTION
        if days_left < 0:
            action = "Escalate immediately"
        elif days_left == 0:
            action = "Close task today"
        elif days_left <= 2:
            action = "Follow up with owner"
        elif t.status == "Blocked":
            action = "Resolve blockers"
        elif t.status == "In QA":
            action = "Push QA completion"
        elif t.status == "In UAT":
            action = "Coordinate with client"
        else:
            action = "Monitor progress"

        result.append({
            "id": t.id,
            "task": t.task_title,
            "owner": t.assigned_to,
            "priority": priority,
            "status": t.status,
            "days": days_left,
            "score": score,
            "criticality": criticality,
            "action": action,
        })

    return result

@app.get("/capacity-data")
def capacity_data(db: Session = Depends(get_db)):
    engineers = [
        {"name": "Rakshitha", "skill": "Integration"},
        {"name": "Gokul", "skill": "Integration"},
        {"name": "Javeri", "skill": "Integration"},
        {"name": "Divya", "skill": "Integration"},
        {"name": "Sandeep", "skill": "Lead"},
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

    yet_to_start = len([
        t for t in tasks
        if t.status == "Yet to Start"
    ])

    in_progress = len([
        t for t in tasks
        if t.status == "In Progress"
    ])

    in_qa = len([
        t for t in tasks
        if t.status == "In QA"
    ])

    in_uat = len([
        t for t in tasks
        if t.status == "In UAT"
    ])

    in_production = len([
        t for t in tasks
        if t.status == "In Production"
    ])

    blocked = len([
        t for t in tasks
        if t.status == "Blocked"
    ])

    productivity = round(
        (completed / total) * 100
    ) if total > 0 else 0

    # ---------------- OWNER ANALYTICS ----------------
    owners = {}

    for t in tasks:
        name = t.assigned_to or "Unassigned"

        if name not in owners:
            owners[name] = 0

        owners[name] += 1

    top_owner = (
        max(owners, key=owners.get)
        if owners else "N/A"
    )

    owner_chart = [
        {
            "name": k,
            "tasks": v
        }
        for k, v in owners.items()
    ]

    # ---------------- STATUS CHART ----------------
    status_chart = [
        {"name": "Yet to Start", "value": yet_to_start},
        {"name": "In Progress", "value": in_progress},
        {"name": "In QA", "value": in_qa},
        {"name": "In UAT", "value": in_uat},
        {"name": "In Production", "value": in_production},
        {"name": "Completed", "value": completed},
        {"name": "Blocked", "value": blocked},
    ]

    # ---------------- RISK LEVEL ----------------
    risk_level = "Low"

    if blocked >= 3 or yet_to_start >= 10:
        risk_level = "High"
    elif blocked >= 1 or yet_to_start >= 5:
        risk_level = "Medium"

    # ---------------- AI INSIGHTS ----------------
    insights = []

    if blocked > 0:
        insights.append(
            f"{blocked} blocked tasks require immediate attention."
        )

    if yet_to_start > completed:
        insights.append(
            "Task initiation rate is slower than closure rate."
        )

    if in_qa >= 5:
        insights.append(
            "QA phase bottleneck detected."
        )

    if productivity >= 75:
        insights.append(
            "Team productivity is performing well."
        )

    if len(insights) == 0:
        insights.append(
            "Project execution is healthy."
        )

    # ---------------- RECOMMENDATIONS ----------------
    recommendations = []

    if blocked > 0:
        recommendations.append(
            "Conduct escalation review for blocked items."
        )

    if yet_to_start >= 5:
        recommendations.append(
            "Reprioritize backlog tasks."
        )

    if in_progress >= 8:
        recommendations.append(
            "Reduce parallel execution to avoid overload."
        )

    if productivity < 40:
        recommendations.append(
            "Increase follow-up frequency with owners."
        )

    # ---------------- EXECUTIVE SUMMARY ----------------
    summary = f"""
Overall project delivery is currently at {productivity}% productivity.
{completed} tasks have been completed successfully.
{in_progress} tasks are actively progressing.
{blocked} tasks are blocked and require monitoring.
Current project risk level is {risk_level}.
Top contributor is {top_owner}.
"""

    return {
        "kpis": {
            "total": total,
            "completed": completed,
            "yet_to_start": yet_to_start,
            "in_progress": in_progress,
            "blocked": blocked,
            "productivity": productivity,
            "top_owner": top_owner,
            "risk": risk_level
        },

        "charts": {
            "status": status_chart,
            "owners": owner_chart
        },

        "summary": summary.strip(),

        "insights": insights,

        "recommendations": recommendations
    }

@app.get("/smart-insights")
def smart_insights(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()

    total = len(tasks)

    pending = [t for t in tasks if t.status == "Yet to Start"]
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
@app.put("/followup-update/{id}")
def update_followup(id: int, db: Session = Depends(get_db)):
    item = db.query(FollowUp).filter(FollowUp.id == id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Follow-up not found")

    # ✅ Update status
    item.status = "Updated"

    # ✅ SET CURRENT TIMESTAMP (ISO format)
    item.last_updated = datetime.utcnow()
    # OPTIONAL: reset days since it's updated
    item.days = 0

    db.commit()
    db.refresh(item)

    return {"message": "Follow-up updated successfully"}

from fastapi import UploadFile, File
import uuid

@app.post("/analyze-doc")
async def analyze_doc(
    file: UploadFile = File(None),
    text: str = ""
):
    try:
        # -------- Extract --------
        if file:
            if file.filename.endswith(".pdf"):
                content = extract_pdf(file.file)
            else:
                content = (await file.read()).decode("utf-8", errors="ignore")
        else:
            content = text

        content = clean_text(content)

        if not content.strip():
            return {"summary": "No readable content found", "similar": []}

        # -------- AI SUMMARY --------
        summary = generate_summary(content)

        # -------- STORE --------
        doc_id = str(abs(hash(content)))
        store_document(doc_id, content)

        # -------- SIMILAR --------
        similar = search_similar(summary)

        return {
            "summary": summary,
            "similar": similar
        }

    except Exception as e:
        return {"summary": f"Error: {str(e)}", "similar": []}
