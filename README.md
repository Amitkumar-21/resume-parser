# 📄 ATS Resume Parser

An AI-powered Applicant Tracking System (ATS) Resume Parser built with **Streamlit**, **PyPDF**, and the **Groq API**. It extracts unstructured text from PDF resumes and converts candidate profile details into structured JSON format.

---

## ✨ Features

- **PDF Text Extraction**: Uses `pypdf` to parse raw text from uploaded PDF resumes.
- **AI-Powered Information Extraction**: Leverages Groq's fast LLM inference to extract:
  - Full Name & Contact Info (Email, LinkedIn, GitHub)
  - Employment History & Experience
  - Technical & Soft Skills
- **Structured JSON Output**: Displays formatted JSON for easy integration with downstream ATS or database systems.
- **Interactive UI**: Simple and intuitive web interface built using Streamlit.

---

## 📁 Project Structure

```text
resume-parser/
├── app.py           # Streamlit web application interface
├── resumeparser.py  # Groq API prompt and parsing logic
├── requirements.txt # Project dependencies
├── Procfile         # Deployment configuration
└── .gitignore       # Git ignore rules
```

---

## ⚡ Quick Start

### 1. Prerequisites
Ensure you have **Python 3.8+** installed and obtain a free API key from [Groq Console](https://console.groq.com/).

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/Amitkumar-21/resume-parser.git
cd resume-parser

# Create and activate virtual environment (optional)
python -m venv parse
# On Windows: parse\Scripts\activate
# On macOS/Linux: source parse/bin/activate

# Install required packages
pip install streamlit pypdf groq
```

### 3. Set API Key & Run Application

Set your Groq API key in your terminal environment:

**Windows (PowerShell):**
```powershell
$env:GROQ_API_KEY="your_groq_api_key_here"
```

**macOS / Linux:**
```bash
export GROQ_API_KEY="your_groq_api_key_here"
```

Start the Streamlit app:
```bash
streamlit run app.py
```

---

## 🛠️ Tech Stack

- **Frontend / UI**: [Streamlit](https://streamlit.io/)
- **PDF Processing**: [PyPDF](https://pypdf.readthedocs.io/)
- **LLM Provider**: [Groq API](https://groq.com/)
- **Language**: Python 3
