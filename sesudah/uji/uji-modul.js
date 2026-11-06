// uji-modul.js — pemeriksa otomatis Tugas P11. JANGAN diubah; ubah kode Anda sampai semua butir lolos.
// Struktur yang diharapkan: index.html di akar proyek, modul di folder src/, titik masuk src/main.js.
const hasil = [];
const catat = (lolos, teks) => hasil.push({ lolos, teks });
const tampil = () => {
  const ol = document.querySelector('#hasil');
  ol.replaceChildren(...hasil.map(({ lolos, teks }) => {
    const li = document.createElement('li');
    li.className = lolos ? 'lolos' : 'gagal';
    li.textContent = (lolos ? 'LOLOS  ' : 'GAGAL  ') + teks;
    return li;
  }));
  const n = hasil.filter((h) => h.lolos).length;
  document.querySelector('#ringkas').textContent = `${n} dari ${hasil.length} butir lolos`;
};
const teksBerkas = async (url) => { const r = await fetch(url); if (!r.ok) throw new Error(`${url}: ${r.status}`); return r.text(); };
 
// 1. Peta modul: telusuri import mulai dari src/main.js, cari dependensi melingkar
async function petaModul() {
  const graf = new Map();
  const akar = new URL('../src/main.js', location.href).href;
  const antre = [akar];
  while (antre.length) {
    const url = antre.shift();
    if (graf.has(url)) continue;
    const isi = await teksBerkas(url);
    const tujuan = [...isi.matchAll(/(?:import|export)[^'"]*?from\s*['"](\.{1,2}\/[^'"]+)['"]|import\s*['"](\.{1,2}\/[^'"]+)['"]/g)]
      .map((m) => new URL(m[1] || m[2], url).href);
    graf.set(url, { isi, tujuan });
    antre.push(...tujuan);
  }
  const nama = (u) => u.split('/src/')[1] || u;
  document.querySelector('#peta').textContent = [...graf].map(([u, g]) =>
    `${nama(u)}  ->  ${g.tujuan.map(nama).join(', ') || '(tidak mengimpor apa pun)'}`).join('\n');
  const melingkar = [];
  const jalan = (u, tumpuk) => {
    if (tumpuk.includes(u)) { melingkar.push([...tumpuk.slice(tumpuk.indexOf(u)), u].map(nama).join(' -> ')); return; }
    for (const t of graf.get(u)?.tujuan || []) jalan(t, [...tumpuk, u]);
  };
  jalan(akar, []);
  catat(graf.size >= 4, `Jumlah modul yang terhubung dari main.js: ${graf.size} (minimal 4)`);
  catat(melingkar.length === 0, melingkar.length ? `Dependensi melingkar: ${melingkar[0]}` : 'Tidak ada dependensi melingkar');
  return graf;
}
 
// 2. Kontrak modul state.js: data dan aturan, tanpa DOM
async function ujiState(graf) {
  const urlState = new URL('../src/state.js', location.href).href;
  const isi = graf.get(urlState)?.isi ?? await teksBerkas(urlState);
  catat(!/\b(document|window|confirm|alert|localStorage)\b/.test(isi.replace(/\/\/.*$/gm, '')),
    'state.js tidak menyentuh document, window, confirm, alert, atau localStorage');
  const S = await import(urlState);
  const wajib = ['semua', 'tambah', 'alihSemat', 'hapus', 'cari'];
  const kurang = wajib.filter((f) => typeof S[f] !== 'function');
  catat(kurang.length === 0, kurang.length ? `Ekspor fungsi belum ada: ${kurang.join(', ')}` : `Ekspor lengkap: ${wajib.join(', ')}`);
  if (kurang.length) return;
  const awal = S.semua().length;
  const judul = 'Uji-Regresi-' + Math.random().toString(36).slice(2, 8);
  S.tambah(judul, 'Animasi 2D');
  const baru = S.semua().find((c) => c.judul === judul);
  catat(S.semua().length === awal + 1 && !!baru, 'tambah() menambah satu catatan');
  if (!baru) return;
  catat(typeof baru.id === 'number' && baru.mk === 'Animasi 2D' && baru.disematkan === false &&
    !isNaN(Date.parse(baru.dibuat)), 'Catatan baru berisi id (angka), mk, dibuat (tanggal), disematkan: false');
  catat(S.cari(judul.toLowerCase()).length === 1, 'cari() tidak peka huruf besar-kecil');
  catat(S.cari('').length === S.semua().length, "cari('') mengembalikan semua catatan");
  catat(Object.values(localStorage).some((v) => v.includes(judul)), 'Perubahan tersimpan ke localStorage');
  S.alihSemat(baru.id);
  const disemat = S.semua().find((c) => c.id === baru.id)?.disematkan;
  S.alihSemat(baru.id);
  catat(disemat === true && S.semua().find((c) => c.id === baru.id)?.disematkan === false, 'alihSemat() membalik status sematan');
  S.hapus(baru.id);
  catat(S.semua().length === awal && S.cari(judul).length === 0, 'hapus() menghapus tanpa bertanya (konfirmasi urusan main.js)');
}
 
// 3. Aplikasi utuh di iframe: tanpa variabel global, tetap jalan
function ujiAplikasi() {
  return new Promise((selesai) => {
    const f = document.createElement('iframe');
    f.src = '../index.html'; f.style.cssText = 'width:100%;height:240px;border:1px solid #ccc';
    f.onload = () => setTimeout(() => {
      const w = f.contentWindow, d = f.contentDocument;
      const bocor = ['catatan', 'kataCari', 'render', 'sematkan', 'hapus'].filter((n) => n in w);
      catat(bocor.length === 0, bocor.length ? `Masih ada global di window: ${bocor.join(', ')}` : 'Tidak ada variabel/fungsi global aplikasi');
      catat(/type\s*=\s*["']module["']/.test(d.documentElement.outerHTML), 'index.html memuat skrip sebagai type="module"');
      d.querySelector('#judul').value = 'Uji-Iframe';
      d.querySelector('#form').requestSubmit();
      setTimeout(() => {
        catat(d.body.textContent.includes('Uji-Iframe') && d.querySelector('#info').textContent.trim() !== '',
          'Aplikasi berjalan: catatan baru tampil dan teks #info terisi');
        catat(!d.querySelector('[onclick]'), 'Tidak ada atribut onclick; event dipasang dari JavaScript');
        selesai();
      }, 300);
    }, 800);
    document.body.append(f);
  });
}
 
const cadangan = Object.fromEntries(Object.entries(localStorage));
try {
  const graf = await petaModul();
  await ujiState(graf);
} catch (err) {
  catat(false, 'Uji berhenti: ' + err.message);
}
try {
  await ujiAplikasi();
} catch (err) {
  catat(false, 'Aplikasi tidak bisa diuji: ' + err.message);
} finally {
  localStorage.clear();
  Object.entries(cadangan).forEach(([k, v]) => localStorage.setItem(k, v));
}
tampil();
