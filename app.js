/**
 * GPdI Warta Jemaat Digital - Main Interactive Controller & Cloud Database Client
 */

// 30 Days in Milliseconds
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Global State
let APP_DB = {
  church: {
    name: "GPdI Gosyen Kaloran",
    denomination: "Gereja Pantekosta di Indonesia",
    headerTop: "GPdI Gosyen Kaloran",
    headerBottom: "Warta Jemaat",
    mapsUrl: "https://maps.app.goo.gl/CNYqT17tYnc58aD1A",
    pin: "gosyen123"
  },
  visibility: {
    warta: true,
    jadwalIbadah: true,
    jadwalPersekutuan: true,
    dokumentasi: true,
    renungan: true,
    maps: true
  },
  warta: {
    editionDate: "November 2026",
    subtitle: "Edisi Ibadah Raya & Perjamuan Kudus",
    imageUrl: "./assets/warta-sample.png",
    updatedAt: "November 2026",
    createdAt: Date.now(), // Timestamp for 30-day auto-cleanup
    isExpired: false
  },
  jadwalIbadah: [
    { id: "j1", hari: "Minggu", jam: "06.00 WIB", nama: "Ibadah Raya", keterangan: "Setiap Minggu" },
    { id: "j2", hari: "Minggu", jam: "06.00 WIB", nama: "Ibadah Perjamuan Kudus", keterangan: "Tiap Minggu Pertama" },
    { id: "j3", hari: "Minggu", jam: "09.00 WIB", nama: "Sekolah Minggu", keterangan: "Setiap Minggu" },
    { id: "j4", hari: "Rabu", jam: "15.00 WIB", nama: "Ibadah Wanita", keterangan: "Setiap Rabu" },
    { id: "j5", hari: "Kamis", jam: "19.00 WIB", nama: "Ibadah Pria", keterangan: "Tiap Kamis Ke-4" },
    { id: "j6", hari: "Sabtu", jam: "18.30 WIB", nama: "Ibadah Pemuda Remaja", keterangan: "Setiap Sabtu" }
  ],
  jadwalPersekutuan: [
    { id: "p1", nama: "MEZBAH KELUARGA RAYON", deskripsi: "Rayon 1 (Senin) | Rayon 2 (Rabu)", waktu: "19.00 WIB", icon: "groups" },
    { id: "p2", nama: "KEBAKTIAN WANITA (PELWAP)", deskripsi: "Balson Gedung Gereja • Pdt. Ibu Nani", waktu: "16.00 WIB", icon: "favorite_border" },
    { id: "p3", nama: "GERAKAN KEBERSIHAN GEREJA", deskripsi: "Jumat bersama segenap jemaat", waktu: "09.00 WIB", icon: "cleaning_services" }
  ],
  dokumentasi: [
    {
      id: "doc_f1",
      name: "Ibadah Raya & Perjamuan Kudus",
      date: "Oktober 2026",
      photos: [
        { id: "ph1", title: "Suasana Ibadah", url: "./assets/warta-sample.png" }
      ]
    },
    {
      id: "doc_f2",
      name: "Pelayanan Wanita (PELWAP)",
      date: "Oktober 2026",
      photos: []
    },
    {
      id: "doc_f3",
      name: "Pemuda & Remaja Gosyen",
      date: "September 2026",
      photos: []
    }
  ],
  renungan: {
    folders: [
      {
        id: "root_2026",
        name: "Tahun 2026",
        parentId: null,
        folders: [
          { id: "f_nov_2026", name: "November 2026", parentId: "root_2026", folders: [] },
          { id: "f_okt_2026", name: "Oktober 2026", parentId: "root_2026", folders: [] }
        ]
      }
    ],
    articles: [
      {
        id: "art_1",
        folderId: "f_nov_2026",
        title: "Kasih Karunia yang Melimpah",
        date: "1 November 2026",
        ayat: "Efesus 2:8-9",
        konten: "Sebab karena kasih karunia kamu diselamatkan oleh iman; itu bukan hasil usahamu, tetapi pemberian Allah, itu bukan hasil pekerjaanmu: jangan ada orang yang memegahkan diri. Marilah kita senantiasa bersyukur atas anugerah keselamatan yang kekal di dalam Kristus Yesus.",
        imageUrl: ""
      },
      {
        id: "art_2",
        folderId: "f_okt_2026",
        title: "Setia dalam Perkara Kecil",
        date: "25 Oktober 2026",
        ayat: "Lukas 16:10",
        konten: "Barangsiapa setia dalam perkara-perkara kecil, ia setia juga dalam perkara-perkara besar. Kesetiaan kita diuji dari hal-hal sederhana dalam kehidupan sehari-hari.",
        imageUrl: ""
      }
    ]
  },
  cloudConfig: {
    provider: "Firebase Realtime Database",
    apiUrl: "https://wartajemaat-gpdigosyen-default-rtdb.asia-southeast1.firebasedatabase.app/data.json",
    syncEnabled: true
  }
};

let currentZoom = 1;
let currentRenunganFolderId = "root_2026";
let currentCollageCanvas = null;

// Day ordering helper
const DAY_ORDER = { "Minggu": 1, "Senin": 2, "Selasa": 3, "Rabu": 4, "Kamis": 5, "Jumat": 6, "Sabtu": 7 };

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  setupKeyboardShortcuts();
});

// Initialize App & Fetch Data from Cloud / API
async function initApp() {
  await loadDatabase();
  checkWartaAutoExpiry();
  renderAll();
}

// 30-Day Auto Cleanup for Warta Jemaat
function checkWartaAutoExpiry() {
  if (APP_DB.warta && APP_DB.warta.createdAt) {
    const age = Date.now() - APP_DB.warta.createdAt;
    if (age > THIRTY_DAYS_MS) {
      console.warn("Warta jemaat sudah berusia lebih dari 30 hari. Menghapus warta kedaluwarsa...");
      APP_DB.warta.imageUrl = "";
      APP_DB.warta.isExpired = true;
      APP_DB.warta.editionDate = "Warta Kedaluwarsa (> 30 Hari)";
      APP_DB.warta.subtitle = "Silakan pengelola mengunggah lembar warta pekan terbaru";
      saveDatabase();
    }
  }
}

