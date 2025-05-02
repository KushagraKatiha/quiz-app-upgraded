from flask import Flask, request
from flask_socketio import SocketIO
import cv2
import base64
import numpy as np

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# In-memory state to track face position and warning count
prev_face_coords = None
warning_count = 0

@socketio.on('connect')
def on_connect():
    print(f"User connected: {request.sid}")


def detect_face_issues(frame):
    global prev_face_coords, warning_count

    print("my print: ", frame)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    if len(faces) == 0:
        warning_count += 1
        return "no_face"

    elif len(faces) > 1:
        warning_count += 1
        return "multiple_faces"

    else:
        (x, y, w, h) = faces[0]
        current_center = (x + w//2, y + h//2)

        if prev_face_coords is not None:
            dist = np.linalg.norm(np.array(prev_face_coords) - np.array(current_center))
            if dist > 50:  # Movement threshold
                warning_count += 1
                prev_face_coords = current_center
                return "face_moved"

        prev_face_coords = current_center
        return "ok"

@socketio.on('video_frame')
def handle_frame(data):
    print("Received frame")     ## Debugging line
    b64data = data['image']
    image_data = base64.b64decode(b64data.split(',')[1])
    np_arr = np.frombuffer(image_data, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    issue = detect_face_issues(frame)
    socketio.emit('proctor_alert', {
        'status': issue,
        'warnings': warning_count
    })

if __name__ == '__main__':
    print("Starting server...")
    socketio.run(app, host='0.0.0.0', port=5001)
