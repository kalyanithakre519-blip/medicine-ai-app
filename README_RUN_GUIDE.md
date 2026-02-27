# How to Run & Save "Banana" Project

This guide explains how to save your work and run the AI Medicine Management System.

## 1. How to Save Code (Code Save Kaise Karein)
Since this project is on your local computer (VS Code):
- **Auto-Save:** Most editors like VS Code save files automatically.
- **Manual Save:** Press `Ctrl + S` on your keyboard to save any file you edit.
- **Files are already saved:** The code I wrote is already saved in your `c:/Users/ishwa/aiml enable medicine management system` folder.

---

## 2. Prerequisites (Iske liye kya chahiye)
Before running, ensure you have these installed:
1.  **Node.js**: [Download Here](https://nodejs.org/)
2.  **Python**: [Download Here](https://www.python.org/)
3.  **MongoDB**: [Download Here](https://www.mongodb.com/try/download/community) (Make sure MongoDB is running)

---

## 3. One-Time Setup (Pehli baar setting)
Open a terminal in the project folder and run these commands **one by one**:

### A. Install Frontend/Root Dependencies
```bash
npm install
cd client
npm install
cd ..
```

### B. Install Python Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```
*(Make sure `requirements.txt` includes: `fastapi`, `uvicorn`, `pymongo`, `motor`, `pydantic`, `pandas`, `scikit-learn`, `pytesseract`, `pillow`, `python-multipart`)*

---

## 4. How to RUN the Project (Run Kaise Karein)
To start everything (Frontend + Backend + AI) at once, simply run:

```bash
npm start
```

This will automatically launch:
- **React Frontend:** `http://localhost:5173`
- **Python Backend:** `http://localhost:8000` (API Documentation at `/docs`)

---

## 5. How to Stop (Band Kaise Karein)
- Go to the terminal where the project is running.
- Press `Ctrl + C` two times.
- Type `Y` if prompted to terminate batch job.
