from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import os

from app.services.pdf.merge import merge_pdfs
from app.services.pdf.split import split_pdf

from app.services.pdf.extract_text import extract_text_from_pdf

from app.services.pdf.image_to_pdf import images_to_pdf

from app.services.pdf.compress import compress_pdf

from app.services.pdf.auto_compress import auto_compress_pdf

from app.services.pdf.word_to_pdf import word_to_pdf

from app.services.pdf.excel_to_pdf import excel_to_pdf

from app.services.pdf.pdf_to_word import pdf_to_word

from app.services.pdf.pdf_to_excel_tabula import pdf_to_excel_tabula

import tabula





import pandas as pd
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
from PyPDF2 import PdfReader

router = APIRouter()

from app.services.pdf.pdf_to_jpg import pdf_to_jpg
from fastapi.responses import FileResponse
import zipfile

from app.services.pdf.protect_pdf import protect_pdf
from fastapi import Form
from app.services.pdf.unlock_pdf import unlock_pdf
from fastapi import Form

from app.services.pdf.jpg_to_pdf import images_to_pdf
from typing import List
from fastapi import UploadFile, File, Form
from fastapi.responses import FileResponse

from fastapi import Form
from fastapi.responses import FileResponse
from app.services.pdf.watermark import add_watermark

from app.services.pdf.delete_pages import delete_pages
from app.services.pdf.reorder_pages import reorder_pages
from app.services.pdf.extract_pages import extract_pages



TEMP_DIR = "temp"
OUTPUT_DIR = "outputs"
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

router = APIRouter(prefix="/pdf", tags=["PDF Tools"])

@router.post("/merge")
async def merge_endpoint(files: list[UploadFile] = File(...)):
    output = merge_pdfs(files)

    original_names = [f.filename.replace(".pdf", "") for f in files]
    safe_name = "_".join(original_names[:3])  # limit length
    filename = f"{safe_name}_merged.pdf"

    return FileResponse(
        output,
        filename=filename,
        media_type="application/pdf"
    )


@router.post("/split")
async def split_endpoint(file: UploadFile = File(...)):
    zip_path = split_pdf(file)
    return FileResponse(
        zip_path,
        filename="split_pages.zip",
        media_type="application/zip"
    )


@router.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    pdf_path = os.path.join(TEMP_DIR, file.filename)

    with open(pdf_path, "wb") as f:
        f.write(await file.read())

    extracted_text = ""

    # 1️⃣ Try normal text extraction
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"
    except Exception:
        pass

    # 2️⃣ OCR fallback if no text found
    if not extracted_text.strip():
        images = convert_from_path(pdf_path, dpi=300)
        for img in images:
            extracted_text += pytesseract.image_to_string(img) + "\n"

    # Save text file
    output_path = os.path.join(
        OUTPUT_DIR,
        file.filename.replace(".pdf", ".txt")
    )

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(extracted_text)

    return FileResponse(
        output_path,
        media_type="text/plain",
        filename=os.path.basename(output_path),
    )

@router.post("/images-to-pdf")
async def images_to_pdf_endpoint(
    files: list[UploadFile] = File(...)
):
    output_path = images_to_pdf(files)

    return FileResponse(
        output_path,
        filename="images_to_pdf.pdf",
        media_type="application/pdf"
    )
@router.post("/compress")
async def compress_pdf_endpoint(
    file: UploadFile = File(...)
):
    output_path = compress_pdf(file)

    return FileResponse(
        output_path,
        filename="compressed.pdf",
        media_type="application/pdf"
    )
@router.post("/compress-auto")
async def auto_compress_endpoint(
    file: UploadFile = File(...)
):
    output_path = auto_compress_pdf(file)

    return FileResponse(
        output_path,
        filename="compressed.pdf",
        media_type="application/pdf"
    )
@router.post("/word-to-pdf")
async def word_to_pdf_endpoint(
    file: UploadFile = File(...)
):
    output = word_to_pdf(file)

    return FileResponse(
        output,
        filename="document.pdf",
        media_type="application/pdf"
    )
@router.post("/excel-to-pdf")
async def excel_to_pdf_endpoint(
    file: UploadFile = File(...)
):
    output_path = excel_to_pdf(file)

    return FileResponse(
        output_path,
        filename="spreadsheet.pdf",
        media_type="application/pdf"
    )
