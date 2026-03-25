from app.api import pdf
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.utils.cleanup import start_cleanup_thread
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# App initialization
# --------------------------------------------------

app = FastAPI(
    title="JustPDF API",
    description="Backend API for PDF tools like merge, split, extract, convert",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(pdf.router)
@app.get("/")
def health():
    return{"status": "ok"}

# --------------------------------------------------
# CORS (frontend will talk to backend)
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "JustPDF backend running"}

# --------------------------------------------------
# Root
# --------------------------------------------------

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to JustPDF API",
        "docs": "/docs",
        "health": "/health"
    }
app.include_router(pdf.router)

@app.on_event("startup")
async def startup_event():
    start_cleanup_thread()
