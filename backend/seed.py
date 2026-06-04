"""Seed the database with test users for hackathon demo."""
import asyncio
from sqlalchemy import select
from core.database import async_session, engine, Base
from core.security import hash_password, create_access_token
from modules.auth.models import User
from modules.farmers.models import Farmer
from modules.users.models import UserProfile
from modules.products.models import Product, ProductCategory


SEED_USERS = [
    {"email": "farmer@Haatbazzar.com", "phone": "+9779851012345", "full_name": "Ramesh Shrestha", "password": "Farmer123", "role": "farmer", "is_verified": True},
    {"email": "customer@Haatbazzar.com", "phone": "+9779841054321", "full_name": "Anjali Patel", "password": "Customer123", "role": "customer", "is_verified": True},
    {"email": "admin@Haatbazzar.com", "phone": "+9779800000000", "full_name": "Admin Bhandari", "password": "Admin123", "role": "admin", "is_verified": True},
]

SEED_FARMERS = [
    {"email": "farmer@Haatbazzar.com", "farm_name": "Green Hills Organic Farm", "farm_address": "Dhulikhel, Kavre", "farm_city": "Dhulikhel", "is_verified": True},
]

SEED_PRODUCTS = [
    {"name": "Organic Tomatoes", "price": 80, "quantity": 50, "unit": "kg", "description": "Freshly harvested organic tomatoes from the hills of Dhulikhel. Pesticide-free and naturally grown.", "is_organic": True, "farmer_email": "farmer@Haatbazzar.com"},
    {"name": "Fresh Spinach", "price": 40, "quantity": 30, "unit": "kg", "description": "Fresh green spinach, rich in iron and harvested just this morning.", "is_organic": True, "farmer_email": "farmer@Haatbazzar.com"},
    {"name": "Free-Range Eggs (12pcs)", "price": 150, "quantity": 20, "unit": "tray", "description": "Farm-fresh free-range eggs from happy, grain-fed chickens.", "is_organic": True, "farmer_email": "farmer@Haatbazzar.com"},
    {"name": "Strawberries (Premium)", "price": 350, "quantity": 15, "unit": "kg", "description": "Sweet and juicy strawberries, handpicked for quality.", "is_organic": True, "farmer_email": "farmer@Haatbazzar.com"},
    {"name": "Green Chili Peppers", "price": 60, "quantity": 25, "unit": "kg", "description": "Spicy green chili peppers, freshly picked.", "is_organic": False, "farmer_email": "farmer@Haatbazzar.com"},
    {"name": "Fresh Buffalo Milk (1L)", "price": 120, "quantity": 40, "unit": "L", "description": "Pure buffalo milk straight from the farm, no additives.", "is_organic": True, "farmer_email": "farmer@Haatbazzar.com"},
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # Create users
        user_map = {}
        for u in SEED_USERS:
            result = await db.execute(select(User).where(User.email == u["email"]))
            existing = result.scalar_one_or_none()
            if existing:
                user_map[u["email"]] = existing
                continue
            user = User(
                email=u["email"],
                phone=u["phone"],
                full_name=u["full_name"],
                hashed_password=hash_password(u["password"]),
                role=u["role"],
                is_verified=u.get("is_verified", False),
            )
            db.add(user)
            await db.flush()
            await db.refresh(user)
            user_map[u["email"]] = user
            print(f"Created user: {u['email']} / {u['password']}")

        # Create user profiles (required for /users/me endpoint)
        for u in SEED_USERS:
            user = user_map.get(u["email"])
            if not user:
                continue
            result = await db.execute(select(UserProfile).where(UserProfile.user_id == user.id))
            if result.scalar_one_or_none():
                continue
            profile = UserProfile(
                user_id=user.id,
                address="Nepal",
                city="Kathmandu",
            )
            db.add(profile)
        await db.flush()

        # Create farmer profiles
        for f in SEED_FARMERS:
            user = user_map.get(f["email"])
            if not user:
                continue
            result = await db.execute(select(Farmer).where(Farmer.user_id == user.id))
            if result.scalar_one_or_none():
                continue
            farmer = Farmer(
                user_id=user.id,
                farm_name=f["farm_name"],
                farm_address=f.get("farm_address"),
                farm_city=f.get("farm_city"),
                is_verified=f.get("is_verified", False),
            )
            db.add(farmer)
            await db.flush()
            print(f"Created farmer profile for: {f['email']}")

        # Create a default category
        result = await db.execute(select(ProductCategory).limit(1))
        category = result.scalar_one_or_none()
        if not category:
            category = ProductCategory(name="Fresh Produce", description="General fresh produce")
            db.add(category)
            await db.flush()
            await db.refresh(category)

        # Create products
        for p in SEED_PRODUCTS:
            user = user_map.get(p["farmer_email"])
            if not user:
                continue
            result = await db.execute(select(Farmer).where(Farmer.user_id == user.id))
            farmer = result.scalar_one_or_none()
            if not farmer:
                continue
            product = Product(
                farmer_id=farmer.id,
                category_id=category.id,
                name=p["name"],
                price=p["price"],
                quantity_available=p["quantity"],
                unit=p["unit"],
                description=p.get("description"),
                is_organic=p.get("is_organic", False),
                quality_grade="A",
                is_ai_verified=True,
                is_active=True,
            )
            db.add(product)
            print(f"Created product: {p['name']} (${p['price']}/{p['unit']})")

        await db.commit()

    print("\nSeed complete! Login credentials:")
    for u in SEED_USERS:
        print(f"  {u['email']} / {u['password']} (role: {u['role']})")
    print("\nAccess token for testing:")
    for u in SEED_USERS:
        user = user_map.get(u["email"])
        if user:
            token = create_access_token({"sub": str(user.id)})
            print(f"  {u['email']}: Bearer {token[:50]}...")


if __name__ == "__main__":
    asyncio.run(seed())
