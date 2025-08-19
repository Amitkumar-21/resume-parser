from groq import Groq
import yaml

api_key = None
CONFIG_PATH = r"config.yaml"

with open(CONFIG_PATH) as file:
    data = yaml.load(file, Loader=yaml.FullLoader)
    api_key = data['GROQ_API_KEY']

def ats_extractor(resume_data):
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
        model="llama3-70b-8192",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": resume_data}
        ],
        temperature=0.0,
        max_tokens=1500
    )

    data = response.choices[0].message.content
    return data
