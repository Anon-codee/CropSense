
from model import predict_disease


SUPPORTED_CROPS = {
    "tomato": predict_disease,
}


def analyze_crop_image(crop, image):
    crop = crop.lower().strip()

    if crop not in SUPPORTED_CROPS:
        raise ValueError(
            f"AI analysis is not yet available for {crop}."
        )

    return SUPPORTED_CROPS[crop](image)