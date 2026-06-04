# HaatBazaar Nepal

Farm-to-Table Platform connecting local farmers directly with consumers.

## Quick Start (Docker)

```bash
# 1. Clone repository
git clone <repo-url>
cd Haatbazzar

# 2. Setup environment variables
cp backend/.env.example backend/.env

# 3. Build and run (requires sudo)
sudo docker compose up -d --build
```

**App is running at:** `http://localhost`
**API Docs:** `http://localhost/docs`

## Test Credentials

The database is seeded with these test accounts:

- **Farmer:** `farmer@farmlink.com` | `Farmer123`
- **Consumer:** `customer@farmlink.com` | `Customer123`
- **Admin:** `admin@farmlink.com` | `Admin123`

*(Note: New passwords require min 8 chars, 1 uppercase, 1 digit)*

## Database Inspection

To connect directly to the PostgreSQL container and run SQL queries:

```bash
sudo docker exec -it haatbazzar-db-1 psql -U postgres -d haadbazzar
```

**Common Queries:**
```sql
\dt                                  -- List tables
SELECT * FROM users;                 -- View users
SELECT name, price FROM products;    -- View products
\q                                   -- Exit
```

## Useful Commands

```bash
# View API logs
sudo docker compose logs api -f

# Rebuild API container after code changes
sudo docker compose build --no-cache api && sudo docker compose up -d

# Stop all services
sudo docker compose down

# FULL WIPE (Destroys database and uploads)
sudo docker compose down -v
```
