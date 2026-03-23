from pypdf import PdfReader, PdfWriter
import zipfile
import uuid
import os
from fastapi import UploadFile

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def split_pdf(file: UploadFile) -> str:
    job_id = str(uuid.uuid4())
    job_dir = os.path.join(OUTPUT_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)

    pdf_path = os.path.join(job_dir, file.filename)

    with open(pdf_path, "wb") as f:
        f.write(file.file.read())

    reader = PdfReader(pdf_path)

    for i, page in enumerate(reader.pages):
        writer = PdfWriter()
        writer.add_page(page)

        out_path = os.path.join(job_dir, f"page_{i+1}.pdf")
        with open(out_path, "wb") as f:
            writer.write(f)

    zip_path = os.path.join(OUTPUT_DIR, f"{job_id}.zip")
    with zipfile.ZipFile(zip_path, "w") as zipf:
        for file in os.listdir(job_dir):
            zipf.write(os.path.join(job_dir, file), arcname=file)

    return zip_path
