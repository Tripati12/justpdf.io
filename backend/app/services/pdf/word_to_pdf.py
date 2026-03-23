import os
import uuid
import subprocess
from fastapi import UploadFile

TEMP_DIR = "temp"
OUTPUT_DIR = "outputs"

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


def word_to_pdf(file: UploadFile) -> str:
    input_path = os.path.join(
        TEMP_DIR, f"{uuid.uuid4()}_{file.filename}"
    )

    with open(input_path, "wb") as f:
        f.write(file.file.read())

    subprocess.run([
        "soffice",
        "--headless",
        "--convert-to",
        "pdf",
        "--outdir",
        OUTPUT_DIR,
        input_path
    ], check=True)

    pdf_name = os.path.splitext(os.path.basename(input_path))[0] + ".pdf"
    return os.path.join(OUTPUT_DIR, pdf_name)
