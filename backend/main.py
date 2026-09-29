
import logging
from io import BytesIO

from fastapi import (
    FastAPI,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from PIL import (
    Image,
    UnidentifiedImageError,
)

from crop_models import (
    SUPPORTED_CROPS,
    analyze_crop_image,
)


app = FastAPI(
    title="CropSense API",
    description="Multi-crop AI analysis",
    version="0.4.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 5 * 1024 * 1024

ALL_CROPS = [
    "tomato",
    "potato",
    "rice",
    "wheat",
]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/crops")
def get_crops():
    return [
        {
            "id": crop,
            "supported": crop in SUPPORTED_CROPS,
        }
        for crop in ALL_CROPS
    ]


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    crop: str = Form(...),
):
    crop = crop.lower().strip()

    if crop not in ALL_CROPS:
        raise HTTPException(
            status_code=400,
            detail="Unknown crop selected.",
        )

    if crop not in SUPPORTED_CROPS:
        raise HTTPException(
            status_code=422,
            detail=(
                f"AI analysis for {crop} "
                "is not available yet."
            ),
        )

    if file.content_type not in (
        "image/jpeg",
        "image/png",
        "image/webp",
    ):
        raise HTTPException(
            status_code=400,
            detail="Upload a JPG, PNG or WebP image.",
        )

    contents = await file.read(
        MAX_FILE_SIZE + 1
    )

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image must be smaller than 5 MB.",
        )

    try:
        image = Image.open(BytesIO(contents))
        image.load()

        if image.format not in (
            "JPEG",
            "PNG",
            "WEBP",
        ):
            raise ValueError(
                "Unsupported image format."
            )

        image_format = image.format
        width, height = image.size

        if width * height > 20_000_000:
            raise HTTPException(
                status_code=413,
                detail="Image dimensions are too large.",
            )

        image = image.convert("RGB")

    except HTTPException:
        raise
    except (
        UnidentifiedImageError,
        OSError,
        ValueError,
        Image.DecompressionBombError,
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid image.",
        )

    try:
        predictions = await run_in_threadpool(
            analyze_crop_image,
            crop,
            image,
        )
    except Exception:
        logging.exception(
            "CropSense model inference failed"
        )
        raise HTTPException(
            status_code=503,
            detail="AI analysis is unavailable.",
        )

    return {
        "success": True,
        "crop": crop,
        "filename": file.filename,
        "image": {
            "width": width,
            "height": height,
            "format": image_format,
        },
        "analysis_status": (
            "AI image classification completed. "
            "Predictions require field verification."
        ),
        "model": (
            "wellCh4n/"
            "tomato-leaf-disease-classification-resnet50"
        ),
        "predictions": predictions,
    }