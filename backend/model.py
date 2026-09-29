
from functools import lru_cache

from PIL import Image
from transformers import pipeline


MODEL_ID = (
    "wellCh4n/"
    "tomato-leaf-disease-classification-resnet50"
)


@lru_cache(maxsize=1)
def load_model():
    """
    Download and load the model once.
    Later requests reuse the loaded model.
    """
    return pipeline(
        task="image-classification",
        model=MODEL_ID,
        device=-1,  # Run on CPU
    )


def predict_disease(image: Image.Image):
    """
    Return the three highest-scoring classes.
    Scores are model outputs, not proof of diagnosis.
    """
    classifier = load_model()

    predictions = classifier(
        image.convert("RGB"),
        top_k=3,
    )

    return [
        {
            "label": item["label"],
            "score": round(float(item["score"]), 4),
        }
        for item in predictions
    ]   