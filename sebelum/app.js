// Catatan Kuliah — kode latihan Tugas P11-P12, Praktikum Pemrograman Visual (TB033109)
// Aplikasi ini BERFUNGSI, tetapi semua hal ditumpuk di satu berkas dan satu fungsi besar.
// Tugas Anda: rapikan menjadi modul, komponen, dan penyimpanan yang aman TANPA mengubah perilakunya.
 
var catatan = JSON.parse(localStorage.getItem('catatan-kuliah')) || [];
var kataCari = '';
 
function render() {
  var sematan = document.getElementById('sematan');
  var semua = document.getElementById('semua');
  var info = document.getElementById('info');
  sematan.innerHTML = '';
  semua.innerHTML = '';
  var hasil = [];
  for (var i = 0; i < catatan.length; i++) {
    if (catatan[i].judul.toLowerCase().indexOf(kataCari.toLowerCase()) !== -1) {
      hasil.push(catatan[i]);
    }
  }
  var jumlahSemat = 0;
  for (var j = 0; j < hasil.length; j++) {
    var c = hasil[j];
    if (c.disematkan) {
      jumlahSemat++;
      sematan.innerHTML +=
        '<div class="kartu"><small>' + c.mk + '</small><h3>' + c.judul + '</h3>' +
        '<small>' + new Date(c.dibuat).toLocaleDateString('id-ID') + '</small>' +
        '<div class="aksi"><button onclick="sematkan(' + c.id + ')">Lepas</button>' +
        '<button onclick="hapus(' + c.id + ')">Hapus</button></div></div>';
    }
    semua.innerHTML +=
      '<div class="kartu"><small>' + c.mk + '</small><h3>' + c.judul + '</h3>' +
      '<small>' + new Date(c.dibuat).toLocaleDateString('id-ID') + '</small>' +
      '<div class="aksi"><button onclick="sematkan(' + c.id + ')">' + (c.disematkan ? 'Lepas' : 'Sematkan') + '</button>' +
      '<button onclick="hapus(' + c.id + ')">Hapus</button></div></div>';
  }
  if (jumlahSemat === 0) sematan.innerHTML = '<p class="kosong">Belum ada catatan yang disematkan.</p>';
  if (hasil.length === 0) semua.innerHTML = '<p class="kosong">Tidak ada catatan.</p>';
  info.textContent = hasil.length + ' catatan, ' + jumlahSemat + ' disematkan';
  localStorage.setItem('catatan-kuliah', JSON.stringify(catatan));
}
 
function sematkan(id) {
  for (var i = 0; i < catatan.length; i++) {
    if (catatan[i].id === id) catatan[i].disematkan = !catatan[i].disematkan;
  }
  render();
}
 
function hapus(id) {
  if (!confirm('Hapus catatan ini?')) return;
  var baru = [];
  for (var i = 0; i < catatan.length; i++) {
    if (catatan[i].id !== id) baru.push(catatan[i]);
  }
  catatan = baru;
  render();
}
 
document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();
  var judul = document.getElementById('judul').value.trim();
  if (judul === '') return;
  catatan.push({ id: Date.now(), judul: judul, mk: document.getElementById('mk').value,
                 dibuat: new Date().toISOString(), disematkan: false });
  document.getElementById('judul').value = '';
  render();
});
 
document.getElementById('cari').addEventListener('input', function (e) {
  kataCari = e.target.value;
  render();
});
 
render();
