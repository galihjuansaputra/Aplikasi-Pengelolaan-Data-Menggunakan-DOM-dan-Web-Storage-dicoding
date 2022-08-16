document.addEventListener('DOMContentLoaded', function () {
  const submitFormBuku = document.getElementById('newBookData');
  submitFormBuku.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  const submitFormSearch = document.getElementById('search-bukus');
  submitFormSearch.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
  });

  loadDataFromStorage();

});


// 
const bukus = [];
const RENDER_EVENT = 'render-buku';

// tambah data buku
function addBook() {
  const generatedID = generateId();
  const textJudul = document.getElementById('judulBuku').value;
  const textPenulis = document.getElementById('penulisBuku').value;
  const intTahun = document.getElementById('tahunBuku').value;
  const tandaBuku = document.getElementById('markBuku').checked;

  const bookObject = generateDataBuku(generatedID, textJudul, textPenulis, intTahun, tandaBuku);
  bukus.push(bookObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// fungsi generate id
function generateId() {
  return +new Date();
}

function generateDataBuku(id,title,author,year,isCompleted){
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

document.addEventListener(RENDER_EVENT, function () {
  
  const uncompletedBUKUList = document.getElementById('bukus');
  uncompletedBUKUList.innerHTML = '';
 
  const completedBUKUList = document.getElementById('completed-bukus');
  completedBUKUList.innerHTML = '';

  for (const bookItem of bukus) {
    const bukuElement = makeBuku(bookItem);
    if (!bookItem.isCompleted)
      uncompletedBUKUList.append(bukuElement);
    else
      completedBUKUList.append(bukuElement);
    
  }

});


function makeBuku(bookObject) {

  const bukuTitle = document.createElement('h2');
  bukuTitle.innerText = bookObject.title;

  const bukuAuthor = document.createElement('p');
  bukuAuthor.innerText = `Penulis: ${bookObject.author}`;

  const bukuYear = document.createElement('p');
  bukuYear.innerText = `Tahun: ${bookObject.year}`;


  const textContainer = document.createElement('div');
  textContainer.classList.add('book');
  textContainer.append(bukuTitle, bukuAuthor, bukuYear);
  textContainer.setAttribute('id', `buku-${bookObject.id}`);


  if (bookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('mark');
    undoButton.innerText = 'Tandai Belum Selesai Dibaca';
 
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(bookObject.id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('delete');
    trashButton.innerText = 'Hapus Buku';
 
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });
 
    textContainer.append(undoButton, trashButton);

  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('mark');
    checkButton.innerText = 'Tandai Selesai Dibaca';
    
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('delete');
    trashButton.innerText = 'Hapus Buku';
 
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });
    
    textContainer.append(checkButton, trashButton);
  }

  return textContainer;

}

function addTaskToCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of bukus) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeTaskFromCompleted(bookId) {
  const bukuTarget = findBookIndex(bookId);
 
  if (bukuTarget === -1) return;
 
  bukus.splice(bukuTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
 
function undoTaskFromCompleted(bookId) {
  const bukuTarget = findBook(bookId);
 
  if (bukuTarget == null) return;
 
  bukuTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in bukus) {
    if (bukus[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}


function saveData() {
    const parsed = JSON.stringify(bukus);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
}

const SAVED_EVENT = 'saved-buku';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});


function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const buku of data) {
      bukus.push(buku);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// function searchBook(term) {
//   var filteredObj = {};
//   Object.keys(localStorage)

//       .filter(function (key) {
//           return key.indexOf(term) >= 0;
//       })

//       .map(function (key) {
//           filteredObj[key] = localStorage.getItem(key);
//       });

//   return JSON.stringify(filteredObj);

// }

// console.log(searchBook());

// console.log(localStorage.getItem(STORAGE_KEY).filter());



// function searchBook(search) {
//   const bookData = localStorage.getItem(STORAGE_KEY);
//   const searchString = search.target.value;
//   const bookFiltered = bookData.filter(data =>{
//     data.title.includes(searchString);
//   })
//   console.log(bookFiltered)
// }

// const searchBar = document.getElementById('search-bukus');

// searchBar.addEventListener('keyup', (e) => {
//   const keys = Object.keys(localStorage);
//   for (let key of keys) {
//     console.log(`${key}: ${localStorage.getItem(key)}`);
// }

//   const searchString = e.target.value;
//   const filteredBukus = keys.filter(buku => {
//     buku.title.includes(searchString);
//   });
//   console.log(filteredBukus);
// });


function searchBook() {
  const searchTitle = document.getElementById('cariBuku').value.toLowerCase();
  const daftarBuku = document.getElementsByClassName('book');
  
  for (let i = 0; i < daftarBuku.length; i++) {
    const judulBuku = daftarBuku[i].firstElementChild;
    if (judulBuku.textContent.toLowerCase().includes(searchTitle)) {
      daftarBuku[i].classList.remove("hidden");
    } else {
      daftarBuku[i].classList.add("hidden");
    }
  }

}

document.getElementById('reset').addEventListener('click', loadDataFromStorage);


//   const searchForm = document.getElementById("formSearch");
//   searchForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     searchBook();
//   });

//   const resetBtn = document.querySelector(".reset-btn");
//   resetBtn.addEventListener("click", () => {
//     document.getElementById("pencarian").value = "";
//     searchBook();
//   });

// const searchBook = () => {
//   const searchInput = document.getElementById("pencarian").value.toLowerCase();
//   const bookItems = document.getElementsByClassName("item");

//   for (let i = 0; i < bookItems.length; i++) {
//     const itemTitle = bookItems[i].querySelector(".item-title");
//     if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
//       bookItems[i].classList.remove("hidden");
//     } else {
//       bookItems[i].classList.add("hidden");
//     }
//   }
// };


// const daftarBuku = document.getElementById('bukus');

// const searchBar = document.forms['search-bukus'].querySelector('input');
// searchBar.addEventListener('keyup', function(event) {

//   const term = event.target.value.toLowerCase();
//   const books = daftarBuku.firstElementChild;
//   Array.from(books).forEach(function (book) {
//     const title = book.firstElementChild.textContent; 
//     if (title.toLowerCase().indexOf(term)!= -1) {
//       book.style.display = 'block';
//     } else{
//       book.style.display = 'none';
//     }

//   })

// })



// // mendapatkan element popup msg modal

// const popUp = document.getElementById('popUp');

// // function delete
// function deleteDataBuku() {
//   popUp.removeAttribute('hidden');
// }
// document.getElementById('delete').addEventListener('click', deleteDataBuku);

// // function cancel delete
// function noDelete() {
//   popUp.setAttribute('hidden',true);  
// }
// document.getElementById('tidak').onclick = noDelete;

// // function yes delete
// function yesDelete() {
//   popUp.setAttribute('hidden',true);
// }
// document.getElementById('ya').addEventListener('click', yesDelete);