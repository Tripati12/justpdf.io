import os
import uuid
import subprocess
from fastapi import UploadFile

TEMP_DIR = "temp"
OUTPUT_DIR = "outputs"

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

PDF_QUALITIES = ["screen", "ebook", "printer", "prepress"]


def auto_compress_pdf(file: UploadFile) -> str:
    input_path = os.path.join(
        TEMP_DIR, f"{uuid.uuid4()}_{file.filename}"
    )

    with open(input_path, "wb") as f:
        f.write(file.file.read())

    original_size = os.path.getsize(input_path)

    best_path = None
    best_size = original_size

    for quality in PDF_QUALITIES:
        output_path = os.path.join(
            OUTPUT_DIR, f"{quality}_{uuid.uuid4()}.pdf"
        )

        cmd = [
            "gswin64c",
            "-sDEVICE=pdfwrite",
            f"-dPDFSETTINGS=/{quality}",
            "-dNOPAUSE",
            "-dQUIET",
            "-dBATCH",
            f"-sOutputFile={output_path}",
            input_path,
        ]

        subprocess.run(cmd, check=True)

        size = os.path.getsize(output_path)

        # Accept if at least 20% smaller
        if size < best_size and size < original_size * 0.8:
            best_size = size
            best_path = output_path

    # Fallback to ebook if nothing matched
    if not best_path:
        fallback_path = os.path.join(
            OUTPUT_DIR, f"ebook_{uuid.uuid4()}.pdf"
        )

        subprocess.run([
            "gswin64c",
            "-sDEVICE=pdfwrite",
            "-dPDFSETTINGS=/ebook",
            "-dNOPAUSE",
            "-dQUIET",
            "-dBATCH",
            f"-sOutputFile={fallback_path}",
            input_path,
        ], check=True)

        return fallback_path

    return best_path
