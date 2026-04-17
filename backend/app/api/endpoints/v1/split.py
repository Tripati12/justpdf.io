from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from fastapi import Form
import asyncio

from app.core.file_utils import save_upload_file
from app.services.pdf.split import split_pdf, zip_files

router = APIRouter()


@router.post("/split")
async def split_endpoint(file: UploadFile = File(...),
                         ranges: str = Form(...)):

    temp_path = save_upload_file(file)

    output_files = await asyncio.to_thread(split_pdf, temp_path, ranges)

    zip_path = await asyncio.to_thread(zip_files, output_files)

    return FileResponse(zip_path, filename="JUSTPDF_split.zip")