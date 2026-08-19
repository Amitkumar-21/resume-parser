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
    You are an AI bot designed to act as a professional for parsing resumes. 
    You are given a resume and your job is to extract the following information:
    1. Full name
    2. Email ID
    3. GitHub portfolio
    4. LinkedIn ID
    5. Employment details
    6. Technical skills
    7. Soft skills

    Give the extracted information in JSON format only.
    '''

    groq_client = Groq(api_key=api_key)

    response = groq_client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": resume_data}
        ],
        temperature=0.0,
        max_tokens=1500
    )

    data = response.choices[0].message.content
    return data
