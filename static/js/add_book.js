// add_book.js
document.getElementById("addBookForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const bookId = document.getElementById("bookId").value;
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const genre = document.getElementById("genre").value;
  
  // Check if book ID already exists
  const checkResponse = await fetch(`/api/check_book/${bookId}`);
  const exists = await checkResponse.json();
  
  if (exists) {
    alert("Book ID already exists! Choose a different ID.");
    return;
  }
  
  fetch("/api/add_book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ book_id: bookId, title, author, genre })
  })
  .then(response => response.text())
  .then(msg => alert(msg))
  .catch(err => console.error("Error adding book:", err));
});
