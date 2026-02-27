# AI/ML Enabled Medicine Management System Project Report

## 1. Project Overview (Project ka Aim)
**Project Name:** AI/ML Enabled Medicine Management System (Codename: "Banana")
**Objective:** Is project ka main aim ek smart, efficient system banana hai jo medical stores ya hospitals mein medicines ko manage kar sake. Ye system sirf inventory track nahi karta, balki **AI (Artificial Intelligence)** ka use karke future demand predict karta hai taki medicines stock out na ho aur wastage kam ho.

**Key Goals:**
- **Automate Inventory:** Medicines ka stock automatically track karna.
- **AI Predictions:** Linear Regression ML model ka use karke batana ki konsi medicine kab khatam hogi.
- **Smart Billing:** Fast billing system jo stock ko real-time update kare.
- **Data Analytics:** Sales trends aur patterns ko visualize karna.

---

## 2. Technology Stack (Used Technologies & Languages)

Humne is project mein **Modern Full-Stack Development** technologies ka use kiya hai. Niche har technology aur uska use case detail mein diya gaya hai:

### **A. Frontend (User Interface - Jo User Dekhta Hai)**
- **React.js (JavaScript Library):**
  - *Kyun Use Kiya:* UI banane ke liye jo fast aur interactive ho. Single Page Application (SPA) structure deta hai jisse page reload nahi hota.
  - *Key Concepts:* Hooks (`useState`, `useEffect`), Components, React Router DOM.
- **Tailwind CSS:**
  - *Kyun Use Kiya:* Rapid styling ke liye. Ye utility-first CSS framework hai jo design ko clean aur responsive banata hai.
- **Chart.js:**
  - *Kyun Use Kiya:* Reports aur Dashboard par data ko Graphs (Line Chart, Doughnut Chart) mein dikhane ke liye.
- **Axios:**
  - *Kyun Use Kiya:* Backend API se data fetch karne ke liye (HTTP Requests).

### **B. Backend (Server Logic - Jo Background Mein Chalta Hai)**
- **Python (Language):**
  - *Kyun Use Kiya:* Backend logic likhne ke liye. Python AI/ML libraries (Pandas, Scikit-learn) ke sath natively compatible hai, isliye humne Node.js se switch kiya.
- **FastAPI (Web Framework):**
  - *Kyun Use Kiya:* Ye Python ka sabse fast web framework hai. Ye `async/await` support karta hai aur automatic API documentation (Swagger UI) deta hai. API Routing aur Request Handling yahi karta hai.
- **Uvicorn:**
  - *Kyun Use Kiya:* Ye ek ASGI server hai jo FastAPI application ko run karta hai.
- **Pydantic:**
  - *Kyun Use Kiya:* Data validation ke liye. Ensure karta hai ki API ko sahi format mein data mile.

### **C. Database (Data Storage)**
- **MongoDB (NoSQL Database):**
  - *Kyun Use Kiya:* Flexible data storage ke liye. Medicines, Users, Bills sab JSON-like format (Documents) mein store hote hain jo scaling ke liye easy hai.
- **Motor (Python Library):**
  - *Kyun Use Kiya:* MongoDB ko Python ke sath asynchronously connect karne ke liye.

### **D. AI & Machine Learning (The "Brain" of the System)**
- **Scikit-Learn (Library):**
  - *Kyun Use Kiya:* **Linear Regression Algorithm** lagane ke liye. Ye purane sales data ko analyze karke future consumption predict karta hai.
- **Pandas (Library):**
  - *Kyun Use Kiya:* Data Manipulation aur Analysis ke liye. Sales logs ko dates ke hisab se group karna aur trends nikalna isi ka kaam hai.
- **NumPy:**
  - *Kyun Use Kiya:* Mathematical calculations ke liye.

### **E. Tools & Utilities**
- **Vite:** Frontend tooling for fast development server.
- **JWT (JSON Web Tokens):** Secure User Authentication (Login/Register) ke liye.
- **Bcrypt:** Password hashing (security) ke liye.

---

## 3. Workflow (Kaise Kaam Karta Hai)
1.  **User Access:** Pharmacist login karta hai (JWT Auth).
2.  **Inventory Manage:** Medicine add/update/delete karta hai.
3.  **Billing:** Customer ke liye bill banata hai -> Stock automatically kam hota hai.
4.  **AI Analysis:** System background mein sales data ko analyze karta hai.
5.  **Prediction:** Dashboard par alert aata hai: *"Paracetamol will stock out in 3 days. Reorder Recommended!"*

---

**Summary:** 
Humne **JavaScript (React)** ko frontend ke liye aur **Python (FastAPI)** ko backend + AI ke liye choose kiya taaki hum **performance** aur **intelligence** dono ka best use kar sakein.

