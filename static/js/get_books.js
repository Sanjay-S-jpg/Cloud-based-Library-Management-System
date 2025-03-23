// get_books.js
window.addEventListener("DOMContentLoaded", () => {
  fetch("/api/get_books")
    .then(response => response.json())
    .then(data => {
      const booksList = document.getElementById("booksList");
      booksList.innerHTML = "";
      data.forEach((bookObj) => {
        for (const id in bookObj) {
          const book = bookObj[id];
          const li = document.createElement("li");
          li.innerText = `${book.title} by ${book.author} [${book.genre}] - Available: ${book.available}`;
          booksList.appendChild(li);
        }
      });
    })
    .catch(error => console.error("Error fetching books:", error));
});
