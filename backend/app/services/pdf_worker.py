import subprocess

def process_pdf(file_path: str, output_path: str):
    cmd = [
        "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
        "--headless",
        "--convert-to", "pdf",
        "--outdir", output_path,
        file_path
    ]

    subprocess.run(cmd, check=True)
    return output_path