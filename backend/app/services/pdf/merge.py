import os
import uuid
from typing import List
from fastapi import UploadFile
from pypdf import PdfWriter, PdfReader

TEMP_DIR = "temp"
OUTPUT_DIR = "outputs"

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

def merge_pdfs(files: List[UploadFile]) -> str:
    writer = PdfWriter()

    for file in files:
        # 🔑 CRITICAL FIX
        file.file.seek(0)

        temp_path = os.path.join(
            TEMP_DIR, f"{uuid.uuid4()}_{file.filename}"
        )

        with open(temp_path, "wb") as f:
            f.write(file.file.read())

        reader = PdfReader(temp_path)
        for page in reader.pages:
            writer.add_page(page)

    output_path = os.path.join(
        OUTPUT_DIR, f"{uuid.uuid4()}.pdf"
    )

    with open(output_path, "wb") as f:
        writer.write(f)

    return output_path

