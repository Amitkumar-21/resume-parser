import io
import json
import re
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import groq
from pypdf import PdfReader
from resumeparser import ats_extractor

app = FastAPI(title="ATS Resume Parser API", version="1.0.0")

# Enable CORS for local development and deployed Vercel frontend
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://resume-parser-react.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def make_error_response(status_code: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "error": {
                "code": code,
                "message": message
            }
        }
    )


def extract_pdf_content(file_bytes: bytes) -> str:
    """
    Extracts visible text and embedded URI hyperlink annotations from PDF bytes.
    """
    try:
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
    except Exception:
        raise ValueError("INVALID_PDF")


@app.get("/")
def read_root():
    return {"message": "ATS Resume Parser API is running"}


@app.post("/api/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Accepts a PDF resume file, extracts text + hyperlinks, and returns parsed candidate JSON.
    """
    if not file.filename.lower().endswith(".pdf"):
        return make_error_response(
            400,
            "INVALID_PDF",
            "We couldn't read this PDF. Please upload a valid, text-based resume PDF."
        )

    try:
        contents = await file.read()
    except Exception:
        return make_error_response(
            400,
            "INVALID_PDF",
            "We couldn't read this PDF. Please upload a valid, text-based resume PDF."
        )

    try:
        raw_text = extract_pdf_content(contents)
    except ValueError:
        return make_error_response(
            400,
            "INVALID_PDF",
            "We couldn't read this PDF. Please upload a valid, text-based resume PDF."
        )

    if not raw_text.strip():
        return make_error_response(
            400,
            "EMPTY_RESUME",
            "We couldn't find enough readable content in this resume. Please try another PDF."
        )

    try:
        extracted_raw = ats_extractor(raw_text)
    except ValueError:
        return make_error_response(
            500,
            "AI_CONFIGURATION_ERROR",
            "The AI service is currently unavailable. Please try again later."
        )
    except groq.AuthenticationError:
        return make_error_response(
            500,
            "AI_CONFIGURATION_ERROR",
            "The AI service is currently unavailable. Please try again later."
        )
    except groq.RateLimitError as e:
        err_msg = str(e).lower()
        if "quota" in err_msg or "exceeded" in err_msg or "billing" in err_msg:
            return make_error_response(
                429,
                "AI_QUOTA_EXCEEDED",
                "AI processing is temporarily unavailable because the current usage limit has been reached. Please try again later."
            )
        return make_error_response(
            429,
            "AI_RATE_LIMITED",
            "The AI service is temporarily busy. Please try again shortly."
        )
    except groq.APIStatusError as e:
        if e.status_code == 429:
            err_msg = str(e).lower()
            if "quota" in err_msg or "exceeded" in err_msg or "billing" in err_msg:
                return make_error_response(
                    429,
                    "AI_QUOTA_EXCEEDED",
                    "AI processing is temporarily unavailable because the current usage limit has been reached. Please try again later."
                )
            return make_error_response(
                429,
                "AI_RATE_LIMITED",
                "The AI service is temporarily busy. Please try again shortly."
            )
        elif e.status_code in (401, 403):
            return make_error_response(
                500,
                "AI_CONFIGURATION_ERROR",
                "The AI service is currently unavailable. Please try again later."
            )
        else:
            return make_error_response(
                500,
                "INTERNAL_SERVER_ERROR",
                "Something went wrong while processing your resume. Please try again."
            )
    except Exception:
        return make_error_response(
            500,
            "INTERNAL_SERVER_ERROR",
            "Something went wrong while processing your resume. Please try again."
        )

    try:
        cleaned = re.sub(r"```(json)?", "", extracted_raw).strip()
        parsed_json = json.loads(cleaned)
        return parsed_json
    except json.JSONDecodeError:
        return make_error_response(
            500,
            "INVALID_LLM_RESPONSE",
            "We couldn't process the resume correctly. Please try again."
        )

