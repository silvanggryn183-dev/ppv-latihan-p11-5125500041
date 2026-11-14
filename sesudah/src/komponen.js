function buat(tag, teks, kelas) {
  const el = document.createElement(tag);
  if (kelas) el.className = kelas;
  if (teks !== undefined) el.textContent = teks;
  return el;
}

export function KartuCatatan(c) {
  const kartu = buat('div', undefined, 'kartu');
  const aksi = buat('div', undefined, 'aksi');

  const semat = buat('button', c.disematkan ? 'Lepas' : 'Sematkan');
  semat.dataset.aksi = 'semat';
  semat.dataset.id = c.id;

  const hapus = buat('button', 'Hapus');
  hapus.dataset.aksi = 'hapus';
  hapus.dataset.id = c.id;

  aksi.append(semat, hapus);
  kartu.append(
    buat('small', c.mk),
    buat('h3', c.judul),
    buat('small', new Date(c.dibuat).toLocaleDateString('id-ID')),
    aksi,
  );
  return kartu;
}

export function PesanKosong(teks) {
  return buat('p', teks, 'kosong');
}