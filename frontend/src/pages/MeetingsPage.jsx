import { useEffect, useState } from "react";
import MeetingForm from "../components/MeetingForm";
import MeetingList from "../components/MeetingList";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("meetings");
    if (saved) setMeetings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("meetings", JSON.stringify(meetings));
  }, [meetings]);

  const addMeeting = (meeting) =>
    setMeetings([meeting, ...meetings]);

  const completeMeeting = (id) => {
    setMeetings(
      meetings.map((m) =>
        m.id === id ? { ...m, status: "Completed" } : m
      )
    );
  };

  const deleteMeeting = (id) => {
    setMeetings(meetings.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <MeetingForm addMeeting={addMeeting} />
      <MeetingList
        meetings={meetings}
        completeMeeting={completeMeeting}
        deleteMeeting={deleteMeeting}
      />
    </div>
  );
}