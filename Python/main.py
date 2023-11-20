import mediapipe as mp
import cv2
import socketio
import subprocess
import time
import math

from get_position import *


def main():
    # Start the Node.js server
    p = subprocess.Popen(["node", "../server.js"])

    # Wait for the server to initialize
    time.sleep(2)

    # Create Socket.io Object
    sio = socketio.Client()

    # Connection Event
    @sio.event
    def connect():
        print("Connected to the Socket.IO server")

    # Disconnection Event
    @sio.event
    def disconnect():
        print("Disconnected from the Socket.IO server")

    # Socket server connection
    sio.connect('http://localhost:3000')

    mp_holistic = mp.solutions.holistic

    cap = cv2.VideoCapture(0)
    frame_size_x = 1920
    frame_size_y = 1080
    count = None

    # Initialize holistic model
    holistic = mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    while cap.isOpened():
        ret, frame = cap.read()
        frame = cv2.flip(frame, 1)
        frame = cv2.resize(frame, (1920, 1080))
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = holistic.process(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        if results.left_hand_landmarks:
            h, w, _ = frame.shape
            left_hand_coords = [int(results.left_hand_landmarks.landmark[9].x * frame_size_x),
                                int(results.left_hand_landmarks.landmark[9].y * frame_size_y)]

            sio.emit('left_hand_coords', left_hand_coords)

        if results.right_hand_landmarks:
            h, w, _ = frame.shape
            right_hand_coords = [int(results.right_hand_landmarks.landmark[9].x * frame_size_x),
                                 int(results.right_hand_landmarks.landmark[9].y * frame_size_y)]

            sio.emit('right_hand_coords', right_hand_coords)

        if results.pose_landmarks:
            h, w, _ = frame.shape
            head_coords = [int(results.pose_landmarks.landmark[0].x * frame_size_x),
                           int(results.pose_landmarks.landmark[0].y * frame_size_y)]

            sio.emit('head_coords', head_coords)

        if results.right_hand_landmarks and results.left_hand_landmarks:
            h, w, _ = frame.shape
            right_pinky = get_all_fingers_coords(results, frame_size_x, frame_size_y, 'right', 'pinky')
            right_ring = get_all_fingers_coords(results, frame_size_x, frame_size_y, 'right', 'ring')
            right_middle = get_all_fingers_coords(results, frame_size_x, frame_size_y, 'right', 'middle')
            right_index = get_all_fingers_coords(results, frame_size_x, frame_size_y, 'right', 'index')

            left_pinky = get_all_fingers_coords(results, frame_size_x, frame_size_y, 'left', 'pinky')
            left_ring = get_all_fingers_coords(results, frame_size_x, frame_size_y, 'left', 'ring')
            left_middle = get_all_fingers_coords(results, frame_size_x, frame_size_y, 'left', 'middle')
            left_index = get_all_fingers_coords(results, frame_size_x, frame_size_y, 'left', 'index')

            if (right_pinky[0][1] < right_pinky[1][1] < right_pinky[2][1] < right_pinky[3][1] and
                    left_pinky[0][1] < left_pinky[1][1] < left_pinky[2][1] < left_pinky[3][1] and
                    right_ring[0][1] < right_ring[1][1] < right_ring[2][1] < right_ring[3][1] and
                    left_ring[0][1] < left_ring[1][1] < left_ring[2][1] < left_ring[3][1] and
                    right_middle[0][1] < right_middle[1][1] < right_middle[2][1] < right_middle[3][1] and
                    left_middle[0][1] < left_middle[1][1] < left_middle[2][1] < left_middle[3][1] and
                    right_index[0][1] < right_index[1][1] < right_index[2][1] < right_index[3][1] and
                    left_index[0][1] < left_index[1][1] < left_index[2][1] < left_index[3][1]):

                if count is not None:
                    count = count + 1
                else:
                    count = 0

                if count > 15:
                    sio.emit('clap', True)
                    count = 0
            else:
                count = 0

        cv2.imshow('Raw Webcam Feed', image)

        if cv2.waitKey(10) & 0xFF == ord('q'):
            p.kill()
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
