import os
import json
import re
import streamlit as st
from pypdf import PdfReader
from resumeparser import ats_extractor  # your local file

# Folder to save uploaded PDFs
UPLOAD_PATH = "__DATA__"
os.makedirs(UPLOAD_PATH, exist_ok=True)

st.set_page_config(page_title="ATS Resume Parser", layout="centered")

st.title("📄 ATS Resume Parser")
st.write("Upload your resume (PDF) and extract key details using Groq-powered ATS parser.")

uploaded_file = st.file_uploader("Upload Resume (PDF)", type=["pdf"])

def _read_file_from_path(path):
    reader = PdfReader(path)
    data = ""
    for page_no in range(len(reader.pages)):
        page = reader.pages[page_no]
        text = page.extract_text()
        if text:
            data += text
    return data

def clean_json_response(response_text: str) -> str:
    cleaned = re.sub(r"```(json)?", "", response_text).strip()
    return cleaned

if uploaded_file:
    save_path = os.path.join(UPLOAD_PATH, "file.pdf")
    with open(save_path, "wb") as f:
        f.write(uploaded_file.read())

    st.success("✅ File uploaded successfully!")

    if st.button("Process Resume"):
        with st.spinner("Extracting data... please wait ⏳"):
            raw_text = _read_file_from_path(save_path)
            st.subheader("📄 Raw PDF Text")
            st.text(raw_text[:1000])

            extracted_data = ats_extractor(raw_text)

            cleaned_data = clean_json_response(extracted_data)

        if cleaned_data.strip().startswith("{") and cleaned_data.strip().endswith("}"):
            try:
                extracted_json = json.loads(cleaned_data)
                st.subheader("📊 Parsed Resume Data")
                st.json(extracted_json)
            except json.JSONDecodeError as e:
                st.error(f"❌ JSON parse error: {e}")
        else:
            st.warning("⚠️ Parser did not return JSON. See raw output above.")
