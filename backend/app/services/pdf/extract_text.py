import os
import uuid
from fastapi import UploadFile
from pypdf import PdfReader

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def extract_text_from_pdf(file: UploadFile) -> str:
    output_path = os.path.join(
        OUTPUT_DIR,
        f"{uuid.uuid4()}_extracted.txt"
    )

    reader = PdfReader(file.file)

    with open(output_path, "w", encoding="utf-8") as f:
        for page in reader.pages:
            text = page.extract_text()
            if text:
                f.write(text + "\n")

    file.file.seek(0)
    return output_path

