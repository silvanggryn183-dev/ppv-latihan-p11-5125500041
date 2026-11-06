const KUNCI = 'catatan-kuliah';

export function muat() {
  return JSON.parse(localStorage.getItem(KUNCI)) || [];
}

export function simpan(daftar) {
  localStorage.setItem(KUNCI, JSON.stringify(daftar));
}