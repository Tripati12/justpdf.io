import os
import uuid
from fastapi import UploadFile

TEMP_DIR = "temp"
os.makedirs(TEMP_DIR, exist_ok=True)


def save_upload_file(file: UploadFile) -> str:
    temp_path = os.path.join(
        TEMP_DIR,
        f"{uuid.uuid4()}_{file.filename}"
    )

    with open(temp_path, "wb") as f:
        f.write(file.file.read())

    return temp_path