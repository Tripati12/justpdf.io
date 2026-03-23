import os
import uuid
import subprocess
from fastapi import UploadFile

TEMP_DIR = "temp"
OUTPUT_DIR = "outputs"

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


# Compression profiles:
# screen  → smallest size, lowest quality
# ebook   → good balance (RECOMMENDED)
# printer → high quality
# prepress → best quality
PDF_QUALITY = "ebook"


def compress_pdf(file: UploadFile) -> str:
    input_path = os.path.join(
        TEMP_DIR, f"{uuid.uuid4()}_{file.filename}"
    )
    output_path = os.path.join(
        OUTPUT_DIR, f"compressed_{uuid.uuid4()}.pdf"
    )

    # Save uploaded file
    with open(input_path, "wb") as f:
        f.write(file.file.read())

    # Ghostscript command
    command = [
        "gswin64c",
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        f"-dPDFSETTINGS=/{PDF_QUALITY}",
        "-dNOPAUSE",
        "-dQUIET",
        "-dBATCH",
        f"-sOutputFile={output_path}",
        input_path,
    ]

    subprocess.run(command, check=True)

    return output_path
