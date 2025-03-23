# Cloud Library Management System

## Overview

The Cloud Library Management System is a simple web-based application that allows users to manage a library system with features such as book management, user authentication, and cloud storage. The project is built with Flask (backend), Firebase (database), and a frontend using JavaScript, HTML, and CSS.

## Features

- **User Authentication** (Login/Register using Firebase Authentication)
- **Book Management** (Add, Update, Delete Books)
- **Cloud Storage Integration** (Store book-related data in Firebase)
- **Secure Access Control** (Firestore rules for authentication-based access)
- **Deployed for Public Use** (Users interact with a hosted version of the app)

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Flask (Python)
- **Database:** Firebase Firestore
- **Hosting:** (Specify if using Firebase Hosting, Vercel, or any other service)

## Installation and Setup

### Prerequisites

Ensure you have the following installed:

- Python (>=3.8)
- pip (Python package manager)
- Virtual environment (`venv`)

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/undispute33/bro.git
   cd bro
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   # Activate on Windows
   venv\Scripts\activate
   # Activate on macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure Firebase:

   - Create a `.env` file and add your Firebase API keys:
     ```env
     FIREBASE_API_KEY=your-api-key
     FIREBASE_AUTH_DOMAIN=your-auth-domain
     FIREBASE_PROJECT_ID=your-project-id
     FIREBASE_STORAGE_BUCKET=your-storage-bucket
     FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     FIREBASE_APP_ID=your-app-id
     ```
   - Make sure `.env` is added to `.gitignore` to keep your keys private.

5. Run the application:

   ```bash
   flask run
   ```

   The application will be available at `http://127.0.0.1:5000/`.

## Deployment

To deploy the project on the cloud:

1. **Set up Firebase Firestore Security Rules:**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /Books/{bookId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
2. **Deploy the Backend:**
   - (Specify if deploying using Firebase Functions, Heroku, Render, etc.)
3. **Restrict API Key Access (For Production):**
   - In Google Cloud Console, go to **APIs & Services > Credentials**
   - Click on your API key and **restrict it** to only your deployed domain.

## Usage Instructions

1. Register an account or log in.
2. Add books to the database.
3. Search, edit, or delete books as needed.
4. Logout securely.

## Troubleshooting

- **Getting ****`Missing or insufficient permissions`**** error?**
  - Check your Firestore security rules.
  - Ensure authentication is enabled in Firebase.
- **Cannot connect to Firebase?**
  - Verify your API keys and `.env` configuration.

## Contributing

If you would like to contribute, feel free to fork this repository and submit a pull request.

## License

This project is licensed under the MIT License.

---

Let me know if you need any modifications! 🚀

