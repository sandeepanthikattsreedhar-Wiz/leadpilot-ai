import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_summary(text):
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # ✅ latest working model
            messages=[
                {
                    "role": "system",
                    "content": """You are a senior IT project consultant.

Analyze the document and provide:

1. Executive Summary (clear, structured)
2. Key Risks
3. Dependencies
4. Suggested Actions

Keep it clean, bullet-based and professional."""
                },
                {
                    "role": "user",
                    "content": text[:6000]  # limit input
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        print("AI ERROR:", e)
        return "AI summary failed. Please check API."