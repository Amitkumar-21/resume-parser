import io
import json
import re
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from resumeparser import ats_extractor

app = FastAPI(title="ATS Resume Parser API", version="1.0.0")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_pdf_content(file_bytes: bytes) -> str:
    """
    Extracts visible text and embedded URI hyperlink annotations from PDF bytes.
    """
    reader = PdfReader(io.BytesIO(file_bytes))
    data = ""
    urls = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            data += text + "\n"
        if "/Annots" in page:
            for annot in page["/Annots"]:
                obj = annot.get_object()
                if "/A" in obj and "/URI" in obj["/A"]:
                    uri = obj["/A"]["/URI"]
                    if uri not in urls:
                        urls.append(uri)
    if urls:
        data += "\n\nExtracted Links/URLs:\n" + "\n".join(urls) + "\n"
    return data


@app.get("/")
def read_root():
    return {"message": "ATS Resume Parser API is running"}


@app.post("/api/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Accepts a PDF resume file, extracts text + hyperlinks, and returns parsed candidate JSON.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        contents = await file.read()
        raw_text = extract_pdf_content(contents)
        if not raw_text.strip():
            raise HTTPException(
                status_code=400, detail="Could not extract text from the PDF file."
            )

        extracted_raw = ats_extractor(raw_text)

        # Clean JSON delimiters if returned
        cleaned = re.sub(r"```(json)?", "", extracted_raw).strip()
        parsed_json = json.loads(cleaned)
        return parsed_json

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500, detail=f"LLM returned invalid JSON: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error parsing resume: {str(e)}"
        )
