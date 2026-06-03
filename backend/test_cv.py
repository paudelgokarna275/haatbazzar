import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from ai.quality_verification.inference import predict


async def main():
    if len(sys.argv) < 2:
        print("Usage: python test_cv.py <path_to_image>")
        sys.exit(1)

    image_path = sys.argv[1]
    print(f"Running CV pipeline on: {image_path}")
    result = await predict(image_path)
    for key, value in result.items():
        print(f"  {key}: {value}")


asyncio.run(main())
