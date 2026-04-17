import os
import uuid
import subprocess
from fastapi import UploadFile

OUTPUT_DIR = "app/outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

LIBREOFFICE_PATH = "soffice"

def word_to_pdf(input_path: str, output_path: str) -> str:
    print("Using LibreOffice:", LIBREOFFICE_PATH)
    output_dir = os.path.dirname(output_path)

    os.makedirs(output_dir, exist_ok=True)

    # Run LibreOffice
    result = subprocess.run(
        [
            LIBREOFFICE_PATH,
            "--headless",
            "--convert-to",
            "pdf",
            "--outdir",
            output_dir,
            input_path,
        ],
        capture_output=True,
        text=True
    )

    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)

    # LibreOffice creates file with same name
    generated_pdf = os.path.join(
        output_dir,
        os.path.splitext(os.path.basename(input_path))[0] + ".pdf"
    )

    # 🔴 CRITICAL CHECK
    if not os.path.exists(generated_pdf):
        raise Exception("❌ PDF not generated")

    # Rename to your desired output_path
    os.rename(generated_pdf, output_path)

    return output_path