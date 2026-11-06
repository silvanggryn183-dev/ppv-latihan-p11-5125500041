import { muat, simpan } from './storage.js';

let catatan = muat();

export function semua() {
  return catatan;
}

export function tambah(judul, mk) {
  catatan.push({
    id: Date.now(),
    judul: judul,
    mk: mk,
    dibuat: new Date().toISOString(),
    disematkan: false,
  });
  simpan(catatan);
}

export function alihSemat(id) {
  for (const c of catatan) {
    if (c.id === id) c.disematkan = !c.disematkan;
  }
  simpan(catatan);
}

export function hapus(id) {
  catatan = catatan.filter((c) => c.id !== id);
  simpan(catatan);
}

export function cari(kata) {
  const k = kata.toLowerCase();
  return catatan.filter((c) => c.judul.toLowerCase().includes(k));
}