import os
import uuid
from typing import List
from fastapi import UploadFile
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, LETTER
from reportlab.lib.utils import ImageReader
from PIL import Image

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)


PAGE_SIZES = {
    "A4": A4,
    "LETTER": LETTER,
}


def images_to_pdf(
    files: List[UploadFile],
    page_size: str = "A4",
    margin: int = 20,
    orientation: str = "portrait",
) -> str:

    output_filename = f"{uuid.uuid4()}.pdf"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    if page_size.upper() in PAGE_SIZES:
        width, height = PAGE_SIZES[page_size.upper()]
    else:
        width, height = A4

    if orientation == "landscape":
        width, height = height, width

    c = canvas.Canvas(output_path, pagesize=(width, height))

    for file in files:
        file.file.seek(0)
        image = Image.open(file.file)

        img_width, img_height = image.size

        max_width = width - 2 * margin
        max_height = height - 2 * margin

        ratio = min(max_width / img_width, max_height / img_height)

        new_width = img_width * ratio
        new_height = img_height * ratio

        x = (width - new_width) / 2
        y = (height - new_height) / 2

        c.drawImage(
            ImageReader(image),
            x,
            y,
            new_width,
            new_height
        )

        c.showPage()

    c.save()

    return output_path
