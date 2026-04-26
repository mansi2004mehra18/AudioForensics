# 🛡️ SafeVoice AI: Real-Time Audio Forensics

> Detecting AI-cloned voices in real-time call streams using spectrogram-based deep learning.

---

## 🚨 Problem
AI can clone human voices in seconds, making traditional voice authentication unreliable during live calls.

---

## 💡 Solution
We convert live audio into spectrograms and use AI to detect hidden artifacts left by synthetic voices in real time.

## ⚙️ How It Works

### 🔄 Real-Time Pipeline

1. 🎤 Capture live audio from microphone
2. 🌐 Stream audio via WebSocket
3. ⚙️ Backend buffers audio in chunks (3s window)
4. 🔬 Convert audio → Mel-Spectrogram (STFT)
5. 🧠 CNN model predicts fraud probability
6. 🚨 Dashboard updates threat level instantly

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Web Audio API

### Backend

* FastAPI
* WebSockets
* NumPy

### AI / Signal Processing (Upcoming)

* Librosa (spectrograms)
* PyTorch (CNN model)
* Grad-CAM (explainability)

---



## 🚀 Setup Guide

### 1️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on: http://localhost:5173

---

### 2️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Runs on: http://127.0.0.1:8000

---

## 🔗 Connecting Frontend & Backend

* Frontend sends audio via WebSocket
* Backend processes and returns fraud probability
* UI updates threat level in real-time

---

## 📊 Current Status

✅ Real-time audio streaming
✅ WebSocket communication
✅ Live threat visualization

🚧 Next:

* Spectrogram generation
* ML model integration
* Autonomous response system

---

## 🎯 Future Scope

* Detect multi-language voice fraud
* Integrate with banking IVR systems
* Expand to video deepfake detection

---

## 🧠 Key Insight

AI-generated voices are **acoustically perfect**
but **spectrally flawed**

SafeVoice AI detects what human ears cannot.

---

## 👨‍💻 Author

Built as part of a hackathon project on AI security and real-time systems.
