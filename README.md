# AI-Enabled Medicine Management System

This is a comprehensive, AI-powered system for managing medicines, tracking inventory, OCR prescription scanning, risk analysis, and dynamic billing.

## How to Run the Project

The system is composed of three interconnected parts:
1. **Frontend (Vite + React)**
2. **Backend Services (FastAPI/Python)**
3. **AI Services (Flask/Python)**

### Prerequisites
Make sure you have installed:
- Python 3.10+
- Node.js & npm
- MongoDB (running locally on default port 27017 or set via `MONGO_URI` in `.env` files)

### Automated Setup
You can use the automated startup script which launches all services simultaneously:
```bash
npm start
```
*(Available in the project root path)*

---

### Manual Setup (Step-by-Step)

If you prefer to start each service manually, follow the instructions below in separate terminal windows.

#### 1. Start the FastAPI Backend
This handles database operations, authentication, inventory, billing, etc.
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
*Backend runs on: `http://localhost:8000`*

#### 2. Start the AI Python Service
This handles advanced machine learning, Real Neural OCR using EasyOCR, forecasting, and risk features.
```bash
cd ai_service
pip install -r requirements.txt
python app.py
```
*AI Service runs on: `http://localhost:5001`*

#### 3. Start the React Frontend
This is the main user interface.
```bash
cd client
npm install
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## Features
- **Neural OCR Diagnosis (EasyOCR):** Upload a prescription image and extract medicines, dosages, safety alerts, substitute medicines, and dietary recommendations.
- **Smart Inventory:** AI-based predictive stock forecasting.
- **Risk Analysis:** Advanced bio-hazard watch and drug-drug interaction alerts.
- **Dynamic Billing:** Auto-generation of Purchase Orders (POs) and patient invoices.
