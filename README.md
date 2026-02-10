# 🧬 ImmunoAI: Multimodal AI System for Autoimmune Disease Diagnosis

> ImmunoAI is a state-of-the-art hybrid medical diagnostic system designed to assist **neurologists** and **dermatologists** in the early detection and classification of **Autoimmune Encephalitis (AE)** and **Pemphigus Vulgaris (PV)**. By fusing quantitative clinical biomarkers *(Tabular Data)* with qualitative neuroimaging *(MRI Data)*, ImmunoAI provides a robust *"Second Opinion"* supported by **Explainable AI (XAI)** and a **Guideline-Based RAG Chatbot**.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [AI Methodology & Performance](#-ai-methodology--performance)
- [Installation & Setup](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [Testing & QA](#-testing--qa)
- [Future Roadmap](#-future-roadmap)
- [Contributors](#-contributors)

---

## 🏥 Project Overview

Autoimmune diseases like **AE** and **PV** are notoriously difficult to diagnose due to their mimicry of psychiatric disorders and common dermatological conditions. Delayed diagnosis often leads to irreversible damage.

**ImmunoAI solves this by:**

- **Quantifying Risk:** Using Machine Learning to analyze CSF protein, cell counts, and antibody titers.
- **Visualizing Pathology:** Using Deep Learning to detect subtle lesion patterns in MRI scans.
- **Explaining Decisions:** Providing *SHAP plots* and *Grad-CAM heatmaps* so doctors trust the result.
- **Assisting Research:** Offering a built-in LLM chatbot indexed on the latest research papers *(Graus Criteria, British Association of Dermatologists Guidelines)*.

---

## 🏗 System Architecture

The system follows a **Micro-service inspired Monolithic Architecture**:

- **Data Layer:** PostgreSQL *(Prod)* / SQLite *(Dev)* for user data; [Pinecone](https://www.pinecone.io/) Vector DB for RAG knowledge.
- **Logic Layer (Django):** Handles Auth, Business Logic, and AI Inference Orchestration.
- **AI Layer:**
  - *Tabular Engine:* Stacking Ensemble (Random Forest + XGBoost + LightGBM)
  - *Vision Engine:* ResNet50 CNN *(Pre-trained on ImageNet, fine-tuned for Brain MRI)*
  - *Fusion Module:* Weighted averaging logic `(0.6 * Clinical) + (0.4 * MRI)`
- **Presentation Layer (React):** Responsive Dashboard with [Recharts](https://recharts.org/) visualization and [Framer Motion](https://www.framer.com/motion/) animations.

---

## 🚀 Key Features

### 🧠 For the Diagnostic Engine

- **Hybrid Multimodal Fusion:** The system doesn't just look at images or numbers independently. It correlates *high CSF protein levels* with *temporal lobe hyperintensities* to confirm AE.
- **Grad-CAM Integration:** *"Red-Hot"* visualization overlays on MRI scans indicating the exact **Region of Interest (ROI)** driving the diagnosis.
- **SHAP Feature Importance:** Dynamic bar charts showing which clinical factor *(e.g., "Seizure History")* contributed most to the risk score.
- **Noise Suppression:** Intelligent logic to prevent heatmap generation on healthy/normal scans.

### 🩺 For Doctors (Specialist Portal)

- **Patient Registry:** View list of assigned patients and their risk status.
- **Diagnosis Verification:** Review AI predictions, add clinical notes, and **verify/reject** the diagnosis *(Human-in-the-loop)*.
- **Appointment Management:** Set availability, view upcoming consultations, and mark sessions as completed.
- **Secure PDF Generation:** One-click generation of comprehensive medical reports with charts and AI analysis for patient files.

### 👤 For Patients (User Portal)

- **Symptom Checker:** Intuitive forms to input symptoms *(Memory loss, Blisters, etc.)*.
- **MRI Uploader:** Drag-and-drop interface for neuroimaging files.
- **Live Chat with Specialist:** Secure messaging system to communicate with assigned doctors.
- **Immuno-LLM Chatbot:** Ask questions like *"Is Autoimmune Encephalitis curable?"* and get answers cited from medical journals.

---

## 💻 Tech Stack

| Category | Technologies |
|---|---|
| **Backend** | [Python 3.10](https://www.python.org/), [Django 5.0](https://www.djangoproject.com/), [Django REST Framework (DRF)](https://www.django-rest-framework.org/) |
| **Frontend** | [React.js 18](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Axios](https://axios-http.com/) |
| **Machine Learning** | [PyTorch](https://pytorch.org/), [Scikit-Learn](https://scikit-learn.org/), [XGBoost](https://xgboost.readthedocs.io/), [LightGBM](https://lightgbm.readthedocs.io/), [OpenCV](https://opencv.org/), [SHAP](https://shap.readthedocs.io/) |
| **Generative AI (RAG)** | [LangChain](https://www.langchain.com/), [Pinecone](https://www.pinecone.io/), [Groq API (Llama-3)](https://groq.com/), [HuggingFace Embeddings](https://huggingface.co/) |
| **Database** | [SQLite](https://www.sqlite.org/) *(Dev)*, [PostgreSQL](https://www.postgresql.org/) *(Prod)* |
| **DevOps & Tools** | [Git](https://git-scm.com/), [Postman](https://www.postman.com/), [Coverage.py](https://coverage.readthedocs.io/) |

---

## 📊 AI Methodology & Performance

### 1. Tabular Models (Biomarkers)

We employed a **Stacking Ensemble** approach to handle the non-linear relationships in clinical data.

- **Base Learners:** Random Forest *(for robustness)*, XGBoost *(for speed)*, LightGBM *(for accuracy)*
- **Meta Learner:** Logistic Regression to combine predictions
- **Performance:** *~81.5% Accuracy*, *0.86 ROC-AUC*

### 2. Computer Vision (Neuroimaging)

- **Architecture:** [ResNet50](https://pytorch.org/vision/stable/models/generated/torchvision.models.resnet50.html) *(Residual Neural Network)*
- **Preprocessing:** Intensity normalization, Resizing *(224×224)*, Data Augmentation
- **Performance:** *~88% Validation Accuracy* on MRI datasets

### 3. Feature Engineering

The system auto-generates **48 derived features** during inference, including:
```python
csf_inflammation_index  = Protein * Cells
clinical_contrast       = Neuro score vs Skin score
dsg_ratio               = Desmoglein 1 vs 3  # For PV classification
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Python `3.10+`
- Node.js `18+` & `npm`
- `Git`

### 1. Backend Setup
```bash
# Clone Repository
git clone https://github.com/yourusername/ImmunoAI.git
cd ImmunoAI/backend

# Create Virtual Environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Environment Variables (.env)
# Create a .env file in backend/core/ containing:
# GROQ_API_KEY=gsk_...
# PINECONE_API_KEY=pcsk_...
# HUGGINGFACEHUB_API_TOKEN=hf_...
# SECRET_KEY=django-insecure-...

# Database Migrations
python manage.py migrate

# Seed RAG Database (Uploads PDFs to Pinecone)
python ingest_data.py

# Run Server
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd ../frontend

# Install Node Modules
npm install

# Start Development Server
npm run dev
```

> Access the application at **[http://localhost:5173](http://localhost:5173)**

---

## 🧪 Testing & QA

The project adheres to industry-standard testing practices with **>80% Code Coverage**.

### Running Tests
```bash
cd backend
python manage.py test api
```

### Coverage Report

To generate a detailed HTML coverage report:
```bash
coverage run --source='api' manage.py test api
coverage html
# Open htmlcov/index.html in your browser
```

### Test Suites Include

| Test File | Description |
|---|---|
| [`test_ai_logic.py`](./backend/api/tests/test_ai_logic.py) | Mocks heavy ML models to test mathematical logic and fusion |
| [`test_integration.py`](./backend/api/tests/test_integration.py) | End-to-end API testing *(Auth → Prediction → DB)* |
| [`test_edge_cases.py`](./backend/api/tests/test_edge_cases.py) | Security testing *(Malicious file uploads, negative values)* |
| [`test_advanced_features.py`](./backend/api/tests/test_advanced_features.py) | Validates PDF generation and RAG connectivity |

---

## 🗺 Future Roadmap

- [ ] **DICOM Support:** Native handling of medical DICOM files instead of JPG/PNG.
- [ ] **Federated Learning:** To train on patient data without compromising privacy.
- [ ] **Mobile App:** React Native adaptation for patient accessibility.
- [ ] **Multi-Language Support:** For broader accessibility in non-English speaking regions.

---

## 👥 Contributors

| Role | Contributor | Responsibilities |
|---|---|---|
| **Lead Developer & AI Engineer** | *ALI Hassan* | Designed the Hybrid Architecture, implemented CNN/RAG, and built the React Frontend |
| **Backend Architect & Documentation Lead** | *Fahad Rehan* | Managed Django REST API, Database Schema, and extensive system documentation |
| **Supervisor** | *Kiran Amjad* | — |

---

## 📜 License & Disclaimer

**License:** [MIT License](./LICENSE) — See `LICENSE` for details.

> ⚠️ **Disclaimer:** *ImmunoAI is a prototype developed for **educational and research purposes**. It is **NOT FDA-approved** and must **NOT** be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the guidance of a qualified healthcare provider with any questions you may have regarding a medical condition.*
