# Haatbazzar

Farm-to-consumer marketplace with AI-driven produce quality verification. Farmers upload photos of their produce, a local CLIP model grades freshness and detects defects, and buyers see verified quality scores before ordering.

## Stack

- **Backend:** FastAPI + PostgreSQL (async SQLAlchemy)
- **Auth:** JWT (access + refresh tokens, bcrypt passwords)
- **AI:** CLIP (`openai/clip-vit-base-patch32`) via HuggingFace transformers — runs locally, no API key needed after first download (~600 MB cached to `~/.cache/huggingface`)
- **Infra:** Docker, Alembic

## Setup

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   
alembic upgrade head
uvicorn main:app --reload
```

Docs at `http://localhost:8000/docs`

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | Yes | 64-byte hex string — `python -c "import secrets; print(secrets.token_hex(64))"` |
| `DATABASE_URL` | Yes | `postgresql+asyncpg://user:pass@host:5432/db` |
| `DATABASE_SYNC_URL` | Yes | Same but `postgresql://` (used by Alembic) |
| `DEBUG` | No | `false` in production |

## AI Pipeline

Upload an image → CLIP zero-shot classifies it against 3 labels → weighted freshness score (0–100) → grade A/B/C → stored as `QualityReport`, product marked `is_ai_verified=true`.

```
freshness_score ≥ 80  →  A (Premium)
freshness_score ≥ 60  →  B (Standard)
freshness_score < 60  →  C (Economy)
```

## Key Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | — | Register (email + password ≥ 8 chars) |
| POST | `/api/v1/auth/login` | — | Login (5 attempts/min per IP) |
| POST | `/api/v1/auth/refresh` | — | Refresh access token |
| POST | `/api/v1/farmers` | JWT | Register as a farmer |
| POST | `/api/v1/products/create` | JWT (farmer) | List a product |
| POST | `/api/v1/products/upload-image` | JWT (farmer) | Upload image → triggers AI grading |
| GET | `/api/v1/products` | — | Browse products with AI data |
| GET | `/api/v1/products/{id}` | — | Single product |
| POST | `/api/v1/orders/create` | JWT | Place order (validates stock) |
| GET | `/api/v1/orders/{id}` | JWT (owner) | Get your order |
| GET | `/api/v1/marketplace/featured` | — | AI-verified featured products |
| GET | `/health` | — | Health check |

## Project Structure

```
backend/
├── main.py                   # App entrypoint, middleware, routers
├── core/                     # Config, DB, security, auth deps
├── modules/                  # 12 feature modules
│   ├── auth/                 # Register, login, token refresh
│   ├── farmers/              # Farmer profiles
│   ├── products/             # Products + AI quality reports
│   ├── marketplace/          # Search, featured
│   ├── orders/               # Order creation + stock lock
│   ├── cart/                 # Cart management
│   ├── delivery/             # Delivery tracking
│   ├── reviews/              # Product reviews
│   └── ...
├── ai/
│   ├── quality_verification/ # CLIP inference pipeline
│   └── grading/              # Score → grade rules
├── uploads/                  # Stored product images
├── Dockerfile
└── requirements.txt
```

## Docker

```bash
docker build -t haatbazzar .
docker run -p 8000:8000 \
  -e SECRET_KEY=<your-key> \
  -e DATABASE_URL=<your-db-url> \
  -e DATABASE_SYNC_URL=<your-sync-db-url> \
  haatbazzar
```
