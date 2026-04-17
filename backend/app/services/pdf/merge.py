from PyPDF2 import PdfReader, PdfWriter
import uuid
import os

TEMP_DIR = "temp"
OUTPUT_DIR = "outputs"

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


def merge_pdfs(file_paths: list[str]) -> str:
    writer = PdfWriter()

    for path in file_paths:
        try:
            reader = PdfReader(path)

            for page in reader.pages:
                writer.add_page(page)

        except Exception as e:
            print(f"❌ Skipping broken file: {path} | Error: {e}")
            continue  # 🚀 skip bad file

    output_path = f"outputs/{uuid.uuid4()}.pdf"

    with open(output_path, "wb") as f:
        writer.write(f)

    return output_path