import os
import uuid
from fastapi import UploadFile
from pdf2docx import Converter

TEMP_DIR = "temp"
OUTPUT_DIR = "outputs"

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


def pdf_to_word(file: UploadFile) -> str:
    input_path = os.path.join(
        TEMP_DIR, f"{uuid.uuid4()}_{file.filename}"
    )

    with open(input_path, "wb") as f:
        f.write(file.file.read())

    output_path = os.path.join(
        OUTPUT_DIR, f"{uuid.uuid4()}.docx"
    )

    cv = Converter(input_path)
    cv.convert(output_path)
    cv.close()

    return output_path
