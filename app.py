from flask import Flask, request, jsonify, render_template
from database import add_book, get_books, issue_book, return_book, delete_book ,db

app = Flask(__name__)

# Page routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/register')
def register_page():
    return render_template('register.html')

@app.route('/student')
def student_page():
    return render_template('student.html')

@app.route('/librarian')
def librarian_page():
    return render_template('librarian.html')

# Rename these page routes
@app.route('/add_book_page')
def add_book_page():
    return render_template('add_book.html')

@app.route('/issue_book_page')  # was update_book_page
def issue_book_page():
    return render_template('issue_book.html')

@app.route('/delete_book_page')
def delete_book_page():
    return render_template('delete_book.html')

@app.route('/return_book_page')  # was issue_book_page
def return_book_page():
    return render_template('return_book.html')

@app.route('/get_books_page')
def get_books_page():
    return render_template('get_books.html')

@app.route('/logout')
def logout():
    return render_template('index.html')

@app.route('/librarianLogin')
def librarian_login():
    return render_template('librarianLogin.html')

# API endpoints (all JSON)
@app.route('/api/add_book', methods=['POST'])
def add_book_route():
    data = request.json
    return add_book(data['book_id'], data['title'], data['author'], data['genre'])

@app.route('/api/get_books', methods=['GET'])
def get_books_route():
    return jsonify(get_books())

@app.route('/api/issue_book', methods=['POST'])
def issue_book_route():
    data = request.json
    try:
        result = issue_book(
            data['book_id'],
            data.get('student_id'),
            data.get('returnDate')
        )
        return jsonify({"success": True, "message": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# Rename this route for "returning" a book (previously issue_book)
@app.route('/api/return_book', methods=['POST'])
def return_book_route():
    data = request.json
    return return_book(data['book_id'])

@app.route('/api/delete_book/<book_id>', methods=['DELETE'])
def delete_book_route(book_id):
    return delete_book(book_id)

@app.route('/api/search_books')
def search_books():
    query = request.args.get('query', '').lower()
    books_data = get_books()
    filtered = []
    for doc_dict in books_data:
        for doc_id, book in doc_dict.items():
            title = book.get('title', '').lower()
            author = book.get('author', '').lower()
            if query in title or query in author:
                filtered.append({doc_id: book})
    return jsonify(filtered)


@app.route('/api/check_book/<book_id>', methods=['GET'])
def check_book_route(book_id):
    doc = db.collection('Books').document(book_id).get()
    if not doc.exists:
        return jsonify({"exists": False}), 200
    book = doc.to_dict()
    return jsonify({
        "exists": True,
        "available": book.get("available", True),
        "issuedTo": book.get("issuedTo")
    }), 200


if __name__ == '__main__':
    app.run(debug=True)
