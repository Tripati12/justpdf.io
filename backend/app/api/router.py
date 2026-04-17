from fastapi import APIRouter

from app.api.endpoints.v1.merge import router as merge_router

from app.api.endpoints.v1.split import router as split_router

api_router = APIRouter()

api_router.include_router(merge_router, prefix="/pdf", tags=["PDF"])

api_router.include_router(split_router, prefix="/pdf", tags=["PDF"])