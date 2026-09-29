
# 🌱 CropSense
### AI-Powered Crop Health & Field Intelligence Platform

**CropSense** is an AI-powered agricultural platform designed to help farmers identify potential crop diseases, record field conditions, access local weather information, and monitor crop health over time.

Our goal is to move beyond conventional image-based disease detection toward a more comprehensive, context-aware crop stress monitoring system.

---

## 🎯 Problem Statement

### AI-Based Crop Stress Detection and Analysis

Farmers often struggle to identify crop stress because diseases, nutrient deficiencies, water stress, and environmental factors can produce similar symptoms.

### Problems Identified

- **Difficult diagnosis:** Different crop health problems often exhibit similar visible symptoms.
- **Limited contextual analysis:** Image-based disease detection may overlook weather, soil conditions, and irrigation history.
- **Delayed intervention:** Late identification and limited access to expert guidance can increase crop damage.
- **Inadequate monitoring:** Farmers lack a convenient way to track recurring crop health issues.

---

## 💡 Our Solution

CropSense combines AI-powered image classification, farmer-reported field observations, weather intelligence, and assessment history in a single web application.

The platform is designed to help farmers:

1. Upload photographs of affected crop leaves.
2. Identify possible diseases using an AI model.
3. Record irrigation history, soil conditions, and visible symptoms.
4. Access local weather conditions and forecasts.
5. Save and revisit previous crop assessments.

**Current AI support:** Tomato leaf disease classification.

**Planned expansion:** Dedicated models for potato, rice, wheat, and additional crops.

---

## ✨ Features

### 1. AI-Powered Crop Analysis

Upload a photograph of an affected tomato leaf and receive AI-generated disease predictions.

- Image upload and validation
- Tomato leaf disease classification
- Multiple predictions with model confidence scores
- Clear indication that AI predictions require field verification

The current model uses image data for classification. Field observations are recorded separately and do not yet influence its predictions.

### 2. Field Observations

Record important information about crop conditions:

- Crop type
- Field location
- Last irrigation
- Soil condition
- Visible symptoms

These observations provide additional context for future crop-stress analysis.

### 3. Field Intelligence

Explore weather conditions for a selected location.

- Current temperature
- Relative humidity
- Wind speed
- Precipitation
- Seven-day weather forecast

Weather information is retrieved using Open-Meteo.

Weather-based crop-stress reasoning is planned for a future version.

### 4. Assessment History

Save completed crop assessments and revisit them later.

- Uploaded crop photographs
- Recorded field observations
- AI predictions and confidence scores
- Assessment dates and locations
- Option to delete previous assessments

Assessment history currently uses browser localStorage.

### 5. Multi-Crop Architecture

CropSense is structured to support multiple crops through dedicated classification models.

The interface includes:

- Tomato — AI classification supported
- Potato — Coming soon
- Rice — Coming soon
- Wheat — Coming soon

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend | Python, FastAPI |
| AI | Hugging Face Transformers |
| Image processing | Pillow |
| Weather data | Open-Meteo |
| Local data storage | Browser localStorage |
| Version control | Git & GitHub |

### AI Model

The current tomato leaf classifier uses:

[wellCh4n/tomato-leaf-disease-classification-resnet50](https://huggingface.co/wellCh4n/tomato-leaf-disease-classification-resnet50)

Model outputs represent classification scores, not confirmed agricultural diagnoses.

---

## ⚙️ Getting Started

### Prerequisites

Install the following:

- Node.js and npm
- Python
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Anon-codee/CropSense.git
cd CropSense
```

### 2. Set Up the Frontend

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

http://localhost:3000

### 3. Set Up the Backend

Open a separate terminal and navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate it.

**Windows:**

```cmd
.venv\Scripts\activate
```

**macOS/Linux:**

```bash
source .venv/bin/activate
```

Install the backend dependencies:

```bash
pip install fastapi uvicorn python-multipart pillow transformers torch
```

Start the FastAPI server:

```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

The backend will be available at:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

The AI model may take additional time to download when it is first used.

---

## 🔄 How CropSense Works

```text
          Farmer opens CropSense
                    |
                    v
             Selects crop
                    |
                    v
           Uploads leaf image
                    |
                    v
         Enters field observations
                    |
                    v
           FastAPI backend
                    |
                    v
         AI image classification
                    |
                    v
          Disease predictions
                    |
                    v
         Save assessment history
```

The Field Intelligence page provides a separate weather-information workflow.

Future versions will connect weather data and field observations directly to the crop-stress reasoning process.

---

## 📂 Project Structure

```text
CropSense/
|
|-- backend/
|   |-- main.py
|   |-- model.py
|   |-- crop_models.py
|
|-- public/
|
|-- src/
|   |-- app/
|   |   |-- analyze/
|   |   |-- dashboard/
|   |   |-- fields/
|   |   |-- history/
|   |   |-- page.tsx
|   |
|   |-- components/
|   |
|   |-- lib/
|       |-- assessments.ts
|       |-- crops.ts
|
|-- package.json
|-- .gitignore
|-- README.md
```

---

## 🚀 Future Scope

### Multi-Crop Disease Detection

Integrate and validate dedicated AI models for additional crops, including potato, rice, and wheat.

### Context-Aware Crop Stress Analysis

Combine image predictions with:

- Soil conditions
- Irrigation history
- Visible symptoms
- Temperature and humidity
- Rainfall and weather forecasts

### Actionable Agricultural Guidance

Develop validated recommendations that help farmers understand possible causes of crop stress and determine appropriate next steps.

### Field-Level Monitoring

Track crop assessments over time, identify recurring symptoms, and highlight changes in field conditions.

### Accessibility

Introduce regional-language support, mobile-friendly workflows, and low-connectivity functionality.

### Advanced Field Intelligence

Explore weather-based risk indicators, forecast-driven alerts, and integration with field sensors.

---

## ⚠️ Important Disclaimer

CropSense is a prototype intended for agricultural decision support.

AI-generated disease predictions are not confirmed diagnoses. Weather information represents conditions for the selected location and may differ from measurements taken directly in a field.

Farmers should verify important findings with qualified agricultural professionals before making treatment decisions.

---

## 🌍 Our Vision

To make crop health monitoring more accessible by combining artificial intelligence, environmental information, and farmer observations into one platform.

**CropSense — Beyond Disease Detection, Towards Intelligent Crop Health Monitoring.**
