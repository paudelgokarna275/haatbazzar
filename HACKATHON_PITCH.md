# 🌾 Haatbazzar — AI-Powered Farm Marketplace

## Problem

Farmers in local markets (haats) struggle to get fair prices for their produce. Buyers cannot reliably assess the quality of fresh produce before purchasing. There is no centralized, trust-based platform that connects farmers directly to consumers with transparent quality verification.

## Solution

Haatbazzar is a digital marketplace that bridges farmers and buyers with **AI-driven quality verification**. Farmers list their produce, upload images, and our computer vision pipeline automatically grades freshness, detects defects, and assigns a quality score — building trust without manual inspection.

## How It Works

```
Farmer → Lists produce → Uploads photo → AI grades it → Badge appears → Buyer sees quality → Orders
```

1. **Farmer registers/logs in** (JWT auth)
2. **Creates a product** with name, price, quantity
3. **Uploads an image** — backend saves it and triggers the CV pipeline
4. **AI pipeline runs** — CNN model computes freshness score (0–100), grade (A/B/C), and defect detection
5. **Product gets "AI Verified" badge** — quality report stored in database
6. **Buyer browses marketplace** — sees enriched product cards with AI quality data
7. **Places order** — stock validated, inventory updated

## Architecture

```
┌──────────┐     ┌─────────────────────────────────────┐
│  Client   │     │            FastAPI Backend           │
│ (React/   │────▶│                                      │
│  Mobile)  │     │  ┌─────┐ ┌──────┐ ┌──────────────┐  │
└──────────┘     │  │Auth │ │Users │ │  Products     │  │
                 │  │     │ │      │ │  /Create      │  │
                 │  │     │ │      │ │  /Upload-Image│  │
                 │  └─────┘ └──────┘ └──────┬───────┘  │
                 │                          │          │
                 │  ┌───────────────────────▼────────┐ │
                 │  │    Computer Vision Pipeline     │ │
                 │  │  ┌─────────┐ ┌───────────────┐ │ │
                 │  │  │OpenCV   │ │PyTorch CNN    │ │ │
                 │  │  │Preproc. │ │Quality Model   │ │ │
                 │  │  └─────────┘ └───────┬───────┘ │ │
                 │  │                      ▼         │ │
                 │  │              Freshness Score    │ │
                 │  │              Grade (A/B/C)      │ │
                 │  │              Defect Detection   │ │
                 │  └─────────────────────────────────┘ │
                 │                                      │
                 │  ┌──────────┐ ┌────────┐ ┌────────┐ │
                 │  │Orders    │ │Cart    │ │Delivery│ │
                 │  └──────────┘ └────────┘ └────────┘ │
                 │                                      │
                 │  ┌──────────────────────────────────┐ │
                 │  │        PostgreSQL Database        │ │
                 │  │  users │ products │ quality_reports│ │
                 │  └──────────────────────────────────┘ │
                 └─────────────────────────────────────┘
```

## Key Technical Highlights

### Computer Vision Module (`ai/quality_verification/`)
- **CNN architecture** built with PyTorch (`model.py`)
- **Preprocessing pipeline** with OpenCV — resize, normalize, RGB conversion (`preprocess.py`)
- **Grading rules** map freshness score to A/B/C grade (`grading/rules.py`)
- Separate modules for **disease detection** (`disease_detection/`)

### Backend (`FastAPI + PostgreSQL`)
- **Async throughout** — async SQLAlchemy sessions, non-blocking endpoints
- **JWT authentication** with access + refresh token flow
- **12 feature modules** — auth, users, farmers, products, marketplace, cart, orders, delivery, notifications, reviews, reputation, admin
- **Auto-generated quality reports** on image upload — products become "AI Verified" automatically
- **Stock validation** during order placement — prevents overselling

### API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/auth/register` | User registration |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/products/create` | List a new product |
| POST | `/api/v1/products/upload-image` | Upload image → triggers AI |
| GET | `/api/v1/products` | Browse products with AI data |
| POST | `/api/v1/orders/create` | Place order (validates stock) |
| GET | `/api/v1/marketplace/featured` | AI-verified featured products |

## Why This Wins

- **Trust through AI** — no manual grading, no fake claims. Every product gets an objective quality score.
- **End-to-end flow** — from farmer login to AI grading to buyer checkout, all in one platform.
- **Hackathon-ready** — modular structure means each team member can own a module independently.

## Tech Stack

- **Framework:** FastAPI (Python 3.12)
- **Database:** PostgreSQL with SQLAlchemy (async)
- **Auth:** JWT (python-jose + bcrypt/passlib)
- **AI:** PyTorch, OpenCV
- **Infrastructure:** Docker, Alembic migrations

## Project Structure

```
backend/
├── main.py                 # App entry, lifespan, routers
├── core/                   # Config, DB, security, deps
├── modules/                # 12 feature modules
│   ├── auth/               # Register, login, token refresh
│   ├── products/           # CRUD + quality report model
│   ├── marketplace/        # Search, featured products
│   ├── orders/             # Order with stock validation
│   └── ...                 # cart, delivery, reviews, etc.
├── ai/                     # Computer vision pipeline
│   ├── quality_verification/  # CNN model, inference, preprocessing
│   ├── disease_detection/     # Disease classifier
│   └── grading/               # Score → grade mapping
├── uploads/                # Stored product images
├── Dockerfile
└── requirements.txt
```
