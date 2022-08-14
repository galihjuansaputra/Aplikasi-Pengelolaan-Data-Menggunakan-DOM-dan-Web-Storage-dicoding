// mendapatkan element popup msg modal
const popUp = document.getElementById('popUp');

// function delete
function deleteDataBuku() {
  popUp.removeAttribute('hidden');
}
document.getElementById('delete').onclick = deleteDataBuku;

// function cancel delete
function noDelete() {
  popUp.setAttribute('hidden',true);  
}
document.getElementById('tidak').onclick = noDelete;

// function yes delete
function yesDelete() {
  popUp.setAttribute('hidden',true);
}
document.getElementById('ya').addEventListener('click', yesDelete);


// DIATAS KODE ADALAH KODE JS, BELAJARNYA DI BAWAH VVVV

// Penggunaan Custom Event

// window.addEventListener('load', function() {
//   const tombol = document.getElementById('tombol');
//   tombol.addEventListener('changeCaption', customEventHandler);
//   tombol.addEventListener('click', function() {});
// });

// function customEventHandler(ev) {
//   console.log('Event ' + ev.type + ' telah dijalankan');
//   const caption = document.getElementById('caption');
//   caption.innerText = 'Anda telah membangkitkan custom event';
// }

// tombol.addEventListener('click', function () {
//   tombol.dispatchEvent(changeCaption);
// });


const dataBuku = document.getElementById('dataBuku');
console.log(dataBuku);

const mark = document.getElementById('tandai');
console.log(mark);
// mark.innerText = "Memanipulasi Data";



let objBuku = {
    id: 3657848524,
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K Rowling',
    year: 1997,
    isComplete: false,
  }

  console.log(objBuku);