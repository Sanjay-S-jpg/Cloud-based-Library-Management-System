// update_book.js
document.getElementById("updateBookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const bookId = document.getElementById("updateBookId").value;
  const availableStr = document.getElementById("available").value;
  const available = availableStr === "true";
  const issuedTo = document.getElementById("issuedTo").value;
  
  fetch("/api/update_book", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ book_id: bookId, available, issuedTo })
  })
  .then(response => response.text())
  .then(msg => alert(msg))
  .catch(err => console.error("Error updating book:", err));
});
