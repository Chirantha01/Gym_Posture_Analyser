GYMPRO - Gym Posture Analysis Mobile Application 📱💪

GYMPRO is a mobile application designed to improve workout safety and efficiency by analyzing and providing real-time feedback on workout posture. It aims to prevent injuries, motivate proper form, and track users' workout statistics over time.

Table of Contents
About the Project
Features
Tech Stack
Getting Started
Installation
Usage
Model Details
Data Collection and Processing
Project Structure
Roadmap
Contributing
License
Contact
About the Project
The primary goal of GYMPRO is to provide real-time posture correction feedback to users during exercises, helping them avoid injuries and optimize their workouts. The app focuses on 5 key exercises, targeting major muscle groups.

Features
Pose Analysis and Feedback: Real-time analysis of user posture with corrective suggestions.
Workout Tracking: Monitor and record exercise performance and progress.
Dashboard Visualization: View workout statistics and improvements over time.
User-friendly Interface: Easy-to-navigate UI with engaging feedback visuals.
Tech Stack
Frontend: React Native, JavaScript
Machine Learning: MoveNet Lightning (SinglePose 256x256)
Backend: REST API
Database: MongoDB (NoSQL)
Getting Started
Follow these instructions to set up and run the project locally.

Prerequisites
Node.js (version 20)
React Native CLI
MongoDB or MongoDB Atlas (for backend storage)
Installation
Clone the repo:
bash
Copy code
git clone https://github.com/your-username/gympro.git
Install dependencies:
bash
Copy code
cd gympro
npm install
Run the application:
bash
Copy code
npm start
Usage
Open the app on your mobile device.
Start a workout session and select an exercise.
GYMPRO will analyze your posture and provide instant feedback and corrections.
Model Details
The posture analysis model uses MoveNet Lightning (SinglePose 256x256), a fast and efficient model for real-time body landmark detection.

Supported Exercises:

Bicep Curls (Arms)
Squats (Legs)
Push-Ups (Chest)
Lat Pull-Downs (Back)
Planks (Abs)
Model Architecture:

Simple neural network using Adam optimizer and Cross-Entropy Loss.
Confusion matrices to evaluate model performance on each exercise.
Data Collection and Processing
The dataset includes both dynamic and static posture data:

Dynamic Exercises: Custom-collected data for exercises.
Static Exercises: Web-scraped images for postures (e.g., planks).
Data is processed into a 256x256 padded format with 17 landmark points in the (x, y, probability) format.

Project Structure
plaintext
Copy code
├── src
│   ├── components        # UI components
│   ├── models            # ML models
│   ├── services          # API calls
│   └── utils             # Utility functions
├── data                  # Dataset
├── config                # Configuration files
└── README.md
Roadmap
 Real-time posture feedback
 Integration of MoveNet Lightning
 Dashboard for workout visualization
 Add additional exercises and muscle groups
 Improve corrective feedback with customizable settings
 Enable social sharing of workout progress
Contributing
We welcome contributions to enhance GYMPRO! Please check out the CONTRIBUTING.md for guidelines.

License
Distributed under the MIT License. See LICENSE for more information.

Contact
For questions or feedback, feel free to reach out:

Email: your-email@example.com
GitHub: your-username
Thank you for using GYMPRO! We hope it helps you achieve your fitness goals safely and effectively! 💪