async function loadDatabase() {
  // 1. Try Cloud Database First if configured (Direct Cloud REST / Firebase)
  if (APP_DB.cloudConfig && APP_DB.cloudConfig.apiUrl) {
    try {
      const cloudRes = await fetch(APP_DB.cloudConfig.apiUrl);
      if (cloudRes.ok) {
        const cloudData = await cloudRes.json();
        if (cloudData && typeof cloudData === "object" && cloudData.church) {
          APP_DB = { ...APP_DB, ...cloudData };
          saveToLocalMirror();
          console.log("Synchronized from Cloud Database ✓");
          return;
        }
      }
    } catch (e) {
      console.log("Cloud DB fetch standby (will try server/local)", e);
    }
  }

  // 2. Try Server REST API (Local or Tunnel)
  try {
    const res = await fetch("/api/data");
    if (res.ok) {
      const data = await res.json();
      APP_DB = { ...APP_DB, ...data };
      console.log("Loaded data from Server API");
      saveToLocalMirror();
      return;
    }
  } catch (err) {
    console.log("Server API standby", err);
  }

  // 3. Fallback: Browser LocalStorage Mirror
  const local = localStorage.getItem("gpdi_cloud_db");
  if (local) {
    try {
      APP_DB = JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
  }
}

async function saveDatabase() {
  saveToLocalMirror();

  // 1. Save to Cloud Database (Firebase Realtime Database / Supabase REST)
  if (APP_DB.cloudConfig && APP_DB.cloudConfig.apiUrl) {
    try {
      await fetch(APP_DB.cloudConfig.apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(APP_DB)
      });
      console.log("Saved directly to Cloud Database ✓");
    } catch (err) {
      console.log("Cloud DB PUT standby:", err);
    }
  }

  // 2. Save to Server REST API
  try {
    await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(APP_DB)
    });
  } catch (err) {
    console.log("Server API save standby");
  }

  renderAll();
}

function saveToLocalMirror() {
  try {
    localStorage.setItem("gpdi_cloud_db", JSON.stringify(APP_DB));
  } catch (e) {
    console.warn("Storage quota exceeded", e);
  }
}

// Render All Components
function renderAll() {
  const vis = APP_DB.visibility || {
    warta: true,
    jadwalIbadah: true,
    jadwalPersekutuan: true,
    dokumentasi: true,
    renungan: true,
    maps: true
  };

  renderHeaderAndHero();

  // 1. Warta Jemaat (Date Card & Sheet)
  const wartaDateCard = document.getElementById("wartaDateCard");
  const wartaSec = document.getElementById("wartaSection");
  if (wartaDateCard) wartaDateCard.style.display = vis.warta !== false ? "" : "none";
  if (wartaSec) wartaSec.style.display = vis.warta !== false ? "" : "none";
  if (vis.warta !== false) {
    renderDateCard();
    renderWartaImage();
  }

  // 2. Jadwal Ibadah
  const jadwalSec = document.getElementById("jadwalIbadahSectionCard");
  if (jadwalSec) jadwalSec.style.display = vis.jadwalIbadah !== false ? "" : "none";
  if (vis.jadwalIbadah !== false) {
    renderJadwalIbadah();
  }

  // 3. Petunjuk Arah Google Maps
  const mapsBtn = document.getElementById("btnGoogleMaps");
  if (mapsBtn) mapsBtn.style.display = vis.maps !== false ? "" : "none";

  // 4. Jadwal Persekutuan Pekanan
  const persekutuanSec = document.getElementById("persekutuanSectionCard");
  if (persekutuanSec) persekutuanSec.style.display = vis.jadwalPersekutuan !== false ? "" : "none";
  if (vis.jadwalPersekutuan !== false) {
    renderJadwalPersekutuan();
  }

  // 5. Dokumentasi Kegiatan
  const docSec = document.getElementById("dokumentasiSectionCard");
  if (docSec) docSec.style.display = vis.dokumentasi !== false ? "" : "none";
  if (vis.dokumentasi !== false) {
    renderDokumentasi();
  }

  // 6. Renungan Harian
  const renunganSec = document.getElementById("renunganSectionCard");
  if (renunganSec) renunganSec.style.display = vis.renungan !== false ? "" : "none";
  if (vis.renungan !== false) {
    renderRenungan();
  }
}

function renderHeaderAndHero() {
  const hTop = document.getElementById("headerTopTitle");
  const hBottom = document.getElementById("headerBottomTitle");
  const heroTitle = document.getElementById("heroMainTitle");
  const mapsBtn = document.getElementById("btnGoogleMaps");

  if (hTop) hTop.textContent = APP_DB.church.headerTop || "GPdI Gosyen Kaloran";
  if (hBottom) hBottom.textContent = APP_DB.church.headerBottom || "Warta Jemaat";
  if (heroTitle) heroTitle.textContent = APP_DB.church.name || "GPdI Gosyen Kaloran";
  if (mapsBtn) mapsBtn.href = APP_DB.church.mapsUrl || "https://maps.app.goo.gl/CNYqT17tYnc58aD1A";
}

function renderDateCard() {
  const dateTitle = document.getElementById("displayDateTitle");
  const subTitle = document.getElementById("displayDateTime");

  if (dateTitle) dateTitle.textContent = APP_DB.warta.editionDate || "November 2026";
  if (subTitle) subTitle.textContent = APP_DB.warta.subtitle || "Edisi Ibadah Raya & Perjamuan Kudus";
}

function renderWartaImage() {
  const preview = document.getElementById("wartaImagePreview");
  const lightbox = document.getElementById("lightboxImage");
  const btnDownload = document.getElementById("btnDownloadWarta");
  const modalDownload = document.getElementById("modalDownloadBtn");
  const timestamp = document.getElementById("updateTimestamp");
  const expiredNotice = document.getElementById("wartaExpiredNotice");
  const wartaFrame = document.getElementById("wartaImageFrameContainer");

  const isExpired = APP_DB.warta.isExpired || !APP_DB.warta.imageUrl;

  if (isExpired) {
    if (expiredNotice) expiredNotice.classList.remove("hidden");
    if (wartaFrame) wartaFrame.classList.add("hidden");
    if (timestamp) timestamp.textContent = "Kedaluwarsa (> 30 Hari)";
    if (btnDownload) btnDownload.classList.add("opacity-50", "pointer-events-none");
    return;
  }

  if (expiredNotice) expiredNotice.classList.add("hidden");
  if (wartaFrame) wartaFrame.classList.remove("hidden");
  if (btnDownload) btnDownload.classList.remove("opacity-50", "pointer-events-none");

  const src = APP_DB.warta.imageUrl || "./assets/warta-sample.png";
  if (preview) preview.src = src;
  if (lightbox) lightbox.src = src;
  if (btnDownload) {
    btnDownload.href = src;
    btnDownload.download = `Warta-GPdI-${(APP_DB.warta.editionDate || 'Jemaat').replace(/\s+/g, '-')}.png`;
  }
  if (modalDownload) {
    modalDownload.href = src;
    modalDownload.download = `Warta-GPdI-${(APP_DB.warta.editionDate || 'Jemaat').replace(/\s+/g, '-')}.png`;
  }
  if (timestamp) timestamp.textContent = `Edisi: ${APP_DB.warta.editionDate || 'November 2026'}`;
}

