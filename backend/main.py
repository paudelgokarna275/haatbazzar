import json
import logging
import time
from collections import defaultdict
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware

from core.config import get_settings
from core.database import engine, Base
from modules.auth.router import router as auth_router
from modules.users.router import router as users_router
from modules.farmers.router import router as farmers_router
from modules.products.router import router as products_router
from modules.marketplace.router import router as marketplace_router
from modules.cart.router import router as cart_router
from modules.orders.router import router as orders_router
from modules.delivery.router import router as delivery_router
from modules.notifications.router import router as notifications_router
from modules.reviews.router import router as reviews_router
from modules.reputation.router import router as reputation_router
from modules.admin.router import router as admin_router

logger = logging.getLogger("haatbazzar")

settings = get_settings()

_login_attempts: dict[str, list[float]] = defaultdict(list)
_RATE_LIMIT_WINDOW = 60.0
_RATE_LIMIT_MAX = 5


def _is_login_rate_limited(ip: str) -> bool:
    now = time.monotonic()
    attempts = _login_attempts[ip]
    _login_attempts[ip] = [t for t in attempts if now - t < _RATE_LIMIT_WINDOW]
    if len(_login_attempts[ip]) >= _RATE_LIMIT_MAX:
        return True
    _login_attempts[ip].append(now)
    return False


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.monotonic()
        response = await call_next(request)
        latency_ms = round((time.monotonic() - start) * 1000, 1)
        logger.info(json.dumps({
            "method": request.method,
            "path": request.url.path,
            "status": response.status_code,
            "latency_ms": latency_ms,
            "ip": request.client.host if request.client else None,
        }))
        return response


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception", exc_info=exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(farmers_router, prefix="/api/v1")
app.include_router(products_router, prefix="/api/v1")
app.include_router(marketplace_router, prefix="/api/v1")
app.include_router(cart_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")
app.include_router(delivery_router, prefix="/api/v1")
app.include_router(notifications_router, prefix="/api/v1")
app.include_router(reviews_router, prefix="/api/v1")
app.include_router(reputation_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok", "app": settings.APP_NAME}


def get_login_rate_limiter():
    return _is_login_rate_limited
