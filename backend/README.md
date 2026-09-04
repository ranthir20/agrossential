# agrossential Backend API

Lightweight FastAPI backend for crop disease detection using an EfficientNetB0 deep learning model.

## API Endpoints

### 1. Health Check
- **Route**: `GET /health`
- **Response**:
  ```json
  {
    "status": "ok",
    "model": "disease_model_v2.keras",
    "classes": 26
  }
  ```

### 2. Predict Crop Disease
- **Route**: `POST /predict`
- **Payload**: Multipart Form (`file`: image file - JPG, PNG, WebP)
- **Response**:
  ```json
  {
    "crop": "Apple",
    "status": "Diseased",
    "disease": "Apple Scab",
    "confidence": 79.2,
    "confidenceLevel": "medium",
    "confidenceInterpretation": "Uncertain",
    "top3": [
      { "rank": 1, "class": "Apple Scab Leaf", "confidence": 79.2 },
      { "rank": 2, "class": "Corn rust leaf", "confidence": 5.62 },
      { "rank": 3, "class": "Apple rust leaf", "confidence": 4.85 }
    ],
    "rawClass": "Apple Scab Leaf"
  }
  ```

## Running the Backend

```bash
cd backend
/opt/anaconda3/envs/sih-tf/bin/python app.py
```
Server will start on `http://localhost:8000`.
