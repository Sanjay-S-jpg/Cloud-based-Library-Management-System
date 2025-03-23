// delete_book.js
document.getElementById("deleteBookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const bookId = document.getElementById("deleteBookId").value;
  
  fetch(`/api/delete_book/${bookId}`, { method: "DELETE" })
  .then(response => response.text())
  .then(msg => alert(msg))
  .catch(err => console.error("Error deleting book:", err));
});
