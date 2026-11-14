// uji-tangguh.js — pemeriksa otomatis Tugas P12. JANGAN diubah; ubah kode Anda sampai semua butir wajib lolos.
// Kontrak: src/storage.js mengekspor KUNCI, muat(), simpan(data); src/komponen.js mengekspor KartuCatatan(catatan).
const hasil = [];
const catat = (lolos, teks, opsional = false) => hasil.push({ lolos, teks, opsional });
const SAH = { id: 1, judul: 'Valid', mk: 'Animasi 2D', dibuat: '2026-11-01T00:00:00.000Z', disematkan: false };
const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));
 
function tampil() {
  document.querySelector('#hasil').replaceChildren(...hasil.map(({ lolos, teks, opsional }) => {
    const li = document.createElement('li');
    li.className = lolos ? 'lolos' : opsional ? 'info' : 'gagal';
    li.textContent = (lolos ? 'LOLOS  ' : opsional ? 'BELUM (opsional)  ' : 'GAGAL  ') + teks;
    return li;
  }));
  const wajib = hasil.filter((h) => !h.opsional);
  document.querySelector('#ringkas').textContent =
    `${wajib.filter((h) => h.lolos).length} dari ${wajib.length} butir wajib lolos`;
}
 
// Jalankan fn dengan satu metode Storage dibuat melempar galat, lalu pulihkan
async function denganStorageRusak(metode, galat, fn) {
  const asli = Storage.prototype[metode];
  Storage.prototype[metode] = () => { throw galat; };
  try { return await fn(); } finally { Storage.prototype[metode] = asli; }
}
 
async function ujiStorage(S) {
  const adaKunci = typeof S.KUNCI === 'string' && /v\d+/.test(S.KUNCI);
  catat(adaKunci, adaKunci ? `KUNCI berversi: ${S.KUNCI}` : 'storage.js belum mengekspor KUNCI berversi, mis. export const KUNCI = "catatan-kuliah:v1"');
  if (!adaKunci || typeof S.muat !== 'function' || typeof S.simpan !== 'function') {
    catat(false, 'Uji penyimpanan dilewati: perlu ekspor KUNCI, muat, dan simpan'); return false;
  }
  const skenario = [
    ['belum pernah disimpan', null, 0],
    ['JSON rusak "{rusak"', '{rusak', 0],
    ['bukan array ("teks")', '"teks"', 0],
    ['objek, bukan array', '{"a":1}', 0],
    ['data sah', JSON.stringify([SAH]), 1],
    ['array berisi item rusak', JSON.stringify([null, 5, { judul: 7 }, SAH]), 1],
  ];
  for (const [nama, isi, harap] of skenario) {
    if (isi === null) localStorage.removeItem(S.KUNCI); else localStorage.setItem(S.KUNCI, isi);
    try {
      const d = S.muat();
      catat(Array.isArray(d) && d.length === harap && d.every((c) => typeof c?.judul === 'string'),
        `muat() saat ${nama}: array berisi ${harap} catatan sah`);
    } catch (err) { catat(false, `muat() saat ${nama} melempar ${err.name}`); }
  }
  await denganStorageRusak('getItem', new DOMException('diblokir', 'SecurityError'), () => {
    try { catat(Array.isArray(S.muat()), 'muat() saat localStorage diblokir: tidak melempar, kembali array'); }
    catch (err) { catat(false, `muat() saat localStorage diblokir melempar ${err.name}`); }
  });
  S.simpan([SAH]);
  catat(JSON.parse(localStorage.getItem(S.KUNCI))?.[0]?.judul === 'Valid', 'simpan() menulis JSON ke KUNCI');
  await denganStorageRusak('setItem', new DOMException('penuh', 'QuotaExceededError'), () => {
    try { S.simpan([SAH, SAH]); catat(true, 'simpan() saat penyimpanan penuh: tidak melempar'); }
    catch (err) { catat(false, `simpan() saat penyimpanan penuh melempar ${err.name}`); }
  });
  localStorage.removeItem(S.KUNCI);
  localStorage.setItem('catatan-kuliah', JSON.stringify([SAH]));
  let pindah = false;
  try { pindah = S.muat().length === 1; } catch { /* dinilai di bawah */ }
  catat(pindah, 'Level 2: data lama di kunci "catatan-kuliah" dimigrasikan ke KUNCI baru', true);
  return true;
}
 
function ujiKomponen(K) {
  if (typeof K.KartuCatatan !== 'function') { catat(false, 'komponen.js belum mengekspor KartuCatatan'); return; }
  const el = K.KartuCatatan({ ...SAH, id: 7, judul: '<b>tebal</b>' });
  catat(el instanceof HTMLElement, 'KartuCatatan() mengembalikan elemen HTML');
  if (!(el instanceof HTMLElement)) return;
  catat(!el.querySelector('b') && el.textContent.includes('<b>tebal</b>'), 'Judul tampil sebagai teks, bukan HTML');
  catat(el.textContent.includes('Animasi 2D'), 'Kartu menampilkan mata kuliah');
  const semat = K.KartuCatatan({ ...SAH, disematkan: true }).textContent;
  catat(semat.includes('Lepas') && el.textContent.includes('Sematkan'), 'Label tombol mengikuti status sematan');
}
 
// Aplikasi utuh di iframe dengan isi penyimpanan tertentu
function bukaAplikasi() {
  return new Promise((selesai) => {
    const f = document.createElement('iframe');
    f.src = '../index.html?uji=' + Date.now(); f.style.cssText = 'width:100%;height:220px;border:1px solid #ccc';
    f.onload = async () => { await tunggu(800); selesai(f); };
    document.body.append(f);
  });
}
 
async function ujiAplikasi(KUNCI) {
  localStorage.setItem(KUNCI, JSON.stringify([{ ...SAH, judul: '<b>tebal</b>', disematkan: true }]));
  let f = await bukaAplikasi();
  const teks = f.contentDocument.body.textContent;
  catat(teks.split('<b>tebal</b>').length - 1 >= 2 && !f.contentDocument.querySelector('main b'),
    'Komponen kartu dipakai di daftar Disematkan dan Semua catatan, judul aman');
  f.remove();
  localStorage.setItem(KUNCI, '{rusak');
  f = await bukaAplikasi();
  const d = f.contentDocument;
  let jalan = false;
  if (d.querySelector('#judul') && d.querySelector('#form')) {
    d.querySelector('#judul').value = 'Pulih setelah rusak';
    d.querySelector('#form').requestSubmit();
    await tunggu(300);
    jalan = d.body.textContent.includes('Pulih setelah rusak') && d.querySelector('#info').textContent.trim() !== '';
  }
  catat(jalan, 'Data rusak: aplikasi tetap terbuka dan catatan baru bisa ditambah');
  f.remove();
}
 
const cadangan = Object.fromEntries(Object.entries(localStorage));
localStorage.clear();
const bagian = [
  ['penyimpanan', async () => (await ujiStorage(await import('../src/storage.js'))) &&
    ujiAplikasi((await import('../src/storage.js')).KUNCI)],
  ['komponen', async () => ujiKomponen(await import('../src/komponen.js'))],
];
for (const [nama, jalankan] of bagian) {
  try { await jalankan(); } catch (err) { catat(false, `Uji ${nama} berhenti: ${err.message}`); }
}
localStorage.clear();
Object.entries(cadangan).forEach(([k, v]) => localStorage.setItem(k, v));
tampil();
