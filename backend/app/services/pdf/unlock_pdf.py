import os
import uuid
from fastapi import UploadFile
from pypdf import PdfReader, PdfWriter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
TEMP_DIR = os.path.join(BASE_DIR, "temp")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


def unlock_pdf(file: UploadFile, password: str) -> str:
    file.file.seek(0)

    unique_id = str(uuid.uuid4())
    input_path = os.path.join(TEMP_DIR, f"{unique_id}_{file.filename}")
    output_path = os.path.join(OUTPUT_DIR, f"{unique_id}_unlocked.pdf")

    # Save uploaded file
    with open(input_path, "wb") as f:
        f.write(file.file.read())

    reader = PdfReader(input_path)

    # Try decrypt
    if reader.is_encrypted:
        if reader.decrypt(password) == 0:
            raise Exception("Wrong password")

    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    with open(output_path, "wb") as f:
        writer.write(f)

    return output_path
