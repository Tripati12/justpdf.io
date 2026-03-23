import os
import uuid
import tabula
import pandas as pd
from fastapi import UploadFile

TEMP_DIR = "temp"
OUTPUT_DIR = "outputs"

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

def pdf_to_excel_tabula(file: UploadFile) -> str:
    base_name = os.path.splitext(file.filename)[0]

    temp_pdf = os.path.join(TEMP_DIR, f"{uuid.uuid4()}_{file.filename}")
    csv_path = os.path.join(OUTPUT_DIR, f"{base_name}.csv")
    xlsx_path = os.path.join(OUTPUT_DIR, f"{base_name}.xlsx")

    # Save uploaded PDF
    with open(temp_pdf, "wb") as f:
        f.write(file.file.read())

    # 1️⃣ PDF → CSV (Tabula supports this)
    tabula.convert_into(
        temp_pdf,
        csv_path,
        output_format="csv",
        pages="all"
    )

    # 2️⃣ CSV → Excel
    df = pd.read_csv(csv_path)
    df.to_excel(xlsx_path, index=False)

    return xlsx_path
