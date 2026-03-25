from pypdf import PdfReader, PdfWriter
import zipfile
import uuid
import os
from fastapi import UploadFile

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def split_pdf(file: UploadFile) -> str:
    # Create unique job folder
    job_id = str(uuid.uuid4())
    job_dir = os.path.join(OUTPUT_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)

    pdf_path = os.path.join(job_dir, file.filename)

    # ✅ Save uploaded file safely
    pdf_bytes = file.file.read()

    with open(pdf_path, "wb") as f:
        f.write(pdf_bytes)

    # ✅ Reset pointer (important)
    file.file.seek(0)

    # ✅ Read PDF
    reader = PdfReader(pdf_path)
    print("Total pages:", len(reader.pages))  # debug

    page_files = []

    # ✅ Split each page
    for i, page in enumerate(reader.pages):
        writer = PdfWriter()
        writer.add_page(page)

        page_filename = f"page_{i+1}.pdf"
        page_path = os.path.join(job_dir, page_filename)

        with open(page_path, "wb") as f:
            writer.write(f)

        print(f"Created: {page_filename}")  # debug
        page_files.append(page_path)

    # ✅ Create ZIP
    zip_path = os.path.join(job_dir, "split_pages.zip")

    with zipfile.ZipFile(zip_path, "w") as zipf:
        for file_path in page_files:
            zipf.write(file_path, os.path.basename(file_path))

    return zip_path