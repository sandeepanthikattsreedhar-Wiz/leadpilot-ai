import requests

BASE_URL = "http://127.0.0.1:8000"

# ------------------------
# TEST HOME
# ------------------------
def test_home():
    res = requests.get(f"{BASE_URL}/")
    assert res.status_code == 200
    assert "LeadPilot" in res.text


# ------------------------
# TEST CREATE TASK
# ------------------------
def test_create_task():
    payload = {
        "task_title": "Auto Test",
        "task_name": "Testing API",
        "assigned_to": "Gokul",
        "start_date": "2026-05-01",
        "end_date": "2026-05-02",
        "remarks": "pytest run",
        "status": "Pending"
    }

    res = requests.post(f"{BASE_URL}/tasks", json=payload)
    assert res.status_code == 200

    data = res.json()
    assert data["task_title"] == "Auto Test"

    global TASK_ID
    TASK_ID = data["id"]


# ------------------------
# TEST GET TASKS
# ------------------------
def test_get_tasks():
    res = requests.get(f"{BASE_URL}/tasks")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


# ------------------------
# TEST UPDATE TASK
# ------------------------
def test_update_task():
    payload = {
        "task_title": "Updated Task",
        "task_name": "Updated Name",
        "assigned_to": "Divya",
        "start_date": "2026-05-01",
        "end_date": "2026-05-03",
        "remarks": "updated",
        "status": "In Progress"
    }

    res = requests.put(f"{BASE_URL}/tasks/{TASK_ID}", json=payload)
    assert res.status_code == 200
    assert res.json()["task_title"] == "Updated Task"


# ------------------------
# TEST DASHBOARD
# ------------------------
def test_dashboard():
    res = requests.get(f"{BASE_URL}/dashboard-full")
    assert res.status_code == 200
    data = res.json()
    assert "stats" in data


# ------------------------
# TEST CREATE MEETING
# ------------------------
def test_create_meeting():
    payload = {
        "title": "Auto Meeting",
        "time": "10:00 AM",
        "owner": "Sandeep",
        "agenda": "Testing meeting"
    }

    res = requests.post(f"{BASE_URL}/meetings", json=payload)
    assert res.status_code == 200

    global MEETING_ID
    MEETING_ID = res.json()["id"]


# ------------------------
# TEST SAVE MEETING NOTES
# ------------------------
def test_save_notes():
    payload = {
        "notes": "Automated test notes"
    }

    res = requests.post(
        f"{BASE_URL}/meeting-log/{MEETING_ID}",
        json=payload
    )

    assert res.status_code == 200


# ------------------------
# TEST GET MEETINGS
# ------------------------
def test_get_meetings():
    res = requests.get(f"{BASE_URL}/meetings")
    assert res.status_code == 200

    data = res.json()
    assert isinstance(data, list)


# ------------------------
# TEST SCHEDULER
# ------------------------
def test_scheduler():
    res = requests.get(f"{BASE_URL}/scheduler-data")
    assert res.status_code == 200


# ------------------------
# TEST PERFORMANCE
# ------------------------
def test_performance():
    res = requests.get(f"{BASE_URL}/performance-data")
    assert res.status_code == 200


# ------------------------
# TEST FOLLOW-UP
# ------------------------
def test_followup():
    res = requests.get(f"{BASE_URL}/followup-data")
    assert res.status_code == 200


# ------------------------
# TEST CAPACITY
# ------------------------
def test_capacity():
    res = requests.get(f"{BASE_URL}/capacity-data")
    assert res.status_code == 200


# ------------------------
# TEST REPORTS
# ------------------------
def test_reports():
    res = requests.get(f"{BASE_URL}/reports-data")
    assert res.status_code == 200

def test_invalid_task():
    res = requests.post(f"{BASE_URL}/tasks", json={})
    assert res.status_code == 422

def test_empty_tasks():
    res = requests.get(f"{BASE_URL}/tasks")
    assert res.status_code == 200

def test_delete_task():
    res = requests.delete(f"{BASE_URL}/tasks/{TASK_ID}")
    assert res.status_code == 200