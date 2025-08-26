const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
let books = JSON.parse(localStorage.getItem("books")) || [];

// Fungsi tampilkan bagian tertentu
function showSection(sectionId) {
  document
    .querySelectorAll(".section")
    .forEach((sec) => sec.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");

  // Kalau buka Bacaan Saya, render ulang daftar
  if (sectionId === "listSection") {
    renderBooks();
  }
}

// Fungsi render daftar buku
function renderBooks() {
  bookList.innerHTML = "";
  if (books.length === 0) {
    bookList.innerHTML = "<p>Belum ada bacaan. Tambahkan dulu 😊</p>";
    return;
  }

  books.forEach((book, index) => {
    const sisaHalaman = book.totalPages - book.lastPage;
    const bookDiv = document.createElement("div");
    bookDiv.className = "book";
    bookDiv.innerHTML = `
      <h3>${book.title}</h3>
      <p>✍️ Penulis: ${book.author}</p>
      <p>📑 Halaman terakhir: ${book.lastPage} / ${book.totalPages}</p>
      <p>📘 Sisa halaman: ${sisaHalaman}</p>
      <button onclick="updatePage(${index}, 'add')" class="btn-update">+1 Halaman</button>
      <button onclick="updatePage(${index}, 'subtract')" class="btn-update">-1 Halaman</button>
      <button onclick="removeBook(${index})" class="btn-remove">Hapus Buku</button>
    `;
    bookList.appendChild(bookDiv);
  });

  localStorage.setItem("books", JSON.stringify(books));
}

// Tambah buku baru
bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const totalPages = parseInt(document.getElementById("totalPages").value);

  books.push({ title, author, totalPages, lastPage: 0 });
  localStorage.setItem("books", JSON.stringify(books));
  bookForm.reset();

  // setelah tambah, langsung pindah ke daftar bacaan
  showSection("listSection");
});

// Update halaman terakhir
function updatePage(index, action) {
  if (action === "add" && books[index].lastPage < books[index].totalPages) {
    books[index].lastPage++;
  } else if (action === "subtract" && books[index].lastPage > 0) {
    books[index].lastPage--;
  }
  renderBooks();
}

// Hapus buku
function removeBook(index) {
  books.splice(index, 1);
  renderBooks();
}
