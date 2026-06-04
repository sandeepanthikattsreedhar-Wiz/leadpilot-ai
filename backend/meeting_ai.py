import whisper
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

model = whisper.load_model("base")


# -----------------------------
# TRANSCRIBE AUDIO
# -----------------------------
def transcribe_audio(file_path):
    result = model.transcribe(file_path)

    return result["text"]


# -----------------------------
# GENERATE AI SUMMARY
# -----------------------------
def generate_meeting_summary(transcript):

    prompt = f"""
You are a senior delivery manager.

Analyze this meeting transcript.

Generate:

1. Executive Summary
2. Key Discussion Points
3. Risks
4. Decisions Taken
5. Action Items
6. Client Concerns
7. Delivery Impact
8. Next Steps

Transcript:
{transcript}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content