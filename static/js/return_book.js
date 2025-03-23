document.getElementById("returnBookForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const bookId = document.getElementById("returnBookId").value.trim();
    
    if (!bookId) {
      alert("Please enter a book ID!");
      return;
    }
    
    // Check if book is actually issued
    const checkResponse = await fetch(`/api/check_issued_book/${bookId}`);
    const issued = await checkResponse.json();
    
    if (!issued) {
      alert("Book was never issued! Cannot return.");
      return;
    }
    
    fetch("/api/return_book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book_id: bookId })
    })
    .then(response => response.text())
    .then(msg => alert(msg))
    .catch(err => console.error("Error returning book:", err));
  });