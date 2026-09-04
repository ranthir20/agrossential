"""
agrossential Backend — Crop Disease Detection API
Simple FastAPI server that loads the trained EfficientNetB0 model
and serves predictions.
"""

import io
import json
from pathlib import Path

import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

import tensorflow as tf

# ── Paths ────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent

# Check for model files (support both standard and v2 names)
if (BASE_DIR / "disease_model_v2.keras").exists():
    MODEL_PATH = BASE_DIR / "disease_model_v2.keras"
else:
    MODEL_PATH = BASE_DIR / "disease_model.keras"

if (BASE_DIR / "class_names_v2.json").exists():
    CLASS_NAMES_PATH = BASE_DIR / "class_names_v2.json"
else:
    CLASS_NAMES_PATH = BASE_DIR / "class_names.json"

if (BASE_DIR / "class_metadata.json").exists():
    CLASS_META_PATH = BASE_DIR / "class_metadata.json"
else:
    CLASS_META_PATH = BASE_DIR / "class_mapping.json"

# ── Load model and metadata at startup ───────────────────────────
print(f"Loading model from {MODEL_PATH}...")
model = tf.keras.models.load_model(MODEL_PATH)
print(f"✅ Model loaded: {MODEL_PATH.name}")

class_names = json.loads(CLASS_NAMES_PATH.read_text())
class_meta  = json.loads(CLASS_META_PATH.read_text())

print(f"✅ {len(class_names)} classes loaded")

# ── FastAPI app ──────────────────────────────────────────────────
app = FastAPI(title="agrossential API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # allow the Next.js frontend on any port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "agrossential Crop Disease Detection API",
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST, multipart/form-data with 'file')"
        }
    }


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_PATH.name, "classes": len(class_names)}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accept an uploaded image, run EfficientNetB0 inference,
    return crop/status/disease/confidence/top3.
    """

    try:
        raw = await file.read()
        if len(raw) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")
        img = Image.open(io.BytesIO(raw)).convert("RGB").resize((224, 224))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image format. Please upload a valid image (JPG, PNG, WebP). Error: {str(e)}"
        )

    # ── Preprocess ───────────────────────────────────────────────
    # EfficientNetB0 expects raw [0, 255] — NO /255 normalization
    arr   = np.array(img, dtype="float32")
    batch = np.expand_dims(arr, axis=0)        # shape (1, 224, 224, 3)

    # ── Predict ──────────────────────────────────────────────────
    probs   = model.predict(batch, verbose=0)[0]   # shape (26,)
    top_idx = int(np.argmax(probs))
    confidence = float(probs[top_idx])

    # ── Top-3 ────────────────────────────────────────────────────
    top3_idx = np.argsort(probs)[-3:][::-1]
    top3 = [
        {
            "rank": int(r + 1),
            "class": class_names[int(i)],
            "confidence": round(float(probs[int(i)]) * 100, 2),
        }
        for r, i in enumerate(top3_idx)
    ]

    # ── Confidence interpretation ────────────────────────────────
    conf_pct = round(confidence * 100, 2)

    # Hackathon specifications:
    # >= 80% → High confidence
    # 50–79% → Uncertain
    # < 50%  → Low confidence / Expert assistance
    if conf_pct >= 80:
        confidence_level = "high"
        confidence_interpretation = "High confidence"
    elif conf_pct >= 50:
        confidence_level = "medium"
        confidence_interpretation = "Uncertain"
    else:
        confidence_level = "low"
        confidence_interpretation = "Low confidence / Expert assistance"

    # ── Build result ─────────────────────────────────────────────
    raw_class = class_names[top_idx]
    meta = class_meta.get(raw_class, {
        "crop": "Unknown",
        "status": "Unknown",
        "disease": raw_class,
    })

    if confidence_level == "low":
        result = {
            "crop": meta["crop"],
            "status": "Uncertain",
            "disease": "Low confidence — upload a clearer leaf image",
            "confidence": conf_pct,
            "confidenceLevel": confidence_level,
            "confidenceInterpretation": confidence_interpretation,
            "top3": top3,
            "rawClass": raw_class,
        }
    else:
        result = {
            "crop": meta["crop"],
            "status": meta["status"],
            "disease": meta["disease"],
            "confidence": conf_pct,
            "confidenceLevel": confidence_level,
            "confidenceInterpretation": confidence_interpretation,
            "top3": top3,
            "rawClass": raw_class,
        }

    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
