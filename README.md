# 📄 ATS Resume Parser (React + FastAPI + Groq)

An AI-powered Applicant Tracking System (ATS) Resume Parser featuring a modern **React + Vite** frontend, a **FastAPI** backend, and fast LLM inference powered by the **Groq API**.

It extracts unstructured text and hidden PDF hyperlink annotations from candidate resumes and parses them into structured JSON format.

---

## ✨ Features

- **Embedded Hyperlink Extraction**: Extracts both visible text AND embedded PDF link annotations (`/Annots` -> `/URI`) using `pypdf`, ensuring hidden **LinkedIn**, **GitHub**, and **Portfolio** URLs are captured accurately.
- **FastAPI Backend Service**: Exposes `POST /api/parse-resume` with CORS middleware configured for full client-server decoupling.
- **Modern React + Vite Frontend**:
  - Drag-and-drop PDF resume upload dropzone.
  - Real-time loading indicator and error handling.
  - Comprehensive Candidate Dashboard displaying **Name**, **Email** (mailto), **Phone**, **LinkedIn**, **GitHub**, **Portfolio URLs**, **Technical Skills pills**, **Achievements & Honors**, **Education**, and **Projects**.
  - **Client-Side JSON Export**: One-click `Download JSON` button generates a formatted `<Candidate_Name>_resume.json` file directly on the frontend using browser Blobs without additional API calls.
- **Structured JSON Engine**: Uses Groq API with enforced JSON output mode (`response_format={"type": "json_object"}`) and an extended token budget (`4000` tokens) to extract all candidate sections without omission.
- **Legacy Streamlit Support**: Preserves the original Streamlit interface ([`app.py`](app.py)).

---

## 📁 Project Structure

```text
resume-parser/
├── api.py           # FastAPI backend server (POST /api/parse-resume)
├── resumeparser.py  # PDF text & link extraction + Groq API parsing logic
├── app.py           # Legacy Streamlit UI interface
├── requirements.txt # Python dependencies (FastAPI, PyPDF, Groq, Streamlit)
├── frontend/        # React + Vite frontend application
│   ├── src/
│   │   ├── App.jsx  # Main Candidate Dashboard & Upload Dropzone
│   │   ├── index.css# Tailwind CSS styling & dark theme
│   │   └── main.jsx
│   ├── package.json # Frontend dependencies (React, Vite, Tailwind, Lucide)
│   └── vite.config.js
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Python 3.8+**
- **Node.js 18+** & `npm`
- Free API key from [Groq Console](https://console.groq.com/)

---

### 2. Backend Setup (FastAPI)

1. **Clone Repository & Activate Environment**:
   ```bash
   git clone https://github.com/Amitkumar-21/resume-parser.git
   cd resume-parser

   # Create virtual environment
   python -m venv parse

   # Activate virtual environment
   # On Windows (PowerShell):
   parse\Scripts\activate
   # On macOS/Linux:
   source parse/bin/activate
   ```

2. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set Groq API Key**:
   - **Windows (PowerShell)**:
     ```powershell
     $env:GROQ_API_KEY="your_groq_api_key_here"
     ```
   - **macOS / Linux**:
     ```bash
     export GROQ_API_KEY="your_groq_api_key_here"
     ```

4. **Start FastAPI Backend**:
   ```bash
   uvicorn api:app --reload --port 8000
   ```
   *FastAPI server running at: `http://localhost:8000`*

---

### 3. Frontend Setup (React + Vite)

1. **Open a new terminal, navigate to `frontend` and install packages**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Vite Dev Server**:
   ```bash
   npm run dev
   ```
   *React application running at: `http://localhost:5173`*

---

### 4. (Optional) Run Streamlit App

If you prefer the original Streamlit interface:
```bash
streamlit run app.py
```

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **Backend API**: [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/)
- **PDF Extraction**: [PyPDF](https://pypdf.readthedocs.io/) (Text & URI Annotations)
- **LLM Provider**: [Groq API](https://groq.com/) (`openai/gpt-oss-120b` / Llama Models)
- **Language**: Python 3, JavaScript (ES6+)
