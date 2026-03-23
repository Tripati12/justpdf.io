import os
import uuid
from typing import List
from fastapi import UploadFile
from PIL import Image

TEMP_DIR = "temp"
OUTPUT_DIR = "outputs"

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


def images_to_pdf(files: List[UploadFile]) -> str:
    images = []

    for file in files:
        temp_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}_{file.filename}")

        with open(temp_path, "wb") as f:
            f.write(file.file.read())

        img = Image.open(temp_path).convert("RGB")
        images.append(img)

    output_path = os.path.join(
        OUTPUT_DIR, f"images_to_pdf_{uuid.uuid4()}.pdf"
    )

    images[0].save(
        output_path,
        save_all=True,
        append_images=images[1:]
    )

    return output_path