// Render Jadwal Ibadah Table (Sorted: Sunday first, then by time; Filtered by active)
function renderJadwalIbadah() {
  const container = document.getElementById("jadwalIbadahTableBody");
  if (!container) return;

  const list = [...APP_DB.jadwalIbadah].filter(i => i.active !== false);
  list.sort((a, b) => {
    const dayA = DAY_ORDER[a.hari] || 99;
    const dayB = DAY_ORDER[b.hari] || 99;
    if (dayA !== dayB) return dayA - dayB;
    return (a.jam || "").localeCompare(b.jam || "");
  });

  if (!list.length) {
    container.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-xs text-royal-navy/50 italic font-sans">Belum ada jadwal ibadah aktif</td></tr>`;
    return;
  }

  let html = "";
  list.forEach((item) => {
    const isSunday = item.hari === "Minggu";
    const dayBadgeClass = isSunday
      ? "bg-royal-navy text-white ring-1 ring-vintage-gold/50 font-bold"
      : "bg-sky-soft/70 text-royal-navy font-semibold";

    html += `
      <tr class="border-b border-sky-soft/60 hover:bg-white/80 transition text-xs">
        <td class="py-2.5 px-3">
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-serif ${dayBadgeClass}">
            ${item.hari}
          </span>
        </td>
        <td class="py-2.5 px-2 font-mono text-[11px] font-bold text-royal-navy whitespace-nowrap">
          ${item.jam}
        </td>
        <td class="py-2.5 px-3">
          <div class="font-serif font-bold text-royal-navy text-[12px]">${item.nama}</div>
          <div class="text-[10px] text-royal-navy/60 font-sans">${item.keterangan || ''}</div>
        </td>
      </tr>
    `;
  });

  container.innerHTML = html;
}

