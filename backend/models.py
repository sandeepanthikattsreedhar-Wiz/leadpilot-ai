from sqlalchemy import Column, Integer, String
from database import Base

class TaskDB(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    status = Column(String, default="Pending")