from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router


from app.utils.cleanup import start_cleanup_thread

# ----------------------------------------
# App Initialization
# ----------------------------------------

app = FastAPI(
    title="JustPDF API",
    description="Backend API for PDF tools like merge, split, compress",
    version="1.0.0",
)

# ----------------------------------------
# CORS (frontend ↔ backend)
# ----------------------------------------

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ include AFTER app is created
app.include_router(api_router, prefix="/api/v1")

# ----------------------------------------
# Routes
# ----------------------------------------

# ----------------------------------------
# Health Check
# ----------------------------------------

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "service": "JustPDF backend running"
    }

# ----------------------------------------
# Root Endpoint
# ----------------------------------------

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to JustPDF API",
        "docs": "/docs",
        "health": "/health"
    }

# ----------------------------------------
# Startup Events
# ----------------------------------------

@app.on_event("startup")
def startup_event():
    start_cleanup_thread()



