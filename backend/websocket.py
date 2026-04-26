from fastapi import APIRouter, WebSocket
import numpy as np
import random

router = APIRouter()

@router.websocket("/ws/audio")
async def audio_ws(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")

    try:
        while True:
            data = await websocket.receive_bytes()

            audio = np.frombuffer(data, dtype=np.int16)

            # TEMP fake prediction
            fraud_score = random.uniform(0, 1)

            await websocket.send_json({
                "fraud": fraud_score,
                "status": "FAKE" if fraud_score > 0.7 else "REAL"
            })

    except Exception as e:
        print("Disconnected", e)