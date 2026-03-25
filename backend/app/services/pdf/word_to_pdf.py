import os
import uuid
import subprocess
from fastapi import UploadFile

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

LIBREOFFICE_PATH = r"C:\Program Files\LibreOffice\program\soffice.exe"

def word_to_pdf(file: UploadFile) -> str:
    job_id = str(uuid.uuid4())
    job_dir = os.path.join(OUTPUT_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)

    input_path = os.path.join(job_dir, file.filename)

    # Save file
    with open(input_path, "wb") as f:
        f.write(file.file.read())

    # Debug
    print("LibreOffice exists:", os.path.exists(LIBREOFFICE_PATH))
    print("Input file exists:", os.path.exists(input_path))

    # Convert
    result = subprocess.run(
        [
            LIBREOFFICE_PATH,
            "--headless",
            "--convert-to",
            "pdf",
            "--outdir",
            job_dir,
            input_path,
        ],
        capture_output=True,
        text=True,
    )

    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)

    pdf_path = os.path.join(
        job_dir,
        os.path.splitext(file.filename)[0] + ".pdf"
    )

    if not os.path.exists(pdf_path):
        raise Exception("PDF conversion failed")

    return pdf_path