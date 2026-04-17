import asyncio
import uuid
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse

from app.services.pdf.merge import merge_pdfs

router = APIRouter()


@router.post("/merge")
async def merge_endpoint(files: list[UploadFile] = File(...)):
    file_paths = []

    for file in files:
        temp_path = f"app/temp/{uuid.uuid4()}_{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(await file.read())
        file_paths.append(temp_path)

    # 🚀 NON-BLOCKING (IMPORTANT)
    output_path = await asyncio.to_thread(merge_pdfs, file_paths)

    return FileResponse(output_path, filename="JUSTPDF_merged.pdf")