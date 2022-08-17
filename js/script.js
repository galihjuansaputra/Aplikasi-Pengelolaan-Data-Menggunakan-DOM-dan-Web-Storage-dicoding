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


const bukus = [];
const RENDER_EVENT = 'render-buku';

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
      undoBookFromCompleted(bookObject.id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('delete');
    trashButton.innerText = 'Hapus Buku';
 
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(bookObject.id);
      
    });
    
 
    textContainer.append(undoButton, trashButton);

  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('mark');
    checkButton.innerText = 'Tandai Selesai Dibaca';
    
    checkButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('delete');
    trashButton.innerText = 'Hapus Buku';
 
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(bookObject.id);
    });
    
    textContainer.append(checkButton, trashButton);
  }

  return textContainer;

}

function addBookToCompleted (bookId) {
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

function removeBookFromCompleted(bookId) {
  const bukuTarget = findBookIndex(bookId);
  const popUp = document.getElementById('popUp');
  popUp.removeAttribute('hidden');
  const tidak = document.getElementById('tidak');
  tidak.onclick = function () {
    popUp.setAttribute('hidden', true);
  }
  const ya = document.getElementById('ya');
  ya.onclick = function () {
    if (bukuTarget === -1) return;
 
    bukus.splice(bukuTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    popUp.setAttribute('hidden', true);
  }

}
 
 
function undoBookFromCompleted(bookId) {
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
