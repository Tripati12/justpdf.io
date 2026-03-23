import os
import uuid
from fastapi import UploadFile
from PyPDF2 import PdfReader, PdfWriter

TEMP_DIR = "temp"
OUTPUT_DIR = "outputs"

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


def reorder_pages(file: UploadFile, pages: str):
    file.file.seek(0)

    input_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}_{file.filename}")
    with open(input_path, "wb") as f:
        f.write(file.file.read())

    reader = PdfReader(input_path)
    writer = PdfWriter()

    total_pages = len(reader.pages)

    # Convert "3,1" -> [2,0]
    new_order = [int(p.strip()) - 1 for p in pages.split(",")]

    # Keep remaining pages automatically
    remaining = [i for i in range(total_pages) if i not in new_order]

    final_order = new_order + remaining

    for i in final_order:
        writer.add_page(reader.pages[i])

    output_path = os.path.join(OUTPUT_DIR, f"{uuid.uuid4()}_reordered.pdf")

    with open(output_path, "wb") as f:
        writer.write(f)

    return output_path
