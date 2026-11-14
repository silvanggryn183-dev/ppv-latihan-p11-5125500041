export const KUNCI = 'catatan-kuliah:v1';

let cadangan = [];      // salinan di memori bila localStorage bermasalah
let tersedia = true;

const sah = (c) => c !== null && typeof c === 'object'
  && typeof c.judul === 'string' && typeof c.id === 'number';

export function muat() {
  let mentah;
  try {
    mentah = localStorage.getItem(KUNCI);
  } catch (err) {
    tersedia = false;
    console.warn('localStorage tidak tersedia:', err.name);
    return [...cadangan];
  }
  if (mentah === null) return [];
  try {
    const data = JSON.parse(mentah);
    if (!Array.isArray(data)) throw new Error('bukan array');
    return data.filter(sah);
  } catch (err) {
    console.warn('Data tersimpan rusak, dimulai dari kosong:', err.message);
    return [];
  }
}

export function simpan(daftar) {
  cadangan = [...daftar];
  try {
    localStorage.setItem(KUNCI, JSON.stringify(daftar));
    tersedia = true;
  } catch (err) {
    tersedia = false;
    console.warn('Gagal menyimpan:', err.name);
  }
}

export const penyimpananAman = () => tersedia;