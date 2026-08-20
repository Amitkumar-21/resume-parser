import os
from groq import Groq

# Get API key from environment variable
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("Please set the GROQ_API_KEY environment variable.")


def ats_extractor(resume_data: str) -> str:
    """
    Extracts resume information using Groq API and returns JSON string.
    """
    prompt = '''
    You are an expert AI bot designed to parse resumes for an Applicant Tracking System (ATS). 
    Extract candidate information from the provided resume text and return a JSON object with EXACTLY the following structure:
    {
      "full_name": string or null,
      "email": string or null,
      "phone": string or null,
      "github_url": string or null,
      "linkedin_url": string or null,
      "portfolio_urls": list of strings,
      "employment_details": list of objects or null,
      "education": list of objects or null,
      "technical_skills": list of strings,
      "soft_skills": list of strings,
      "projects": list of objects,
      "achievements": list of objects with title, description, and date (or [] if none)
    }

    Rules:
    - Extract full URLs for github_url (e.g., https://github.com/username) and linkedin_url (e.g., https://www.linkedin.com/in/username). Look closely at any Extracted Links/URLs section or inline text.
    - Extract ALL projects mentioned in the resume under "projects". Do not skip or omit any project.
    - Extract ALL achievements, honors, awards, hackathon finalist positions/rankings, competitive programming stats, and recognitions under "achievements". Format each item as {"title": "...", "description": "...", "date": "..."} (use null or "" for missing dates/descriptions). Return [] if no achievements are present.
    - Do NOT classify general work experience, education, projects, certifications, or skills as achievements unless explicitly presented as achievements in the resume.
    - Preserve original wording and details from the resume as much as possible. Do not hallucinate achievements or invent dates/ranks.
    - If a field is missing or not present in the resume, set its value to null (or [] for lists).
    - Return ONLY valid JSON matching this schema.
    '''

    groq_client = Groq(api_key=api_key)

    response = groq_client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": resume_data}
        ],
        response_format={"type": "json_object"},
        temperature=0.0,
        max_tokens=4000
    )

    data = response.choices[0].message.content
    return data
