import os
import uuid
from fastapi import UploadFile
from pypdf import PdfReader, PdfWriter

TEMP_DIR = "temp"
OUTPUT_DIR = "outputs"

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


def parse_pages(pages_str: str, total_pages: int):
    pages = set()

    for part in pages_str.split(","):
        part = part.strip()

        if "-" in part:
            start, end = map(int, part.split("-"))
            for p in range(start, end + 1):
                if 1 <= p <= total_pages:
                    pages.add(p - 1)
        else:
            if part.isdigit():
                p = int(part)
                if 1 <= p <= total_pages:
                    pages.add(p - 1)

    return pages


def delete_pages(file: UploadFile, pages: str):
    file.file.seek(0)

    input_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}_{file.filename}")

    with open(input_path, "wb") as f:
        f.write(file.file.read())

    reader = PdfReader(input_path)
    writer = PdfWriter()

    total_pages = len(reader.pages)
    delete_set = parse_pages(pages, total_pages)

    for i in range(total_pages):
        if i not in delete_set:
            writer.add_page(reader.pages[i])

    output_path = os.path.join(
        OUTPUT_DIR, f"{uuid.uuid4()}_deleted.pdf"
    )

    with open(output_path, "wb") as f:
        writer.write(f)

    return output_path
