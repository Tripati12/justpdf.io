import os
import uuid
from fastapi import UploadFile
from pdf2image import convert_from_path

OUTPUT_DIR = "outputs"
TEMP_DIR = "temp"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

def pdf_to_jpg(file: UploadFile) -> str:
    file.file.seek(0)

    temp_pdf_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.pdf")

    with open(temp_pdf_path, "wb") as f:
        f.write(file.file.read())

    images = convert_from_path(temp_pdf_path)

    output_folder = os.path.join(OUTPUT_DIR, str(uuid.uuid4()))
    os.makedirs(output_folder, exist_ok=True)

    for i, image in enumerate(images):
        image.save(os.path.join(output_folder, f"page_{i+1}.jpg"), "JPEG")

    return output_folder
