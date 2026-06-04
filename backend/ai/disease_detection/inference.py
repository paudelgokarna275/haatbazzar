from pathlib import Path


async def detect_disease(image_path: str | Path) -> dict:
    return {
        "disease_name": None,
        "confidence": 0.0,
        "treatment": None,
    }
