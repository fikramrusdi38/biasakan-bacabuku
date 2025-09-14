const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
let books = JSON.parse(localStorage.getItem("books")) || [];
let editIndex = null; // 🔑 untuk simpan index buku yang sedang diedit

// Fungsi tampilkan bagian tertentu
function showSection(sectionId) {
  document
    .querySelectorAll(".section")
    .forEach((sec) => sec.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");

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
      <button onclick="editBook(${index})" class="btn-edit">✏️ Edit</button>
      <button onclick="removeBook(${index})" class="btn-remove">🗑️ Hapus</button>
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
  const lastPageRead = parseInt(document.getElementById("lastPageRead").value);

  if (lastPageRead > totalPages) {
    alert(
      "Halaman terakhir dibaca tidak boleh lebih besar dari jumlah halaman!"
    );
    return;
  }

  books.push({ title, author, totalPages, lastPage: lastPageRead });
  localStorage.setItem("books", JSON.stringify(books));
  bookForm.reset();
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

// ====================== 🔑 FITUR EDIT ======================
function editBook(index) {
  editIndex = index;
  const book = books[index];

  // Isi form popup edit dengan data buku
  document.getElementById("editTitle").value = book.title;
  document.getElementById("editAuthor").value = book.author;
  document.getElementById("editTotalPages").value = book.totalPages;
  document.getElementById("editLastPageRead").value = book.lastPage;

  // tampilkan popup
  document.getElementById("editPopup").style.display = "flex";
}

function saveEdit() {
  const title = document.getElementById("editTitle").value;
  const author = document.getElementById("editAuthor").value;
  const totalPages = parseInt(document.getElementById("editTotalPages").value);
  const lastPageRead = parseInt(
    document.getElementById("editLastPageRead").value
  );

  if (lastPageRead > totalPages) {
    alert(
      "Halaman terakhir dibaca tidak boleh lebih besar dari jumlah halaman!"
    );
    return;
  }

  // update data buku
  books[editIndex] = { title, author, totalPages, lastPage: lastPageRead };
  localStorage.setItem("books", JSON.stringify(books));

  closeEdit();
  renderBooks();
}

function closeEdit() {
  document.getElementById("editPopup").style.display = "none";
  editIndex = null;
}
