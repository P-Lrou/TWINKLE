def get_all_fingers_coords(results, frame_size_x, frame_size_y, hand, finger_name):
    # Initialize variables
    landmark = None
    landmarks = []

    # Define finger landmark indices for each finger
    fingers = {
        "pinky": [20, 19, 18, 17],
        "ring": [16, 15, 14, 13],
        "middle": [12, 11, 10, 9],
        "index": [8, 7, 6, 5]
    }

    # Check if the specified finger name is valid
    if finger_name in fingers:
        # Iterate over the specified finger's landmark indices
        for landmark_index in fingers[finger_name]:
            # Determine the landmark coordinates based on the specified hand
            if hand == "right":
                landmark = [int(results.right_hand_landmarks.landmark[landmark_index].x * frame_size_x),
                            int(results.right_hand_landmarks.landmark[landmark_index].y * frame_size_y)]
            elif hand == "left":
                landmark = [int(results.left_hand_landmarks.landmark[landmark_index].x * frame_size_x),
                            int(results.left_hand_landmarks.landmark[landmark_index].y * frame_size_y)]

            # Append the landmark coordinates to the list
            landmarks.append(landmark)
    else:
        # Print an error message if the specified finger name is not valid
        print("Error: Finger Name Doesn't Exist")

    # Return the list of landmark coordinates
    return landmarks


def get_specific_point_coords(results, frame_size_x, frame_size_y, landmark_type, landmark_index):
    landmark = None

    if landmark_type == "right":
        landmark = [int(results.right_hand_landmarks.landmark[landmark_index].x * frame_size_x),
                    int(results.right_hand_landmarks.landmark[landmark_index].y * frame_size_y)]
    elif landmark_type == "left":
        landmark = [int(results.left_hand_landmarks.landmark[landmark_index].x * frame_size_x),
                    int(results.left_hand_landmarks.landmark[landmark_index].y * frame_size_y)]
    elif landmark_type == "body":
        landmark = [int(results.pose_landmarks.landmark[landmark_index].x * frame_size_x),
                    int(results.pose_landmarks.landmark[landmark_index].y * frame_size_y)]

    return landmark
