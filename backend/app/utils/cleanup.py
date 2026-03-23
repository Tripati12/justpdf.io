import os
import time
import threading
from pathlib import Path

# Folders to clean
FOLDERS_TO_CLEAN = [
    Path("outputs"),
    Path("temp")
]

# File expiry time (seconds)
FILE_EXPIRY_SECONDS = 600  # 15 minutes

# Cleanup check interval (seconds)
CLEANUP_INTERVAL = 300 # 5 minutes


def cleanup_old_files():
    while True:
        try:
            now = time.time()

            for folder in FOLDERS_TO_CLEAN:
                if folder.exists():
                    for file in folder.iterdir():
                        if file.is_file():
                            file_age = now - file.stat().st_mtime

                            if file_age > FILE_EXPIRY_SECONDS:
                                try:
                                    file.unlink()
                                    print(f"[CLEANUP] Deleted: {file}")
                                except Exception as e:
                                    print(f"[CLEANUP ERROR] {e}")

        except Exception as e:
            print(f"[CLEANUP LOOP ERROR] {e}")

        time.sleep(CLEANUP_INTERVAL)


def start_cleanup_thread():
    thread = threading.Thread(
        target=cleanup_old_files,
        daemon=True  # Stops automatically when server stops
    )
    thread.start()
