import os
import uuid
from fastapi import UploadFile
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch

TEMP_DIR = "temp"
OUTPUT_DIR = "outputs"

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


def add_watermark(
    file: UploadFile,
    text: str,
    opacity: float = 0.3,
    font_size: int = 40,
    rotation: int = 45,
):
    file.file.seek(0)

    input_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}_{file.filename}")
    with open(input_path, "wb") as f:
        f.write(file.file.read())

    reader = PdfReader(input_path)
    writer = PdfWriter()

    watermark_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}_watermark.pdf")

    # Create watermark PDF
    c = canvas.Canvas(watermark_path, pagesize=letter)
    c.setFont("Helvetica", font_size)

    # Set opacity
    c.setFillColor(Color(0, 0, 0, alpha=opacity))

    width, height = letter
    c.saveState()
    c.translate(width / 2, height / 2)
    c.rotate(rotation)
    c.drawCentredString(0, 0, text)
    c.restoreState()
    c.save()

    watermark_reader = PdfReader(watermark_path)
    watermark_page = watermark_reader.pages[0]

    for page in reader.pages:
        page.merge_page(watermark_page)
        writer.add_page(page)

    output_filename = f"{uuid.uuid4()}_watermarked.pdf"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    with open(output_path, "wb") as f:
        writer.write(f)

    return output_path