// Render Jadwal Persekutuan Pekanan
function renderJadwalPersekutuan() {
  const container = document.getElementById("jadwalPersekutuanList");
  if (!container) return;

  const list = (APP_DB.jadwalPersekutuan || []).filter(item => item.active !== false);
  if (!list.length) {
    container.innerHTML = `<span class="text-xs text-royal-navy/50 italic font-sans text-center py-2">Belum ada persekutuan pekanan aktif</span>`;
    return;
  }

  let html = "";
  list.forEach(item => {
    html += `
      <div class="p-2.5 rounded-xl bg-white/60 hover:bg-white/90 border border-sky-soft/80 flex items-center justify-between transition">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-sky-soft/50 flex items-center justify-center text-royal-navy shrink-0">
            <span class="material-symbols-outlined text-[17px] text-royal-navy">${item.icon || 'groups'}</span>
          </div>
          <div class="flex flex-col text-left">
            <span class="font-serif text-[11px] font-bold text-royal-navy">${item.nama}</span>
            <span class="text-[10px] text-royal-navy/60">${item.deskripsi}</span>
          </div>
        </div>
        <span class="text-[10px] font-bold font-serif px-2 py-0.5 rounded-full bg-sky-cloud text-royal-navy border border-sky-mid/40 whitespace-nowrap">
          ${item.waktu}
        </span>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Dokumentasi Section
function renderDokumentasi() {
  const folderContainer = document.getElementById("docFolderTabs");
  const galleryContainer = document.getElementById("docGalleryGrid");
  if (!folderContainer || !galleryContainer) return;

  const folders = (APP_DB.dokumentasi || []).filter(f => f.active !== false);
  if (!folders.length) {
    folderContainer.innerHTML = `<span class="text-xs text-royal-navy/50 italic">Belum ada album dokumentasi aktif</span>`;
    galleryContainer.innerHTML = "";
    return;
  }

  if (!window.activeDocFolderId || !folders.some(f => f.id === window.activeDocFolderId)) {
    window.activeDocFolderId = folders[0].id;
  }

  let tabHtml = "";
  folders.forEach(f => {
    const isActive = f.id === window.activeDocFolderId;
    tabHtml += `
      <button type="button" onclick="selectDocFolder('${f.id}')" class="px-3 py-1.5 rounded-full text-xs font-serif transition shrink-0 ${isActive ? 'bg-royal-navy text-white font-bold shadow-sm' : 'bg-white/70 text-royal-navy hover:bg-white border border-sky-soft'}">
        <span class="material-symbols-outlined text-[13px] align-middle mr-1">folder</span>${f.name}
      </button>
    `;
  });
  folderContainer.innerHTML = tabHtml;

  const current = folders.find(f => f.id === window.activeDocFolderId);
  const photos = current ? (current.photos || []) : [];

  if (!photos.length) {
    galleryContainer.innerHTML = `
      <div class="col-span-2 py-6 text-center text-xs text-royal-navy/50 italic font-sans">
        Belum ada foto dalam album "${current ? current.name : ''}". Foto dapat diunggah melalui Akses Pengelola.
      </div>
    `;
    return;
  }

  let photoHtml = "";
  photos.forEach(ph => {
    photoHtml += `
      <div class="group relative aspect-video rounded-xl overflow-hidden bg-sky-cloud border border-sky-soft shadow-xs cursor-pointer" onclick="openPhotoViewer('${ph.url}', '${ph.title}')">
        <img src="${ph.url}" alt="${ph.title}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
          <span class="text-white text-[10px] font-serif font-medium truncate">${ph.title}</span>
        </div>
      </div>
    `;
  });
  galleryContainer.innerHTML = photoHtml;
}

function selectDocFolder(id) {
  window.activeDocFolderId = id;
  renderDokumentasi();
}

function openPhotoViewer(url, title) {
  const modal = document.getElementById("lightboxModal");
  const img = document.getElementById("lightboxImage");
  const downloadBtn = document.getElementById("modalDownloadBtn");
  if (modal && img) {
    img.src = url;
    if (downloadBtn) {
      downloadBtn.href = url;
      downloadBtn.download = (title || "Dokumentasi-GPdI") + ".png";
    }
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
}

// Renungan Harian (Hierarchical Folder System)
function renderRenungan() {
  const breadcrumbEl = document.getElementById("renunganBreadcrumbs");
  const folderListEl = document.getElementById("renunganSubfoldersList");
  const articlesListEl = document.getElementById("renunganArticlesList");
  if (!breadcrumbEl || !folderListEl || !articlesListEl) return;

  const currentFolder = findFolderById(currentRenunganFolderId);
  const path = getFolderPath(currentRenunganFolderId);

  let bcHtml = `<button type="button" onclick="navigateRenunganFolder('root_2026')" class="hover:text-royal-navy transition font-serif">Koleksi Renungan</button>`;
  path.forEach((f, idx) => {
    if (f.id !== "root_2026") {
      bcHtml += ` <span class="text-vintage-gold">/</span> <button type="button" onclick="navigateRenunganFolder('${f.id}')" class="hover:text-royal-navy transition ${idx === path.length - 1 ? 'font-bold text-royal-navy' : ''}">${f.name}</button>`;
    }
  });
  breadcrumbEl.innerHTML = bcHtml;

  const subfolders = currentFolder ? (currentFolder.folders || []) : [];
  if (subfolders.length) {
    let fHtml = "";
    subfolders.forEach(sf => {
      fHtml += `
        <button type="button" onclick="navigateRenunganFolder('${sf.id}')" class="p-2.5 rounded-xl bg-white/70 hover:bg-white border border-sky-soft flex items-center justify-between text-left transition shadow-xs group">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-antique-gold text-[18px] group-hover:scale-110 transition-transform">folder</span>
            <span class="font-serif text-xs font-bold text-royal-navy">${sf.name}</span>
          </div>
          <span class="material-symbols-outlined text-royal-navy/40 text-[16px]">chevron_right</span>
        </button>
      `;
    });
    folderListEl.innerHTML = fHtml;
    folderListEl.classList.remove("hidden");
  } else {
    folderListEl.innerHTML = "";
    folderListEl.classList.add("hidden");
  }

  const allArticles = APP_DB.renungan.articles || [];
  const articles = allArticles.filter(a => a.folderId === currentRenunganFolderId && a.active !== false);

  if (!articles.length) {
    articlesListEl.innerHTML = `
      <div class="py-6 text-center text-xs text-royal-navy/50 italic font-sans">
        Belum ada renungan dalam folder ini. Pengelola dapat menulis renungan baru di Akses Pengelola.
      </div>
    `;
    return;
  }

  let aHtml = "";
  articles.forEach(art => {
    aHtml += `
      <div class="p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-white/90 shadow-sm transition flex flex-col gap-2 cursor-pointer" onclick="openRenunganReader('${art.id}')">
        <div class="flex items-center justify-between">
          <span class="px-2 py-0.5 rounded-full bg-sky-cloud text-antique-gold border border-vintage-gold/30 font-serif font-bold text-[10px]">
            ${art.ayat || 'Firman Tuhan'}
          </span>
          <span class="text-[10px] text-royal-navy/50 font-sans">${art.date}</span>
        </div>
        <h4 class="font-serif text-sm font-bold text-royal-navy leading-snug">${art.title}</h4>
        <p class="text-xs text-royal-navy/70 font-sans line-clamp-2 leading-relaxed">${art.konten}</p>
        <div class="flex items-center gap-1 text-[11px] font-semibold text-royal-navy/80 hover:text-royal-navy pt-1 font-serif">
          <span>Baca Renungan Lengkap</span>
          <span class="material-symbols-outlined text-[13px]">arrow_forward</span>
        </div>
      </div>
    `;
  });
  articlesListEl.innerHTML = aHtml;
}

function navigateRenunganFolder(folderId) {
  currentRenunganFolderId = folderId;
  renderRenungan();
}

function findFolderById(id, folderList = APP_DB.renungan.folders) {
  for (const f of folderList) {
    if (f.id === id) return f;
    if (f.folders && f.folders.length) {
      const found = findFolderById(id, f.folders);
      if (found) return found;
    }
  }
  return null;
}

function getFolderPath(targetId, currentFolder = APP_DB.renungan.folders[0], currentPath = []) {
  if (!currentFolder) return [];
  const newPath = [...currentPath, currentFolder];
  if (currentFolder.id === targetId) return newPath;
  if (currentFolder.folders) {
    for (const sub of currentFolder.folders) {
      const found = getFolderPath(targetId, sub, newPath);
      if (found.length) return found;
    }
  }
  return [];
}

// Renungan Reader Modal
function openRenunganReader(articleId) {
  const article = (APP_DB.renungan.articles || []).find(a => a.id === articleId);
  if (!article) return;

  const modal = document.getElementById("renunganReaderModal");
  document.getElementById("readerTitle").textContent = article.title;
  document.getElementById("readerDate").textContent = article.date;
  document.getElementById("readerAyat").textContent = article.ayat || "";
  document.getElementById("readerContent").textContent = article.konten;

  const imgEl = document.getElementById("readerImage");
  if (article.imageUrl) {
    imgEl.src = article.imageUrl;
    imgEl.classList.remove("hidden");
  } else {
    imgEl.classList.add("hidden");
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeRenunganReader() {
  const modal = document.getElementById("renunganReaderModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

// Lightbox Controls
function openLightbox() {
  if (APP_DB.warta.isExpired || !APP_DB.warta.imageUrl) {
    showToast("Warta telah kedaluwarsa atau belum diunggah");
    return;
  }
  const modal = document.getElementById("lightboxModal");
  const img = document.getElementById("lightboxImage");
  img.src = APP_DB.warta.imageUrl || "./assets/warta-sample.png";
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
  currentZoom = 1;
  applyZoom();
}

function closeLightbox() {
  const modal = document.getElementById("lightboxModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
  currentZoom = 1;
  applyZoom();
}

function zoomIn() {
  if (currentZoom < 3) {
    currentZoom += 0.25;
    applyZoom();
  }
}

function zoomOut() {
  if (currentZoom > 0.75) {
    currentZoom -= 0.25;
    applyZoom();
  }
}

function resetZoom() {
  currentZoom = 1;
  applyZoom();
}

function applyZoom() {
  const img = document.getElementById("lightboxImage");
  if (img) img.style.transform = `scale(${currentZoom})`;
}

// Accordion Toggle
function toggleAccordion(id) {
  const el = document.getElementById(id);
  const arrow = document.getElementById(id + "Arrow");
  if (!el) return;

  if (el.classList.contains("hidden")) {
    el.classList.remove("hidden");
    if (arrow) arrow.style.transform = "rotate(180deg)";
  } else {
    el.classList.add("hidden");
    if (arrow) arrow.style.transform = "rotate(0deg)";
  }
}

// Admin Modal
function openAdminModal() {
  const modal = document.getElementById("adminModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.getElementById("adminPinInput").value = "";
  document.getElementById("pinErrorMessage").classList.add("hidden");
  document.getElementById("pinStep").classList.remove("hidden");
  document.getElementById("adminDashboardStep").classList.add("hidden");

  setTimeout(() => {
    const input = document.getElementById("adminPinInput");
    if (input) input.focus();
  }, 100);
}

function closeAdminModal() {
  const modal = document.getElementById("adminModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function verifyAdminPin() {
  const inputPin = document.getElementById("adminPinInput").value.trim();
  const validPin = APP_DB.church.pin || "gosyen123";

  if (inputPin === validPin || inputPin === "gosyen123") {
    document.getElementById("pinStep").classList.add("hidden");
    document.getElementById("adminDashboardStep").classList.remove("hidden");
    populateAdminDashboard();
    showToast("Akses Pengelola Terbuka ✓");
  } else {
    const err = document.getElementById("pinErrorMessage");
    err.classList.remove("hidden");
    err.textContent = "Kata sandi salah! Gunakan: gosyen123";
  }
}

// Admin Tab Switching
function switchAdminTab(tabName) {
  document.querySelectorAll(".admin-tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.add("hidden"));

  const targetBtn = document.getElementById(`tabBtn_${tabName}`);
  const targetContent = document.getElementById(`tabContent_${tabName}`);

  if (targetBtn) targetBtn.classList.add("active");
  if (targetContent) targetContent.classList.remove("hidden");
}

// Populate Admin Dashboard Fields
function populateAdminDashboard() {
  document.getElementById("adminWartaDateInput").value = APP_DB.warta.editionDate || "November 2026";
  document.getElementById("adminWartaSubtitleInput").value = APP_DB.warta.subtitle || "Edisi Ibadah Raya & Perjamuan Kudus";

  renderAdminJadwalTable();
  renderAdminPersekutuanList();
  renderAdminDocFolders();
  renderAdminRenunganSelects();
  renderAdminVisibilityList();

  document.getElementById("adminCloudUrlInput").value = (APP_DB.cloudConfig && APP_DB.cloudConfig.apiUrl) || "";
}

// Save Warta Info
async function saveAdminWartaInfo() {
  const newDate = document.getElementById("adminWartaDateInput").value.trim();
  const newSub = document.getElementById("adminWartaSubtitleInput").value.trim();

  APP_DB.warta.editionDate = newDate || "November 2026";
  APP_DB.warta.subtitle = newSub || "Edisi Ibadah Raya & Perjamuan Kudus";

  await saveDatabase();
  showToast("Informasi Warta Jemaat disimpan!");
}

// Upload Single Warta Image (100% HD)
function triggerWartaUpload() {
  document.getElementById("adminWartaSingleFileInput").click();
}

function handleSingleWartaUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    APP_DB.warta.imageUrl = e.target.result;
    APP_DB.warta.createdAt = Date.now(); // Reset 30-day timer
    APP_DB.warta.isExpired = false;
    await saveDatabase();
    showToast("Gambar Warta HD berhasil diperbarui! ✓");
  };
  reader.readAsDataURL(file);
}

// -------------------------------------------------------------
// FITUR KOLASE 2 KOLOM (DARI COLASEKOLOM2.HTML DENGAN PENGHAPUSAN FOTO SUMBER)
// -------------------------------------------------------------
function urutkanBerdasarkanNamaFile(files) {
  return files.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
  );
}

async function handleCollageFiles(event) {
  const fileInput = event.target;
  const fileListBox = document.getElementById("collageFileListBox");
  const orderedListEl = document.getElementById("collageOrderedFiles");
  const previewBox = document.getElementById("collagePreviewContainer");
  const applyBtn = document.getElementById("btnApplyCollageWarta");
  const downloadBtn = document.getElementById("btnDownloadCollage");
  const resInfo = document.getElementById("collageResInfo");

  let files = Array.from(fileInput.files);
  if (!files.length) {
    if (fileListBox) fileListBox.classList.add("hidden");
    if (applyBtn) applyBtn.disabled = true;
    if (downloadBtn) downloadBtn.disabled = true;
    if (previewBox) previewBox.innerHTML = "";
    return;
  }

  // 1. Urutkan berdasarkan nama file
  files = urutkanBerdasarkanNamaFile(files);
  const n = files.length;
  const cols = 2;
  const rows = Math.ceil(n / cols);

  orderedListEl.innerHTML = "";
  files.forEach((f, idx) => {
    const r = Math.floor(idx / cols) + 1;
    const c = (idx % cols) + 1;
    const isLastOdd = (n % 2 === 1) && (idx === n - 1);
    const posText = isLastOdd ? `Baris ${r} — Posisi Tengah` : `Baris ${r}, Kolom ${c}`;
    const li = document.createElement("li");
    li.innerHTML = `<strong>${f.name}</strong> <span class="badge text-[10px] bg-sky-soft text-royal-navy px-1.5 py-0.5 rounded font-bold ml-1">${posText}</span>`;
    orderedListEl.appendChild(li);
  });
  fileListBox.classList.remove("hidden");

  // 2. Muat semua gambar dalam resolusi asli
  const images = await Promise.all(files.map(file => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = URL.createObjectURL(file);
  })));

  const spacing = parseInt(document.getElementById("collageSpacingInput").value) || 20;
  const border = parseInt(document.getElementById("collageBorderInput").value) || 20;

  // 3. 100% HD: Gunakan lebar asli maksimum
  const colW = Math.max(...images.map(img => img.naturalWidth));

  const scaled = images.map(img => {
    const scale = colW / img.naturalWidth;
    return {
      img,
      w: colW,
      h: Math.round(img.naturalHeight * scale)
    };
  });

  // 4. Hitung tinggi masing-masing baris
  const rowHeights = [];
  for (let r = 0; r < rows; r++) {
    const slice = scaled.slice(r * cols, (r + 1) * cols);
    rowHeights.push(Math.max(...slice.map(item => item.h)));
  }

  // 5. Kanvas resolusi HD penuh
  const canvas = document.createElement("canvas");
  canvas.id = "collagePreviewCanvas";
  canvas.width = cols * colW + (cols - 1) * spacing + 2 * border;
  canvas.height = rowHeights.reduce((a, b) => a + b, 0) + (rows - 1) * spacing + 2 * border;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 6. Gambar ke kanvas
  let currentY = border;
  for (let r = 0; r < rows; r++) {
    const rowH = rowHeights[r];
    const itemsInThisRow = (r === rows - 1 && n % cols !== 0) ? (n % cols) : cols;

    for (let c = 0; c < itemsInThisRow; c++) {
      const idx = r * cols + c;
      const item = scaled[idx];

      let x;
      if (itemsInThisRow === 1) {
        x = Math.floor((canvas.width - item.w) / 2);
      } else {
        x = border + c * (colW + spacing);
      }

      const y = currentY + Math.floor((rowH - item.h) / 2);
      ctx.drawImage(item.img, x, y, item.w, item.h);
    }
    currentY += rowH + spacing;
  }

  currentCollageCanvas = canvas;
  previewBox.innerHTML = "";
  previewBox.appendChild(canvas);
  resInfo.textContent = `Resolusi Kolase: ${canvas.width} x ${canvas.height} px (100% HD Lossless)`;

  applyBtn.disabled = false;
  downloadBtn.disabled = false;
}

// Pasang Kolase Sebagai Warta Jemaat & HAPUS FOTO SEBELUM KOLASE
async function applyCollageToWarta() {
  if (!currentCollageCanvas) return;

  // 1. Simpan gambar kolase HD ke database
  const dataUrl = currentCollageCanvas.toDataURL("image/png");
  APP_DB.warta.imageUrl = dataUrl;
  APP_DB.warta.createdAt = Date.now(); // Reset 30-day auto cleanup
  APP_DB.warta.isExpired = false;

  // 2. HAPUS FOTO SEBELUM KOLASE (Membersihkan input dan memori)
  const fileInput = document.getElementById("collageFilesInput");
  if (fileInput) fileInput.value = "";
  const fileListBox = document.getElementById("collageFileListBox");
  if (fileListBox) fileListBox.classList.add("hidden");
  const orderedList = document.getElementById("collageOrderedFiles");
  if (orderedList) orderedList.innerHTML = "";
  const previewBox = document.getElementById("collagePreviewContainer");
  if (previewBox) previewBox.innerHTML = "";
  const resInfo = document.getElementById("collageResInfo");
  if (resInfo) resInfo.textContent = "";

  const applyBtn = document.getElementById("btnApplyCollageWarta");
  if (applyBtn) applyBtn.disabled = true;
  const downloadBtn = document.getElementById("btnDownloadCollage");
  if (downloadBtn) downloadBtn.disabled = true;

  currentCollageCanvas = null;

  await saveDatabase();
  showToast("Kolase HD terpasang sebagai Warta & foto sumber telah dibersihkan! ✓");
}

function downloadCollagePNG() {
  if (!currentCollageCanvas) return;
  const link = document.createElement("a");
  link.download = `Kolase_Warta_GPdI_${Date.now()}.png`;
  link.href = currentCollageCanvas.toDataURL("image/png");
  link.click();
}

// -------------------------------------------------------------
// JADWAL IBADAH ADMIN CRUD (DENGAN TOMBOL AKTIF / NONAKTIF)
// -------------------------------------------------------------
function renderAdminJadwalTable() {
  const container = document.getElementById("adminJadwalListContainer");
  if (!container) return;

  let html = "";
  (APP_DB.jadwalIbadah || []).forEach(item => {
    const isItemActive = item.active !== false;
    html += `
      <div class="p-2.5 rounded-xl bg-white border border-sky-soft flex items-center justify-between text-xs gap-2">
        <div class="flex flex-col">
          <div class="font-bold text-royal-navy font-serif flex items-center gap-1.5 flex-wrap">
            <span class="bg-sky-cloud px-1.5 py-0.5 rounded text-[10px] text-antique-gold">${item.hari}</span>
            <span>${item.nama} (${item.jam})</span>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${isItemActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}">
              ${isItemActive ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
          <span class="text-[10px] text-royal-navy/60">${item.keterangan || '-'}</span>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button type="button" onclick="toggleJadwalActive('${item.id}')" title="${isItemActive ? 'Nonaktifkan (sembunyikan dari tabel)' : 'Aktifkan (tampilkan di tabel)'}" class="px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition active:scale-95 ${isItemActive ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300'}">
            ${isItemActive ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
          <button type="button" onclick="deleteJadwalIbadah('${item.id}')" class="text-rose-500 hover:text-rose-700 p-1" title="Hapus">
            <span class="material-symbols-outlined text-[17px]">delete</span>
          </button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html || `<span class="text-xs text-royal-navy/50">Belum ada jadwal ibadah</span>`;
}

async function toggleJadwalActive(id) {
  const item = (APP_DB.jadwalIbadah || []).find(j => j.id === id);
  if (item) {
    item.active = item.active === false ? true : false;
    await saveDatabase();
    renderAdminJadwalTable();
    renderJadwalIbadah();
    showToast(`Status "${item.nama}" diubah jadi ${item.active ? 'Aktif' : 'Nonaktif'}!`);
  }
}

async function addJadwalIbadah() {
  const hari = document.getElementById("formJadwalHari").value;
  const jam = document.getElementById("formJadwalJam").value.trim();
  const nama = document.getElementById("formJadwalNama").value.trim();
  const ket = document.getElementById("formJadwalKet").value.trim();

  if (!jam || !nama) {
    alert("Harap isi jam dan nama ibadah");
    return;
  }

  APP_DB.jadwalIbadah.push({
    id: "j_" + Date.now(),
    hari,
    jam,
    nama,
    keterangan: ket,
    active: true
  });

  await saveDatabase();
  renderAdminJadwalTable();
  document.getElementById("formJadwalJam").value = "";
  document.getElementById("formJadwalNama").value = "";
  document.getElementById("formJadwalKet").value = "";
  showToast("Jadwal ibadah ditambahkan!");
}

async function deleteJadwalIbadah(id) {
  if (confirm("Hapus jadwal ini?")) {
    APP_DB.jadwalIbadah = APP_DB.jadwalIbadah.filter(j => j.id !== id);
    await saveDatabase();
    renderAdminJadwalTable();
    showToast("Jadwal dihapus");
  }
}

// -------------------------------------------------------------
// PERSEKUTUAN PEKANAN ADMIN CRUD (DENGAN TOMBOL AKTIF / NONAKTIF)
// -------------------------------------------------------------
function renderAdminPersekutuanList() {
  const container = document.getElementById("adminPersekutuanListContainer");
  if (!container) return;

  let html = "";
  (APP_DB.jadwalPersekutuan || []).forEach(item => {
    const isItemActive = item.active !== false;
    html += `
      <div class="p-2.5 rounded-xl bg-white border border-sky-soft flex items-center justify-between text-xs gap-2">
        <div class="flex flex-col">
          <div class="font-bold text-royal-navy font-serif flex items-center gap-1.5 flex-wrap">
            <span>${item.nama}</span>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${isItemActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}">
              ${isItemActive ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
          <span class="text-[10px] text-royal-navy/60">${item.deskripsi} • <strong>${item.waktu}</strong></span>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button type="button" onclick="togglePersekutuanActive('${item.id}')" title="${isItemActive ? 'Nonaktifkan (sembunyikan dari daftar)' : 'Aktifkan (tampilkan di daftar)'}" class="px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition active:scale-95 ${isItemActive ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300'}">
            ${isItemActive ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
          <button type="button" onclick="deletePersekutuan('${item.id}')" class="text-rose-500 hover:text-rose-700 p-1" title="Hapus">
            <span class="material-symbols-outlined text-[17px]">delete</span>
          </button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html || `<span class="text-xs text-royal-navy/50">Belum ada persekutuan</span>`;
}

async function togglePersekutuanActive(id) {
  const item = (APP_DB.jadwalPersekutuan || []).find(p => p.id === id);
  if (item) {
    item.active = item.active === false ? true : false;
    await saveDatabase();
    renderAdminPersekutuanList();
    renderJadwalPersekutuan();
    showToast(`Status "${item.nama}" diubah jadi ${item.active ? 'Aktif' : 'Nonaktif'}!`);
  }
}

async function addPersekutuan() {
  const nama = document.getElementById("formPersekutuanNama").value.trim();
  const deskripsi = document.getElementById("formPersekutuanKet").value.trim();
  const waktu = document.getElementById("formPersekutuanWaktu").value.trim();

  if (!nama || !waktu) {
    alert("Harap isi nama persekutuan dan waktu");
    return;
  }

  APP_DB.jadwalPersekutuan.push({
    id: "p_" + Date.now(),
    nama,
    deskripsi,
    waktu,
    icon: "groups"
  });

  await saveDatabase();
  renderAdminPersekutuanList();
  document.getElementById("formPersekutuanNama").value = "";
  document.getElementById("formPersekutuanKet").value = "";
  document.getElementById("formPersekutuanWaktu").value = "";
  showToast("Persekutuan ditambahkan!");
}

async function deletePersekutuan(id) {
  if (confirm("Hapus persekutuan ini?")) {
    APP_DB.jadwalPersekutuan = APP_DB.jadwalPersekutuan.filter(p => p.id !== id);
    await saveDatabase();
    renderAdminPersekutuanList();
    showToast("Persekutuan dihapus");
  }
}

// -------------------------------------------------------------
// DOKUMENTASI ADMIN
// -------------------------------------------------------------
function renderAdminDocFolders() {
  const select = document.getElementById("adminDocFolderSelect");
  const list = document.getElementById("adminDocFolderList");
  if (!select || !list) return;

  select.innerHTML = "";
  let listHtml = "";

  (APP_DB.dokumentasi || []).forEach(f => {
    select.innerHTML += `<option value="${f.id}">${f.name}</option>`;
    listHtml += `
      <div class="p-2 rounded-lg bg-sky-cloud/50 border border-sky-soft flex items-center justify-between text-xs">
        <span>📁 <strong>${f.name}</strong> (${(f.photos || []).length} foto)</span>
        <button type="button" onclick="deleteDocFolder('${f.id}')" class="text-rose-500 p-0.5"><span class="material-symbols-outlined text-[15px]">delete</span></button>
      </div>
    `;
  });

  list.innerHTML = listHtml;
}

async function addDocFolder() {
  const name = prompt("Masukkan nama album/folder dokumentasi baru:");
  if (!name || !name.trim()) return;

  APP_DB.dokumentasi.push({
    id: "doc_f_" + Date.now(),
    name: name.trim(),
    date: new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
    photos: []
  });

  await saveDatabase();
  renderAdminDocFolders();
  showToast("Folder album dibuat!");
}

async function deleteDocFolder(id) {
  if (confirm("Hapus album ini beserta semua fotonya?")) {
    APP_DB.dokumentasi = APP_DB.dokumentasi.filter(f => f.id !== id);
    await saveDatabase();
    renderAdminDocFolders();
    showToast("Album dihapus");
  }
}

async function handleDocPhotoUpload(event) {
  const folderId = document.getElementById("adminDocFolderSelect").value;
  const folder = (APP_DB.dokumentasi || []).find(f => f.id === folderId);
  if (!folder) {
    alert("Pilih album tujuan terlebih dahulu");
    return;
  }

  const files = Array.from(event.target.files);
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      folder.photos.push({
        id: "ph_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
        title: file.name.replace(/\.[^/.]+$/, ""),
        url: e.target.result
      });
      await saveDatabase();
      renderAdminDocFolders();
    };
    reader.readAsDataURL(file);
  }
  showToast(`${files.length} foto berhasil diunggah!`);
}

// -------------------------------------------------------------
// RENUNGAN ADMIN (Hierarchical Folder System)
// -------------------------------------------------------------
function renderAdminRenunganSelects() {
  const select = document.getElementById("adminRenunganParentFolderSelect");
  const targetSelect = document.getElementById("adminRenunganArticleFolderSelect");
  if (!select || !targetSelect) return;

  select.innerHTML = "";
  targetSelect.innerHTML = "";

  function traverse(folder, depth = 0) {
    const indent = "— ".repeat(depth);
    select.innerHTML += `<option value="${folder.id}">${indent}${folder.name}</option>`;
    targetSelect.innerHTML += `<option value="${folder.id}">${indent}${folder.name}</option>`;
    if (folder.folders) {
      folder.folders.forEach(sub => traverse(sub, depth + 1));
    }
  }

  (APP_DB.renungan.folders || []).forEach(root => traverse(root, 0));
}

async function addRenunganSubfolder() {
  const parentId = document.getElementById("adminRenunganParentFolderSelect").value;
  const name = document.getElementById("formRenunganSubfolderName").value.trim();

  if (!name) {
    alert("Harap masukkan nama subfolder");
    return;
  }

  const parentFolder = findFolderById(parentId);
  if (!parentFolder) {
    alert("Folder induk tidak ditemukan");
    return;
  }

  if (!parentFolder.folders) parentFolder.folders = [];
  parentFolder.folders.push({
    id: "f_" + Date.now(),
    name,
    parentId,
    folders: []
  });

  await saveDatabase();
  renderAdminRenunganSelects();
  document.getElementById("formRenunganSubfolderName").value = "";
  showToast(`Subfolder "${name}" berhasil dibuat!`);
}

async function addRenunganArticle() {
  const folderId = document.getElementById("adminRenunganArticleFolderSelect").value;
  const title = document.getElementById("formRenunganTitle").value.trim();
  const ayat = document.getElementById("formRenunganAyat").value.trim();
  const konten = document.getElementById("formRenunganContent").value.trim();
  const imgInput = document.getElementById("formRenunganImageInput");

  if (!title || !konten) {
    alert("Harap isi judul dan konten renungan");
    return;
  }

  let imageUrl = "";
  if (imgInput.files && imgInput.files[0]) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      imageUrl = e.target.result;
      saveNewArticle(folderId, title, ayat, konten, imageUrl);
    };
    reader.readAsDataURL(imgInput.files[0]);
    return;
  }

  await saveNewArticle(folderId, title, ayat, konten, "");
}

async function saveNewArticle(folderId, title, ayat, konten, imageUrl) {
  if (!APP_DB.renungan.articles) APP_DB.renungan.articles = [];

  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  APP_DB.renungan.articles.unshift({
    id: "art_" + Date.now(),
    folderId,
    title,
    date: dateStr,
    ayat,
    konten,
    imageUrl
  });

  await saveDatabase();
  document.getElementById("formRenunganTitle").value = "";
  document.getElementById("formRenunganAyat").value = "";
  document.getElementById("formRenunganContent").value = "";
  document.getElementById("formRenunganImageInput").value = "";
  showToast("Renungan harian berhasil diterbitkan! ✓");
}

// -------------------------------------------------------------
// CLOUD DATABASE CONFIGURATION & SYNC
// -------------------------------------------------------------
async function saveCloudDatabaseConfig() {
  const url = document.getElementById("adminCloudUrlInput").value.trim();
  APP_DB.cloudConfig.apiUrl = url;
  APP_DB.cloudConfig.syncEnabled = !!url;

  await saveDatabase();
  showToast("Pengaturan Cloud Database disimpan!");
}

async function syncCloudNow() {
  showToast("Menyinkronkan ke Cloud Database...");
  await saveDatabase();
  showToast("Sinkronisasi Cloud Berhasil! ✓");
}

function exportDatabaseJSON() {
  const blob = new Blob([JSON.stringify(APP_DB, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `GPdI_Gosyen_Database_${Date.now()}.json`;
  a.click();
}

function importDatabaseJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      APP_DB = { ...APP_DB, ...imported };
      await saveDatabase();
      showToast("Database berhasil diimpor!");
    } catch (err) {
      alert("Format JSON tidak valid!");
    }
  };
  reader.readAsText(file);
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      closeAdminModal();
      closeRenunganReader();
    }
  });
}

// Toast
function showToast(msg) {
  const toast = document.getElementById("toastNotification");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("opacity-0", "pointer-events-none", "translate-y-2");
  toast.classList.add("opacity-100", "translate-y-0");
  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "pointer-events-none", "translate-y-2");
  }, 2600);
}

// -------------------------------------------------------------
// PENGATURAN STATUS TAMPILAN / VISIBILITAS MENU (AKTIFKAN / NONAKTIFKAN)
// -------------------------------------------------------------
const VISIBILITY_CONFIG = [
  { key: "warta", label: "Lembar Warta Jemaat", desc: "Poster warta mingguan, tanggal edisi warta, layar penuh & tombol unduh", icon: "auto_stories" },
  { key: "jadwalIbadah", label: "Tabel Jadwal Ibadah", desc: "Tabel jadwal ibadah raya hari Minggu s/d Sabtu beserta waktu pelaksanaan", icon: "church" },
  { key: "jadwalPersekutuan", label: "Jadwal Persekutuan Pekanan", desc: "Jadwal kegiatan persekutuan mezbah keluarga, ibadah wanita, dsb.", icon: "event_note" },
  { key: "dokumentasi", label: "Dokumentasi Kegiatan", desc: "Galeri foto kegiatan ibadah & dokumentasi pelayanan jemaat", icon: "photo_library" },
  { key: "renungan", label: "Renungan Harian", desc: "Santapan rohani firman Tuhan beserta folder berjenjang", icon: "menu_book" },
  { key: "maps", label: "Petunjuk Arah Google Maps", desc: "Tombol navigasi Google Maps menuju gedung gereja GPdI Gosyen Kaloran", icon: "location_on" }
];

function renderAdminVisibilityList() {
  const container = document.getElementById("adminVisibilityList");
  if (!container) return;

  if (!APP_DB.visibility) {
    APP_DB.visibility = {
      warta: true,
      jadwalIbadah: true,
      jadwalPersekutuan: true,
      dokumentasi: true,
      renungan: true,
      maps: true
    };
  }

  let html = "";
  VISIBILITY_CONFIG.forEach(item => {
    const isVisible = APP_DB.visibility[item.key] !== false;
    html += `
      <div class="p-3 rounded-xl bg-white border border-sky-soft/80 flex items-center justify-between gap-3 shadow-xs">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl ${isVisible ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-400 border border-gray-200'} flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[19px]">${item.icon}</span>
          </div>
          <div class="flex flex-col text-left">
            <div class="flex items-center gap-2">
              <span class="font-serif font-bold text-royal-navy text-xs">${item.label}</span>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                ${isVisible ? 'Aktif (Tampil)' : 'Nonaktif (Sembunyi)'}
              </span>
            </div>
            <span class="text-[10px] text-royal-navy/60 font-sans leading-tight mt-0.5">${item.desc}</span>
          </div>
        </div>
        <button type="button" onclick="toggleSectionVisibility('${item.key}')" class="px-3 py-1.5 rounded-xl font-serif text-[11px] font-bold shrink-0 transition active:scale-95 shadow-xs ${isVisible ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'}">
          ${isVisible ? 'Nonaktifkan' : 'Aktifkan'}
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

async function toggleSectionVisibility(key) {
  if (!APP_DB.visibility) APP_DB.visibility = {};
  APP_DB.visibility[key] = APP_DB.visibility[key] === false ? true : false;
  await saveDatabase();
  renderAdminVisibilityList();
  renderAll();
  const stateStr = APP_DB.visibility[key] ? "diaktifkan (tampil di halaman)" : "dinonaktifkan (disembunyikan dari halaman)";
  showToast(`Menu berhasil ${stateStr}!`);
}
