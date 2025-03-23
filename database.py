import firebase_admin
from firebase_admin import credentials, firestore, initialize_app
from datetime import datetime
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Load Firebase credentials from .env
firebase_json_path = os.getenv("FIREBASE_CREDENTIALS")
cred = credentials.Certificate(firebase_json_path)
firebase_admin.initialize_app(cred)

db = firestore.client()

def add_book(book_id, title, author, genre):
    book_ref = db.collection('Books').document(book_id)
    
    if book_ref.get().exists:
        return {"success": False, "message": f"Book with ID '{book_id}' already exists!"}, 400

    book_ref.set({
        'title': title,
        'author': author,
        'genre': genre,
        'available': True,
        'issuedTo': None,
        'issuedDate': None,
        'returnDate': None,
        'fineAmount': 0
    })
    
    return {"success": True, "message": f"Book '{title}' added successfully!"}, 200


def get_books():
    books_ref = db.collection('Books').stream()
    return [{doc.id: doc.to_dict()} for doc in books_ref]

def issue_book(book_id, student_id, return_date):
    book_ref = db.collection("Books").document(book_id)
    book = book_ref.get()

    if not book.exists:
        raise ValueError(f"Book with ID '{book_id}' does not exist!")

    book_data = book.to_dict()

    # Check if the book is already issued
    if not book_data.get("available", True):
        raise ValueError(f"Book '{book_id}' is already issued to Student ID: {book_data.get('issuedTo')}!")

    # Proceed with issuing the book
    book_ref.update({
        "issuedTo": student_id,
        "issuedDate": firestore.SERVER_TIMESTAMP,  # Set current timestamp automatically
        "returnDate": return_date,  # Due date provided by the librarian (should be in 'YYYY-MM-DD' format)
        "available": False
    })
    
    return f"Book '{book_id}' issued successfully to Student '{student_id}' with return date {return_date}."

def return_book(book_id):
    book_ref = db.collection('Books').document(book_id)
    doc = book_ref.get()

    if not doc.exists:
        return {"success": False, "message": f"No such book with ID '{book_id}'."}, 400

    book_data = doc.to_dict()

    if not book_data.get("issuedTo"):
        return {"success": False, "message": f"Book '{book_id}' was never issued, so it cannot be returned!"}, 400

    stored_return_date = book_data.get('returnDate')
    if stored_return_date:
        try:
            return_dt = datetime.strptime(stored_return_date, "%Y-%m-%d")
            today = datetime.now()
            if today.date() > return_dt.date():
                days_late = (today.date() - return_dt.date()).days
                fine = 5 * days_late
                book_ref.update({'fineAmount': fine})
                msg = f"Book returned late by {days_late} day(s). Fine = Rs {fine}."
            else:
                msg = "Book returned on time. No fine."
        except ValueError:
            msg = "Invalid returnDate format in Firestore."
    else:
        return {"success": False, "message": "No return date found. Cannot calculate fine."}, 400

    book_ref.update({
        'available': True,
        'issuedTo': None,
        'issuedDate': None,
        'returnDate': None
    })

    return {"success": True, "message": f"Book '{book_id}' returned. {msg}"}, 200


def delete_book(book_id):
    book_ref = db.collection('Books').document(book_id)
    book = book_ref.get()

    if not book.exists:
        return {"success": False, "message": f"Book ID '{book_id}' does not exist!"}
    
    book_ref.delete()
    return {"success": True, "message": f"Book ID '{book_id}' deleted successfully!"}
