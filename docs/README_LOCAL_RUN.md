# TRIFECTA COMPUTATIONAL ASTROPHYSICS FRAMEWORK
## Local Development and Deployment Guide

---

### 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 to v3.14+ (Installed on system with `pip`)

---

### 2. Single Master Start Command

You can launch both the **FastAPI Python Backend** and the **Vite React Frontend** with a single command:

```bash
npm run dev:full
```

---

### 3. Manual Step-by-Step Launch (Alternative)

#### A. Start the Python Scientific Backend
```bash
# Optional: create and activate a virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies:
pip install -r backend/requirements.txt

# Run server:
python backend/run_server.py
```
The backend API will be available at **`http://127.0.0.1:8000`**.  
Interactive OpenAPI documentation is at **`http://127.0.0.1:8000/docs`**.

#### B. Start the React Frontend
```bash
npm install
npm run dev
```
The application will open at **`http://localhost:5173/`**.

---

### 4. Running the Automated Test Suite

To run all scientific Python tests:
```bash
npm run test:backend
# or directly:
python -m unittest discover backend/tests
```

To run the end-to-end integration test against the live backend:
```bash
python backend/tests/verify_e2e.py
```

---

### 5. Verified Endpoints & Services

- **Frontend Application:** `http://localhost:5173/`
- **Backend Health Check:** `http://127.0.0.1:8000/api/health`
- **Target Resolution:** `POST http://127.0.0.1:8000/api/targets/resolve`
- **Full 13-Stage Pipeline:** `POST http://127.0.0.1:8000/api/analysis/start`
- **Real-time SSE Progress Stream:** `GET http://127.0.0.1:8000/api/analysis/{analysis_id}/stream`
- **Follow-up Photometry Ingestion:** `POST http://127.0.0.1:8000/api/followup/upload`
