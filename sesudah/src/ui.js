import { KartuCatatan, PesanKosong } from './komponen.js';

export function render(hasil) {
  const sematan = document.getElementById('sematan');
  const semua = document.getElementById('semua');
  const info = document.getElementById('info');

  const disemat = hasil.filter((c) => c.disematkan);

  sematan.replaceChildren(
    ...(disemat.length ? disemat.map(KartuCatatan)
                       : [PesanKosong('Belum ada catatan yang disematkan.')]));
  semua.replaceChildren(
    ...(hasil.length ? hasil.map(KartuCatatan)
                     : [PesanKosong('Tidak ada catatan.')]));

  info.textContent = hasil.length + ' catatan, ' + disemat.length + ' disematkan';
}