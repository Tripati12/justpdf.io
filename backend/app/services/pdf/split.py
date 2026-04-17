print('CORRECT SPLIT FILE LOADED')
import os
import uuid
import zipfile
from typing import List
from PyPDF2 import PdfReader, PdfWriter

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def split_pdf(file_path: str, ranges: str):
    reader = PdfReader(file_path)

    selected_pages = parse_ranges(ranges)
    total_pages = len(reader.pages)

    output_files = []

    base_name = os.path.splitext(os.path.basename(file_path))[0]

    for page_num in selected_pages:
        if page_num < 1 or page_num > total_pages:
            continue  # skip invalid pages

        writer = PdfWriter()
        writer.add_page(reader.pages[page_num - 1])

        output_path = os.path.join(
            OUTPUT_DIR,
            f"page_{page_num}.pdf"
        )

        with open(output_path, "wb") as f:
            writer.write(f)

        output_files.append(output_path)

    return output_files

def parse_ranges(ranges: str) -> list[int]:
    pages = set()

    for part in ranges.split(","):
        if "-" in part:
            start, end = map(int, part.split("-"))
            pages.update(range(start, end + 1))
        else:
            pages.add(int(part))

    return sorted(pages)

# ✅ PASTE HERE (same file, below split_pdf)
def zip_files(file_paths: List[str]) -> str:
    zip_path = os.path.join(OUTPUT_DIR, f"{uuid.uuid4()}.zip")

    with zipfile.ZipFile(zip_path, "w") as zipf:
        for file in file_paths:
            zipf.write(file, os.path.basename(file))

    return zip_path