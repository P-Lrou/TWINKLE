import mediapipe as mp
import cv2
import socketio
import subprocess
import time
import math

p = subprocess.Popen(["node", "server.js"])

time.sleep(2)

# Create Socket.io Object
sio = socketio.Client()


# Connexion Event
@sio.event
def connect():
    print("Connected to the Socket.IO server")


# Disconnection Event
@sio.event
def disconnect():
    print("Disconnected from the Socket.IO server")


# Socket server connexion
sio.connect('http://localhost:3000')

mp_drawing = mp.solutions.drawing_utils
mp_holistic = mp.solutions.holistic
mp_mesh_connections = mp.solutions.face_mesh_connections


def main():
    cap = cv2.VideoCapture(0)
    frame_size_X = 1920
    frame_size_Y = 1080
    count = None

    # Initiate holistic model here, within the scope of the main function
    holistic = mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    while cap.isOpened():
        ret, frame = cap.read()
        frame = cv2.flip(frame, 1)
        frame = cv2.resize(frame, (1920, 1080))
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = holistic.process(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # & 2. Right hand // Left if Camera is flip
        mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
                                  mp_drawing.DrawingSpec(color=(80, 22, 10), thickness=2, circle_radius=4),
                                  mp_drawing.DrawingSpec(color=(80, 44, 121), thickness=2, circle_radius=2)
                                  )

        # & 3. Left Hand // Right if Camera is flip
        mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
                                  mp_drawing.DrawingSpec(color=(121, 22, 76), thickness=2, circle_radius=4),
                                  mp_drawing.DrawingSpec(color=(121, 44, 250), thickness=2, circle_radius=2)
                                  )

        if results.left_hand_landmarks:
            h, w, _ = frame.shape
            left_hand_coords = [int(results.left_hand_landmarks.landmark[9].x * frame_size_X),
                                int(results.left_hand_landmarks.landmark[9].y * frame_size_Y)]

            sio.emit('left_hand_coords', left_hand_coords)

        if results.right_hand_landmarks:
            h, w, _ = frame.shape
            right_hand_coords = [int(results.right_hand_landmarks.landmark[9].x * frame_size_X),
                                 int(results.right_hand_landmarks.landmark[9].y * frame_size_Y)]

            sio.emit('right_hand_coords', right_hand_coords)

        if results.pose_landmarks:
            h, w, _ = frame.shape
            head_coords = [int(results.pose_landmarks.landmark[0].x * frame_size_X),
                           int(results.pose_landmarks.landmark[0].y * frame_size_Y)]

            sio.emit('head_coords', head_coords)

        if results.right_hand_landmarks and results.left_hand_landmarks:
            h, w, _ = frame.shape
            right_pinky_top = [int(results.right_hand_landmarks.landmark[20].x * frame_size_X),
                               int(results.right_hand_landmarks.landmark[20].y * frame_size_Y)]
            left_pinky_top = [int(results.left_hand_landmarks.landmark[20].x * frame_size_X),
                              int(results.left_hand_landmarks.landmark[20].y * frame_size_Y)]
            right_pinky_top_second = [int(results.right_hand_landmarks.landmark[19].x * frame_size_X),
                                      int(results.right_hand_landmarks.landmark[19].y * frame_size_Y)]
            left_pinky_top_second = [int(results.left_hand_landmarks.landmark[19].x * frame_size_X),
                                     int(results.left_hand_landmarks.landmark[19].y * frame_size_Y)]
            right_pinky_bottom_second = [int(results.right_hand_landmarks.landmark[18].x * frame_size_X),
                                         int(results.right_hand_landmarks.landmark[18].y * frame_size_Y)]
            left_pinky_bottom_second = [int(results.left_hand_landmarks.landmark[18].x * frame_size_X),
                                        int(results.left_hand_landmarks.landmark[18].y * frame_size_Y)]
            right_pinky_bottom = [int(results.right_hand_landmarks.landmark[17].x * frame_size_X),
                                  int(results.right_hand_landmarks.landmark[17].y * frame_size_Y)]
            left_pinky_bottom = [int(results.left_hand_landmarks.landmark[17].x * frame_size_X),
                                 int(results.left_hand_landmarks.landmark[17].y * frame_size_Y)]

            right_ring_top = [int(results.right_hand_landmarks.landmark[16].x * frame_size_X),
                              int(results.right_hand_landmarks.landmark[16].y * frame_size_Y)]
            left_ring_top = [int(results.left_hand_landmarks.landmark[16].x * frame_size_X),
                             int(results.left_hand_landmarks.landmark[16].y * frame_size_Y)]
            right_ring_top_second = [int(results.right_hand_landmarks.landmark[15].x * frame_size_X),
                                     int(results.right_hand_landmarks.landmark[15].y * frame_size_Y)]
            left_ring_top_second = [int(results.left_hand_landmarks.landmark[15].x * frame_size_X),
                                    int(results.left_hand_landmarks.landmark[15].y * frame_size_Y)]
            right_ring_bottom_second = [int(results.right_hand_landmarks.landmark[14].x * frame_size_X),
                                        int(results.right_hand_landmarks.landmark[14].y * frame_size_Y)]
            left_ring_bottom_second = [int(results.left_hand_landmarks.landmark[14].x * frame_size_X),
                                       int(results.left_hand_landmarks.landmark[14].y * frame_size_Y)]
            right_ring_bottom = [int(results.right_hand_landmarks.landmark[13].x * frame_size_X),
                                 int(results.right_hand_landmarks.landmark[13].y * frame_size_Y)]
            left_ring_bottom = [int(results.left_hand_landmarks.landmark[13].x * frame_size_X),
                                int(results.left_hand_landmarks.landmark[13].y * frame_size_Y)]

            right_middle_top = [int(results.right_hand_landmarks.landmark[12].x * frame_size_X),
                                int(results.right_hand_landmarks.landmark[12].y * frame_size_Y)]
            left_middle_top = [int(results.left_hand_landmarks.landmark[12].x * frame_size_X),
                               int(results.left_hand_landmarks.landmark[12].y * frame_size_Y)]
            right_middle_top_second = [int(results.right_hand_landmarks.landmark[11].x * frame_size_X),
                                       int(results.right_hand_landmarks.landmark[11].y * frame_size_Y)]
            left_middle_top_second = [int(results.left_hand_landmarks.landmark[11].x * frame_size_X),
                                      int(results.left_hand_landmarks.landmark[11].y * frame_size_Y)]
            right_middle_bottom_second = [int(results.right_hand_landmarks.landmark[10].x * frame_size_X),
                                          int(results.right_hand_landmarks.landmark[10].y * frame_size_Y)]
            left_middle_bottom_second = [int(results.left_hand_landmarks.landmark[10].x * frame_size_X),
                                         int(results.left_hand_landmarks.landmark[10].y * frame_size_Y)]
            right_middle_bottom = [int(results.right_hand_landmarks.landmark[9].x * frame_size_X),
                                   int(results.right_hand_landmarks.landmark[9].y * frame_size_Y)]
            left_middle_bottom = [int(results.left_hand_landmarks.landmark[9].x * frame_size_X),
                                  int(results.left_hand_landmarks.landmark[9].y * frame_size_Y)]

            right_index_top = [int(results.right_hand_landmarks.landmark[8].x * frame_size_X),
                               int(results.right_hand_landmarks.landmark[8].y * frame_size_Y)]
            left_index_top = [int(results.left_hand_landmarks.landmark[8].x * frame_size_X),
                              int(results.left_hand_landmarks.landmark[8].y * frame_size_Y)]
            right_index_top_second = [int(results.right_hand_landmarks.landmark[7].x * frame_size_X),
                                      int(results.right_hand_landmarks.landmark[7].y * frame_size_Y)]
            left_index_top_second = [int(results.left_hand_landmarks.landmark[7].x * frame_size_X),
                                     int(results.left_hand_landmarks.landmark[7].y * frame_size_Y)]
            right_index_bottom_second = [int(results.right_hand_landmarks.landmark[6].x * frame_size_X),
                                         int(results.right_hand_landmarks.landmark[6].y * frame_size_Y)]
            left_index_bottom_second = [int(results.left_hand_landmarks.landmark[6].x * frame_size_X),
                                        int(results.left_hand_landmarks.landmark[6].y * frame_size_Y)]
            right_index_bottom = [int(results.right_hand_landmarks.landmark[5].x * frame_size_X),
                                  int(results.right_hand_landmarks.landmark[5].y * frame_size_Y)]
            left_index_bottom = [int(results.left_hand_landmarks.landmark[5].x * frame_size_X),
                                 int(results.left_hand_landmarks.landmark[5].y * frame_size_Y)]

            if (right_pinky_top[1] < right_pinky_top_second[1] < right_pinky_bottom_second[1] < right_pinky_bottom[
                1] and
                    left_pinky_top[1] < left_pinky_top_second[1] < left_pinky_bottom_second[1] < left_pinky_bottom[
                        1] and
                    right_ring_top[1] < right_ring_top_second[1] < right_ring_bottom_second[1] < right_ring_bottom[
                        1] and
                    left_ring_top[1] < left_ring_top_second[1] < left_ring_bottom_second[1] < left_ring_bottom[1] and
                    right_middle_top[1] < right_middle_top_second[1] < right_middle_bottom_second[1] <
                    right_middle_bottom[1] and
                    left_middle_top[1] < left_middle_top_second[1] < left_middle_bottom_second[1] < left_middle_bottom[
                        1] and
                    right_index_top[1] < right_index_top_second[1] < right_index_bottom_second[1] < right_index_bottom[
                        1] and
                    left_index_top[1] < left_index_top_second[1] < left_index_bottom_second[1] < left_index_bottom[1]
            ):

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