@router.post("/pdf-to-word")
async def pdf_to_word_endpoint(
    file: UploadFile = File(...)
):
    output = pdf_to_word(file)

    return FileResponse(
        output,
        filename="document.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )



def extract_tables_with_tabula(pdf_path: str, output_path: str) -> bool:
    try:
     
        tables = tabula.read_pdf(
            pdf_path,
            pages="all",
            multiple_tables=True,
            lattice=True,
            guess=True
        )

        if not tables:
            return False

        with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
            for i, table in enumerate(tables):
                table.to_excel(
                    writer,
                    sheet_name=f"Table_{i+1}",
                    index=False
                )

        return True

    except Exception as e:
        print("Tabula error:", e)
        return False



def ocr_pdf_to_excel(pdf_path: str, output_path: str):
    images = convert_from_path(pdf_path)
    rows = []

    for img in images:
        text = pytesseract.image_to_string(img)
        for line in text.split("\n"):
            if line.strip():
                rows.append([line])

    df = pd.DataFrame(rows, columns=["Extracted Text"])
    df.to_excel(output_path, index=False)


@router.post("/pdf-to-excel")
async def pdf_to_excel(file: UploadFile = File(...)):
    pdf_path = os.path.join(TEMP_DIR, file.filename)
    output_path = os.path.join(
        OUTPUT_DIR, file.filename.replace(".pdf", ".xlsx")
    )

    with open(pdf_path, "wb") as f:
        f.write(await file.read())

    # 1️⃣ Try Tabula
    success = extract_tables_with_tabula(pdf_path, output_path)

    # 2️⃣ OCR fallback
    if not success:
        ocr_pdf_to_excel(pdf_path, output_path)

    return FileResponse(
        output_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=file.filename.replace(".pdf", ".xlsx"),)

@router.post("/pdf-to-jpg")
async def pdf_to_jpg_endpoint(file: UploadFile = File(...)):

    output_folder = pdf_to_jpg(file)

    zip_path = f"{output_folder}.zip"

    with zipfile.ZipFile(zip_path, "w") as zipf:
        for filename in os.listdir(output_folder):
            zipf.write(
                os.path.join(output_folder, filename),
                filename
            )

    return FileResponse(
        zip_path,
        filename="images.zip",
        media_type="application/zip"
    )
@router.post("/protect")
async def protect_pdf_endpoint(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    output_path = protect_pdf(file, password)

    return FileResponse(
        output_path,
        filename="protected.pdf",
        media_type="application/pdf"
    )
from fastapi import HTTPException

@router.post("/unlock")
async def unlock_pdf_endpoint(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    try:
        output_path = unlock_pdf(file, password)

        return FileResponse(
            output_path,
            filename="unlocked.pdf",
            media_type="application/pdf"
        )

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Wrong password or invalid PDF"
        )
@router.post("/jpg-to-pdf")
async def jpg_to_pdf_endpoint(
    files: List[UploadFile] = File(...),
    page_size: str = Form("A4"),
    margin: int = Form(20),
    orientation: str = Form("portrait"),
):
    output = images_to_pdf(files, page_size, margin, orientation)

    return FileResponse(
        output,
        filename="converted.pdf",
        media_type="application/pdf"
    )
@router.post("/watermark")
async def watermark_pdf(
    file: UploadFile,
    text: str = Form(...),
    opacity: float = Form(0.3),
    font_size: int = Form(40),
    rotation: int = Form(45),
):
    output_path = add_watermark(file, text, opacity, font_size, rotation)

    return FileResponse(
        output_path,
        filename="watermarked.pdf",
        media_type="application/pdf",
    )

@router.post("/delete-pages")
async def delete_pages_endpoint(
    file: UploadFile = File(...),
    pages: str = Form(...)
):
    output = delete_pages(file, pages)
    return FileResponse(output, filename="deleted.pdf")


@router.post("/reorder-pages")
async def reorder_pages_endpoint(
    file: UploadFile = File(...),
    pages: str = Form(...)
):
    output = reorder_pages(file, pages)
    return FileResponse(output, filename="reordered.pdf")


@router.post("/extract-pages")
async def extract_pages_endpoint(
    file: UploadFile = File(...),
    pages: str = Form(...)
):
    output = extract_pages(file, pages)
    return FileResponse(output, filename="extracted.pdf")
