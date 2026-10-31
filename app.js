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
    pinHash: "5f0186f3047e1e50fb9d3746a90d3d33b73741c2bc0dd2431d063521bdb2ee0c"
  },
  visibility: {
    warta: true,
    jadwalIbadah: true,
    pengumuman: true,
    jadwalPersekutuan: true,
    dokumentasi: true,
    renungan: true,
    maps: true
  },
  pengumuman: [
    {
      id: "ann_1",
      judul: "Ibadah Syukur & Perjamuan Kudus Awal Bulan",
      deskripsi: "Mengundang seluruh jemaat GPdI Gosyen Kaloran untuk hadir bersekutu bersama dalam Ibadah Raya & Perjamuan Kudus. Mari mempersiapkan hati untuk menerima berkat & kekuatan baru di hadirat Tuhan.",
      tanggal: "1 November 2026",
      mediaType: "image",
      mediaUrl: "./assets/warta-sample.png",
      fileName: "warta-november.png",
      active: true,
      createdAt: 1793088000000
    },
    {
      id: "ann_2",
      judul: "Pemberitahuan Pelayanan Diakonia & Kasih Jemaat",
      deskripsi: "Bagi jemaat yang rindu mendukung pelayanan sosial dan diakonia bagi sesama yang membutuhkan, silakan menghubungi pengurus majelis gereja.",
      tanggal: "Oktober 2026",
      mediaType: "document",
      mediaUrl: "",
      fileName: "Tata-Tertib-Pelayanan.pdf",
      active: true,
      createdAt: 1793080000000
    }
  ],
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
    provider: "Cloudflare KV Global Edge",
    apiUrl: "",
    syncEnabled: true
  }
};

let currentZoom = 1;
let currentRenunganFolderId = "root_2026";
let currentCollageCanvas = null;
let currentPengumumanSlideIndex = 0;
let editingPengumumanId = null;
let editingRenunganArticleId = null;
let touchStartX = 0;
let touchEndX = 0;

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

function cleanDatabaseSecurity(db) {
  if (db && db.church) {
    if (db.church.pin) {
      if (!db.church.pinHash) {
        db.church.pinHash = DEFAULT_PIN_HASH;
      }
      delete db.church.pin;
    }
    if (!db.church.pinHash) {
      db.church.pinHash = DEFAULT_PIN_HASH;
    }
  }
  return db;
}

async function loadDatabase() {
  // 1. Primary: Load from Central API (/api/data) -> Cloudflare KV on Pages, or server.py locally
  try {
    const res = await fetch(`/api/data?t=${Date.now()}`, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object" && data.church) {
        APP_DB = cleanDatabaseSecurity({ ...APP_DB, ...data });
        saveToLocalMirror();
        console.log("Synchronized from Cloudflare KV / Central API ✓");
        return;
      }
    }
  } catch (err) {
    console.log("Central API standby, checking fallbacks...", err);
  }

  // 2. Secondary: If external custom Cloud DB URL is configured (optional Firebase)
  if (APP_DB.cloudConfig && APP_DB.cloudConfig.apiUrl) {
    try {
      const cloudRes = await fetch(`${APP_DB.cloudConfig.apiUrl}?t=${Date.now()}`);
      if (cloudRes.ok) {
        const cloudData = await cloudRes.json();
        if (cloudData && typeof cloudData === "object" && cloudData.church) {
          APP_DB = cleanDatabaseSecurity({ ...APP_DB, ...cloudData });
          saveToLocalMirror();
          console.log("Synchronized from Custom Cloud DB ✓");
          return;
        }
      }
    } catch (e) {
      console.log("Custom Cloud DB fetch standby:", e);
    }
  }

  // 3. Fallback: Browser LocalStorage Mirror
  const local = localStorage.getItem("gpdi_cloud_db");
  if (local) {
    try {
      APP_DB = cleanDatabaseSecurity(JSON.parse(local));
    } catch (e) {
      console.error(e);
    }
  }
}

async function saveDatabase() {
  cleanDatabaseSecurity(APP_DB);
  saveToLocalMirror();

  // 1. Save to Central Cloud API (/api/data) -> Cloudflare KV on Pages or server.py locally
  let cloudSuccess = false;
  try {
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(APP_DB)
    });
    if (res.ok) {
      cloudSuccess = true;
      console.log("Saved directly to Cloudflare KV / Central Database ✓");
    }
  } catch (err) {
    console.log("Central API save standby:", err);
  }

  // 2. Save to Custom Cloud Database if configured (optional)
  if (APP_DB.cloudConfig && APP_DB.cloudConfig.apiUrl) {
    try {
      await fetch(APP_DB.cloudConfig.apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(APP_DB)
      });
      console.log("Saved to Custom Cloud DB ✓");
    } catch (err) {
      console.log("Custom Cloud DB save standby:", err);
    }
  }

  renderAll();
  return cloudSuccess;
}

// Real-time synchronization across devices
let isSyncingSilently = false;
async function syncFromCloudSilently() {
  if (isSyncingSilently) return;
  if (isAdminAuthenticated) return; // Don't interrupt if admin is currently editing

  try {
    isSyncingSilently = true;
    const res = await fetch(`/api/data?t=${Date.now()}`, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object" && data.church) {
        const incomingStr = JSON.stringify(data);
        const currentStr = JSON.stringify(APP_DB);
        if (incomingStr !== currentStr) {
          console.log("Cloud update detected from another device! Updating UI...");
          APP_DB = cleanDatabaseSecurity({ ...APP_DB, ...data });
          saveToLocalMirror();
          renderAll();
        }
      }
    }
  } catch (e) {
    // silent fallback
  } finally {
    isSyncingSilently = false;
  }
}

// Auto-sync when user returns to this tab / browser
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    syncFromCloudSilently();
  }
});
window.addEventListener("focus", syncFromCloudSilently);

// Periodic background sync every 30 seconds
setInterval(syncFromCloudSilently, 30000);

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
    pengumuman: true,
    jadwalPersekutuan: true,
    dokumentasi: true,
    renungan: true,
    maps: true
  };

  renderHeaderAndHero();

  // 1. Warta Jemaat (Date Card & Sheet)
  const wartaDateCard = document.getElementById("wartaDateCard");
  const wartaSec = document.getElementById("wartaSection") || document.getElementById("wartaSectionCard");
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

  // 3. Pengumuman Gereja (Carousel / Slider)
  const pengumumanSec = document.getElementById("pengumumanSectionCard");
  if (pengumumanSec) pengumumanSec.style.display = vis.pengumuman !== false ? "" : "none";
  if (vis.pengumuman !== false) {
    renderPengumumanCarousel();
  }

  // 4. Petunjuk Arah Google Maps
  const mapsBtn = document.getElementById("btnGoogleMaps");
  if (mapsBtn) mapsBtn.style.display = vis.maps !== false ? "" : "none";

  // 5. Jadwal Persekutuan Pekanan
  const persekutuanSec = document.getElementById("persekutuanSectionCard");
  if (persekutuanSec) persekutuanSec.style.display = vis.jadwalPersekutuan !== false ? "" : "none";
  if (vis.jadwalPersekutuan !== false) {
    renderJadwalPersekutuan();
  }

  // 6. Dokumentasi Kegiatan
  const docSec = document.getElementById("dokumentasiSectionCard");
  if (docSec) docSec.style.display = vis.dokumentasi !== false ? "" : "none";
  if (vis.dokumentasi !== false) {
    renderDokumentasi();
  }

  // 7. Renungan Harian
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
  const headerSubtitle = document.getElementById("wartaHeaderSubtitle");

  if (dateTitle) dateTitle.textContent = APP_DB.warta.editionDate || "November 2026";
  if (subTitle) subTitle.textContent = APP_DB.warta.subtitle || "Edisi Ibadah Raya & Perjamuan Kudus";
  if (headerSubtitle) headerSubtitle.textContent = `Edisi ${APP_DB.warta.editionDate || 'November 2026'} • Sentuh untuk Membuka`;
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

// -------------------------------------------------------------
// PENGUMUMAN GEREJA (CAROUSEL / SLIDER GESER)
// -------------------------------------------------------------
function renderPengumumanCarousel() {
  const track = document.getElementById("pengumumanTrack");
  const dotsContainer = document.getElementById("pengumumanDots");
  const subHeader = document.getElementById("pengumumanHeaderSubtitle");
  if (!track || !dotsContainer) return;

  const list = (APP_DB.pengumuman || []).filter(item => item.active !== false);

  if (subHeader) {
    subHeader.textContent = list.length > 0 
      ? `${list.length} Pengumuman Aktif • Geser untuk Melihat`
      : "Belum Ada Pengumuman Baru";
  }

  if (!list.length) {
    track.innerHTML = `
      <div class="w-full flex-shrink-0 p-5 rounded-2xl bg-sky-cloud/50 border border-sky-soft text-center flex flex-col items-center justify-center gap-2">
        <span class="material-symbols-outlined text-3xl text-royal-navy/40">campaign</span>
        <p class="font-serif text-xs font-bold text-royal-navy">Belum ada pengumuman kegiatan aktif</p>
        <span class="text-[11px] text-royal-navy/60 font-sans">Pengumuman ibadah dan warta jemaat akan ditampilkan di sini.</span>
      </div>
    `;
    dotsContainer.innerHTML = "";
    track.style.transform = "translateX(0%)";
    return;
  }

  // Ensure current slide is within bounds
  if (currentPengumumanSlideIndex >= list.length) {
    currentPengumumanSlideIndex = 0;
  }

  let slidesHtml = "";
  let dotsHtml = "";

  list.forEach((item, index) => {
    let mediaHtml = "";
    if (item.mediaType === "image" && item.mediaUrl) {
      mediaHtml = `
        <div class="relative w-full rounded-xl overflow-hidden border border-sky-soft shadow-inner bg-sky-cloud/30 cursor-pointer max-h-56 flex items-center justify-center my-2" onclick="openPengumumanLightbox('${item.id}')">
          <img src="${item.mediaUrl}" alt="${item.judul}" class="w-full h-auto max-h-56 object-cover hover:scale-[1.01] transition-transform">
          <div class="absolute bottom-2 right-2 bg-royal-navy/80 backdrop-blur-sm text-white text-[10px] font-serif px-2 py-0.5 rounded-full flex items-center gap-1">
            <span class="material-symbols-outlined text-[12px]">zoom_in</span> Perbesar
          </div>
        </div>
      `;
    } else if (item.mediaType === "video" && item.mediaUrl) {
      mediaHtml = `
        <div class="w-full rounded-xl overflow-hidden border border-sky-soft shadow-inner bg-black my-2">
          <video controls playsinline class="w-full max-h-56 object-contain">
            <source src="${item.mediaUrl}">
            Browser tidak mendukung pemutar video.
          </video>
        </div>
      `;
    } else if (item.mediaType === "document") {
      mediaHtml = `
        <div class="w-full p-2.5 rounded-xl bg-white/90 border border-vintage-gold/40 shadow-xs flex items-center justify-between gap-2 my-2">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="font-serif text-xs font-bold text-royal-navy truncate">${item.fileName || 'Dokumen Pengumuman'}</span>
              <span class="text-[10px] text-royal-navy/60 font-sans">Lampiran PDF / Dokumen Resmi</span>
            </div>
          </div>
          ${item.mediaUrl ? `
            <a href="${item.mediaUrl}" download="${item.fileName || 'dokumen-pengumuman.pdf'}" class="px-2.5 py-1.5 rounded-lg bg-royal-navy hover:bg-deep-blue text-white text-[10px] font-serif font-bold shrink-0 flex items-center gap-1 shadow-xs">
              <span class="material-symbols-outlined text-[13px]">download</span> Unduh
            </a>
          ` : `
            <span class="text-[10px] text-royal-navy/50 italic shrink-0">Tersedia di Sekretariat</span>
          `}
        </div>
      `;
    }

    slidesHtml += `
      <div class="w-full flex-shrink-0 p-4 rounded-2xl bg-gradient-to-b from-white via-sky-cloud/40 to-sky-soft/40 border border-sky-soft flex flex-col justify-between shadow-xs">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-antique-gold">campaign</span>
              <span class="text-[10px] font-serif font-bold uppercase tracking-wider text-royal-navy/80">Pengumuman #${index + 1}</span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-royal-navy border border-vintage-gold/50 shadow-2xs">
              ${item.tanggal || 'Warta Jemaat'}
            </span>
          </div>

          <h4 class="font-serif text-sm font-bold text-royal-navy tracking-wide leading-snug mb-1.5">
            ${item.judul}
          </h4>

          ${mediaHtml}

          <p class="text-xs text-royal-navy/80 leading-relaxed font-sans whitespace-pre-line mt-1">
            ${item.deskripsi}
          </p>
        </div>

        <div class="mt-3 pt-2 border-t border-sky-soft/60 flex items-center justify-between text-[10px] text-royal-navy/50 font-serif">
          <span>GPdI Gosyen Kaloran</span>
          <span>Slide ${index + 1} dari ${list.length}</span>
        </div>
      </div>
    `;

    const isActive = index === currentPengumumanSlideIndex;
    dotsHtml += `
      <button type="button" onclick="goToPengumumanSlide(${index})" aria-label="Slide ${index + 1}" class="transition-all duration-300 rounded-full ${isActive ? 'w-6 h-2 bg-royal-navy' : 'w-2 h-2 bg-sky-mid/60 hover:bg-sky-mid'}"></button>
    `;
  });

  track.innerHTML = slidesHtml;
  dotsContainer.innerHTML = dotsHtml;

  updatePengumumanTrackPosition();
  setupPengumumanSwipe();
}

function updatePengumumanTrackPosition() {
  const track = document.getElementById("pengumumanTrack");
  const dotsContainer = document.getElementById("pengumumanDots");
  if (!track) return;

  track.style.transform = `translateX(-${currentPengumumanSlideIndex * 100}%)`;

  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll("button");
    dots.forEach((dot, idx) => {
      if (idx === currentPengumumanSlideIndex) {
        dot.className = "transition-all duration-300 rounded-full w-6 h-2 bg-royal-navy";
      } else {
        dot.className = "transition-all duration-300 rounded-full w-2 h-2 bg-sky-mid/60 hover:bg-sky-mid";
      }
    });
  }
}

function nextPengumumanSlide() {
  const list = (APP_DB.pengumuman || []).filter(item => item.active !== false);
  if (list.length <= 1) return;
  currentPengumumanSlideIndex = (currentPengumumanSlideIndex + 1) % list.length;
  updatePengumumanTrackPosition();
}

function prevPengumumanSlide() {
  const list = (APP_DB.pengumuman || []).filter(item => item.active !== false);
  if (list.length <= 1) return;
  currentPengumumanSlideIndex = (currentPengumumanSlideIndex - 1 + list.length) % list.length;
  updatePengumumanTrackPosition();
}

function goToPengumumanSlide(index) {
  const list = (APP_DB.pengumuman || []).filter(item => item.active !== false);
  if (index >= 0 && index < list.length) {
    currentPengumumanSlideIndex = index;
    updatePengumumanTrackPosition();
  }
}

function setupPengumumanSwipe() {
  const wrapper = document.getElementById("pengumumanCarouselWrapper");
  if (!wrapper || wrapper.dataset.swipeInitialized) return;
  wrapper.dataset.swipeInitialized = "true";

  wrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  wrapper.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handlePengumumanSwipeGesture();
  }, { passive: true });
}

function handlePengumumanSwipeGesture() {
  const diff = touchEndX - touchStartX;
  if (Math.abs(diff) > 40) {
    if (diff < 0) {
      nextPengumumanSlide();
    } else {
      prevPengumumanSlide();
    }
  }
}

function openPengumumanLightbox(id) {
  const item = (APP_DB.pengumuman || []).find(p => p.id === id);
  if (item && item.mediaUrl) {
    const lightbox = document.getElementById("lightboxModal");
    const img = document.getElementById("lightboxImage");
    if (lightbox && img) {
      img.src = item.mediaUrl;
      lightbox.classList.remove("hidden");
      lightbox.classList.add("flex");
      currentZoom = 1;
      applyZoom();
    }
  }
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

// ==========================================
// PENGELOLA SECURITY & ACCESS CONTROL
// ==========================================

const DEFAULT_PIN_HASH = "5f0186f3047e1e50fb9d3746a90d3d33b73741c2bc0dd2431d063521bdb2ee0c"; // Initial standard hash
const MAX_PIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 Detik Lockout
const ADMIN_SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 Menit Inactivity Timeout

let isAdminAuthenticated = false;
let adminInactivityTimer = null;
let pinLockoutInterval = null;

// Pure JS SHA-256 Fallback
function jsSha256(ascii) {
  function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  const mathPow = Math.pow, maxWord = mathPow(2, 32);
  let lengthProperty = 'length', i, j, result = '';
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = jsSha256.h = jsSha256.h || [], k = jsSha256.k = jsSha256.k || [];
  let primeCounter = k[lengthProperty];
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;
  let H = hash.slice(0, 8);
  for (j = 0; j < words[lengthProperty];) {
    const wSub = words.slice(j, j += 16);
    const oldHash = H.slice(0);
    for (i = 0; i < 64; i++) {
      const w15 = wSub[i - 15], w2 = wSub[i - 2];
      const a = H[0], e = H[4];
      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & H[5]) ^ ((~e) & H[6]);
      const temp1 = H[7] + s1 + ch + k[i] + (wSub[i] = (i < 16) ? wSub[i] : (
        wSub[i - 16] +
        (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
        wSub[i - 7] +
        (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
      ) | 0);
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & H[1]) ^ (a & H[2]) ^ (H[1] & H[2]);
      const temp2 = s0 + maj;
      H = [(temp1 + temp2) | 0, a, H[1], H[2], (H[3] + temp1) | 0, e, H[5], H[6]];
    }
    for (i = 0; i < 8; i++) H[i] = (H[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byteVal = (H[i] >> (8 * b)) & 255;
      result += (byteVal < 16 ? '0' : '') + byteVal.toString(16);
    }
  }
  return result;
}

// Compute SHA-256 Hex
async function sha256Hex(text) {
  if (window.crypto && crypto.subtle) {
    try {
      const utf8 = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      console.warn("crypto.subtle failed, fallback to jsSha256", e);
    }
  }
  return jsSha256(text);
}

// Check PIN validity against hash
async function isPinValid(inputPin) {
  if (!inputPin) return false;
  const inputHash = await sha256Hex(inputPin);

  // 1. Check against pinHash in database
  if (APP_DB.church && APP_DB.church.pinHash) {
    return inputHash === APP_DB.church.pinHash;
  }

  // 2. Legacy fallback: check against plain text pin and migrate
  if (APP_DB.church && APP_DB.church.pin) {
    if (inputPin === APP_DB.church.pin) {
      APP_DB.church.pinHash = inputHash;
      delete APP_DB.church.pin;
      saveDatabase();
      return true;
    }
    return false;
  }

  // 3. Fallback to default hash
  return inputHash === DEFAULT_PIN_HASH;
}

// Lockout Helpers (SessionStorage Based)
function getLockoutRemainingMs() {
  const lockoutUntil = parseInt(sessionStorage.getItem("gpdi_admin_lockout_until") || "0", 10);
  const now = Date.now();
  return lockoutUntil > now ? (lockoutUntil - now) : 0;
}

function checkLockoutState() {
  const remainingMs = getLockoutRemainingMs();
  const notice = document.getElementById("pinLockoutNotice");
  const text = document.getElementById("pinLockoutText");
  const input = document.getElementById("adminPinInput");
  const submitBtn = document.getElementById("adminPinSubmitBtn");
  const errMsg = document.getElementById("pinErrorMessage");

  if (remainingMs > 0) {
    const seconds = Math.ceil(remainingMs / 1000);
    if (notice) notice.classList.remove("hidden");
    if (text) text.textContent = `Akses diblokir sementara karena terlalu banyak percobaan salah. Coba lagi dalam ${seconds} detik.`;
    if (input) {
      input.disabled = true;
      input.classList.add("opacity-50", "cursor-not-allowed");
    }
    if (submitBtn) submitBtn.disabled = true;
    if (errMsg) errMsg.classList.add("hidden");

    if (!pinLockoutInterval) {
      pinLockoutInterval = setInterval(() => {
        const rem = getLockoutRemainingMs();
        if (rem <= 0) {
          clearInterval(pinLockoutInterval);
          pinLockoutInterval = null;
          sessionStorage.removeItem("gpdi_admin_lockout_until");
          sessionStorage.setItem("gpdi_admin_failed_attempts", "0");
          checkLockoutState();
        } else {
          if (text) text.textContent = `Akses diblokir sementara karena terlalu banyak percobaan salah. Coba lagi dalam ${Math.ceil(rem / 1000)} detik.`;
        }
      }, 1000);
    }
    return true;
  } else {
    if (notice) notice.classList.add("hidden");
    if (input) {
      input.disabled = false;
      input.classList.remove("opacity-50", "cursor-not-allowed");
    }
    if (submitBtn) submitBtn.disabled = false;
    return false;
  }
}

// Shake animation helper
function shakeElement(el) {
  if (!el) return;
  el.classList.add("shake-anim");
  setTimeout(() => el.classList.remove("shake-anim"), 500);
}

// Show/Hide Password Eye toggles
function togglePinVisibility() {
  const input = document.getElementById("adminPinInput");
  const icon = document.getElementById("pinVisibilityIcon");
  if (!input || !icon) return;
  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "visibility_off";
  } else {
    input.type = "password";
    icon.textContent = "visibility";
  }
}

function toggleInputVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  const icon = btnEl ? btnEl.querySelector(".material-symbols-outlined") : null;
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    if (icon) icon.textContent = "visibility_off";
  } else {
    input.type = "password";
    if (icon) icon.textContent = "visibility";
  }
}

// Admin Inactivity Auto-Lock
function startAdminInactivityTimer() {
  resetAdminInactivityTimer();
  window.addEventListener("mousemove", resetAdminInactivityTimer, { passive: true });
  window.addEventListener("keydown", resetAdminInactivityTimer, { passive: true });
  window.addEventListener("click", resetAdminInactivityTimer, { passive: true });
}

function stopAdminInactivityTimer() {
  if (adminInactivityTimer) clearTimeout(adminInactivityTimer);
  window.removeEventListener("mousemove", resetAdminInactivityTimer);
  window.removeEventListener("keydown", resetAdminInactivityTimer);
  window.removeEventListener("click", resetAdminInactivityTimer);
}

function resetAdminInactivityTimer() {
  if (!isAdminAuthenticated) return;
  if (adminInactivityTimer) clearTimeout(adminInactivityTimer);
  adminInactivityTimer = setTimeout(() => {
    if (isAdminAuthenticated) {
      logoutAdmin();
      showToast("Sesi pengelola terkunci otomatis karena tidak aktif 🔒");
    }
  }, ADMIN_SESSION_TIMEOUT_MS);
}

// Admin Modal Lifecycle
function openAdminModal() {
  const modal = document.getElementById("adminModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.classList.add("overflow-hidden");

  if (isAdminAuthenticated) {
    document.getElementById("pinStep").classList.add("hidden");
    const dashStep = document.getElementById("adminDashboardStep");
    dashStep.classList.remove("hidden");
    dashStep.classList.add("flex");
    const logoutBtn = document.getElementById("adminLogoutBtn");
    if (logoutBtn) {
      logoutBtn.classList.remove("hidden");
      logoutBtn.classList.add("flex");
    }
    populateAdminDashboard();
  } else {
    document.getElementById("pinStep").classList.remove("hidden");
    const dashStep = document.getElementById("adminDashboardStep");
    dashStep.classList.add("hidden");
    dashStep.classList.remove("flex");
    const logoutBtn = document.getElementById("adminLogoutBtn");
    if (logoutBtn) {
      logoutBtn.classList.add("hidden");
      logoutBtn.classList.remove("flex");
    }
    const input = document.getElementById("adminPinInput");
    if (input) input.value = "";
    document.getElementById("pinErrorMessage").classList.add("hidden");
    checkLockoutState();

    setTimeout(() => {
      if (input && !input.disabled) input.focus();
    }, 100);
  }
}

function closeAdminModal() {
  const modal = document.getElementById("adminModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
}

function logoutAdmin() {
  isAdminAuthenticated = false;
  stopAdminInactivityTimer();

  document.getElementById("pinStep").classList.remove("hidden");
  const dashStep = document.getElementById("adminDashboardStep");
  if (dashStep) {
    dashStep.classList.add("hidden");
    dashStep.classList.remove("flex");
  }

  const logoutBtn = document.getElementById("adminLogoutBtn");
  if (logoutBtn) {
    logoutBtn.classList.add("hidden");
    logoutBtn.classList.remove("flex");
  }

  const pinInput = document.getElementById("adminPinInput");
  if (pinInput) pinInput.value = "";
  document.getElementById("pinErrorMessage").classList.add("hidden");

  // Reset change password inputs
  const cur = document.getElementById("adminCurrentPinInput");
  const nP = document.getElementById("adminNewPinInput");
  const cP = document.getElementById("adminConfirmPinInput");
  if (cur) cur.value = "";
  if (nP) nP.value = "";
  if (cP) cP.value = "";
  const changeErr = document.getElementById("changePinErrorMessage");
  if (changeErr) changeErr.classList.add("hidden");

  switchAdminTab("warta");
  showToast("Panel pengelola telah dikunci 🔒");
}

async function verifyAdminPin() {
  if (checkLockoutState()) return;

  const inputEl = document.getElementById("adminPinInput");
  const inputPin = inputEl.value.trim();
  const err = document.getElementById("pinErrorMessage");

  if (!inputPin) {
    err.classList.remove("hidden");
    err.textContent = "Silakan masukkan kata sandi pengelola.";
    shakeElement(inputEl);
    inputEl.focus();
    return;
  }

  const valid = await isPinValid(inputPin);

  if (valid) {
    // Reset failed counter
    sessionStorage.removeItem("gpdi_admin_failed_attempts");
    sessionStorage.removeItem("gpdi_admin_lockout_until");
    err.classList.add("hidden");
    inputEl.value = "";

    isAdminAuthenticated = true;
    startAdminInactivityTimer();

    document.getElementById("pinStep").classList.add("hidden");
    const dashStep = document.getElementById("adminDashboardStep");
    if (dashStep) {
      dashStep.classList.remove("hidden");
      dashStep.classList.add("flex");
    }
    const logoutBtn = document.getElementById("adminLogoutBtn");
    if (logoutBtn) {
      logoutBtn.classList.remove("hidden");
      logoutBtn.classList.add("flex");
    }

    populateAdminDashboard();
    showToast("Akses Pengelola Terbuka ✓");
  } else {
    let failed = parseInt(sessionStorage.getItem("gpdi_admin_failed_attempts") || "0", 10) + 1;
    sessionStorage.setItem("gpdi_admin_failed_attempts", failed.toString());

    shakeElement(inputEl);
    inputEl.value = "";
    inputEl.focus();

    if (failed >= MAX_PIN_ATTEMPTS) {
      sessionStorage.setItem("gpdi_admin_lockout_until", (Date.now() + LOCKOUT_DURATION_MS).toString());
      checkLockoutState();
    } else {
      err.classList.remove("hidden");
      const remainingAttempts = MAX_PIN_ATTEMPTS - failed;
      err.textContent = `Kata sandi salah! Sisa percobaan: ${remainingAttempts} kali.`;
    }
  }
}

// Handle Change Admin PIN
async function handleChangeAdminPin() {
  const curInput = document.getElementById("adminCurrentPinInput").value.trim();
  const newInput = document.getElementById("adminNewPinInput").value.trim();
  const confInput = document.getElementById("adminConfirmPinInput").value.trim();
  const errBox = document.getElementById("changePinErrorMessage");

  errBox.classList.add("hidden");
  errBox.textContent = "";

  if (!curInput) {
    errBox.classList.remove("hidden");
    errBox.textContent = "Masukkan kata sandi saat ini terlebih dahulu.";
    return;
  }

  const isCurValid = await isPinValid(curInput);
  if (!isCurValid) {
    errBox.classList.remove("hidden");
    errBox.textContent = "Kata sandi saat ini salah!";
    return;
  }

  if (newInput.length < 6) {
    errBox.classList.remove("hidden");
    errBox.textContent = "Kata sandi baru minimal harus 6 karakter demi keamanan!";
    return;
  }

  if (newInput !== confInput) {
    errBox.classList.remove("hidden");
    errBox.textContent = "Konfirmasi kata sandi baru tidak cocok!";
    return;
  }

  // Generate new SHA-256 hash and update
  const newHash = await sha256Hex(newInput);
  if (!APP_DB.church) APP_DB.church = {};
  APP_DB.church.pinHash = newHash;
  delete APP_DB.church.pin;

  await saveDatabase();

  document.getElementById("adminCurrentPinInput").value = "";
  document.getElementById("adminNewPinInput").value = "";
  document.getElementById("adminConfirmPinInput").value = "";

  showToast("Kata sandi pengelola berhasil diubah! 🔒");
}

// Admin Tab Switching
function switchAdminTab(tabName) {
  document.querySelectorAll(".admin-tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.add("hidden"));

  const targetBtn = document.getElementById(`tabBtn_${tabName}`);
  const targetContent = document.getElementById(`tabContent_${tabName}`);

  if (targetBtn) {
    targetBtn.classList.add("active");
    try {
      targetBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    } catch (e) {
      targetBtn.scrollIntoView(false);
    }
  }
  if (targetContent) {
    targetContent.classList.remove("hidden");
    targetContent.scrollTop = 0;
  }
}

// Populate Admin Dashboard Fields
function populateAdminDashboard() {
  document.getElementById("adminWartaDateInput").value = APP_DB.warta.editionDate || "November 2026";
  document.getElementById("adminWartaSubtitleInput").value = APP_DB.warta.subtitle || "Edisi Ibadah Raya & Perjamuan Kudus";

  renderAdminJadwalTable();
  renderAdminPengumumanList();
  renderAdminPersekutuanList();
  renderAdminDocFolders();
  renderAdminRenunganSelects();
  renderAdminRenunganArticlesList();
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
// PENGUMUMAN ADMIN CRUD (EDIT, UNGGAH MEDIA, HAPUS PERMANEN)
// -------------------------------------------------------------
function handlePengumumanMediaTypeChange() {
  const type = document.getElementById("formPengumumanMediaType").value;
  const wrapper = document.getElementById("pengumumanFileInputWrapper");
  const label = document.getElementById("pengumumanFileInputLabel");
  const input = document.getElementById("formPengumumanMediaFile");
  if (!wrapper || !input) return;

  if (type === "none") {
    wrapper.classList.add("hidden");
  } else if (type === "image") {
    wrapper.classList.remove("hidden");
    label.textContent = "Pilih Gambar (PNG/JPG):";
    input.accept = "image/*";
  } else if (type === "video") {
    wrapper.classList.remove("hidden");
    label.textContent = "Pilih Video (MP4/WebM):";
    input.accept = "video/*";
  } else if (type === "document") {
    wrapper.classList.remove("hidden");
    label.textContent = "Pilih Dokumen (PDF/DOC):";
    input.accept = ".pdf,.doc,.docx,application/pdf";
  }
}

function renderAdminPengumumanList() {
  const container = document.getElementById("adminPengumumanList");
  if (!container) return;

  const list = APP_DB.pengumuman || [];
  if (!list.length) {
    container.innerHTML = `<span class="text-xs text-royal-navy/50 italic py-2">Belum ada pengumuman kegiatan yang dibuat.</span>`;
    return;
  }

  let html = "";
  list.forEach((item, index) => {
    const isItemActive = item.active !== false;
    let typeBadge = "";
    if (item.mediaType === "image") {
      typeBadge = `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">Foto/Gambar</span>`;
    } else if (item.mediaType === "video") {
      typeBadge = `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800">Video</span>`;
    } else if (item.mediaType === "document") {
      typeBadge = `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">Dokumen PDF</span>`;
    } else {
      typeBadge = `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-700">Teks</span>`;
    }

    html += `
      <div class="p-3 rounded-xl bg-sky-cloud/30 border border-sky-soft flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div class="flex flex-col gap-0.5 min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <strong class="font-serif text-royal-navy text-[12px]">${item.judul}</strong>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${isItemActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}">
              ${isItemActive ? 'Aktif' : 'Nonaktif'}
            </span>
            ${typeBadge}
          </div>
          <span class="text-[10px] text-royal-navy/60 font-sans">${item.tanggal || 'Warta Jemaat'} • ${(item.deskripsi || '').slice(0, 75)}...</span>
        </div>
        <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <button type="button" onclick="togglePengumumanActive('${item.id}')" title="${isItemActive ? 'Nonaktifkan' : 'Aktifkan'}" class="px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition active:scale-95 ${isItemActive ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300'}">
            ${isItemActive ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
          <button type="button" onclick="editPengumuman('${item.id}')" class="px-2 py-1 rounded-lg bg-sky-soft hover:bg-sky-mid/60 text-royal-navy font-semibold text-[10px] flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px]">edit</span> Edit
          </button>
          <button type="button" onclick="deletePengumuman('${item.id}')" class="text-rose-500 hover:text-rose-700 p-1" title="Hapus Permanen">
            <span class="material-symbols-outlined text-[17px]">delete</span>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

async function submitPengumuman() {
  const judul = document.getElementById("formPengumumanJudul").value.trim();
  const tanggal = document.getElementById("formPengumumanTanggal").value.trim();
  const deskripsi = document.getElementById("formPengumumanDeskripsi").value.trim();
  const mediaType = document.getElementById("formPengumumanMediaType").value;
  const fileInput = document.getElementById("formPengumumanMediaFile");

  if (!judul || !deskripsi) {
    alert("Harap isi judul dan deskripsi pengumuman");
    return;
  }

  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      await finalizeSubmitPengumuman(judul, tanggal, deskripsi, mediaType, e.target.result, file.name);
    };
    reader.readAsDataURL(file);
    return;
  }

  // Jika sedang edit dan tidak ganti file, pertahankan media sebelumnya
  let existingMediaUrl = "";
  let existingFileName = "";
  if (editingPengumumanId) {
    const existing = (APP_DB.pengumuman || []).find(p => p.id === editingPengumumanId);
    if (existing && existing.mediaType === mediaType) {
      existingMediaUrl = existing.mediaUrl || "";
      existingFileName = existing.fileName || "";
    }
  }

  await finalizeSubmitPengumuman(judul, tanggal, deskripsi, mediaType, existingMediaUrl, existingFileName);
}

async function finalizeSubmitPengumuman(judul, tanggal, deskripsi, mediaType, mediaUrl, fileName) {
  if (!APP_DB.pengumuman) APP_DB.pengumuman = [];

  if (editingPengumumanId) {
    const item = APP_DB.pengumuman.find(p => p.id === editingPengumumanId);
    if (item) {
      item.judul = judul;
      item.tanggal = tanggal || "Warta Jemaat";
      item.deskripsi = deskripsi;
      item.mediaType = mediaType;
      if (mediaUrl || mediaType === "none") item.mediaUrl = mediaUrl;
      if (fileName) item.fileName = fileName;
      showToast("Pengumuman berhasil diperbarui! ✓");
    }
    cancelEditPengumuman();
  } else {
    APP_DB.pengumuman.unshift({
      id: "ann_" + Date.now(),
      judul,
      tanggal: tanggal || "Warta Jemaat",
      deskripsi,
      mediaType,
      mediaUrl,
      fileName,
      active: true,
      createdAt: Date.now()
    });
    showToast("Pengumuman baru berhasil diterbitkan! ✓");
    resetPengumumanForm();
  }

  await saveDatabase();
  renderAdminPengumumanList();
  renderPengumumanCarousel();
}

function editPengumuman(id) {
  const item = (APP_DB.pengumuman || []).find(p => p.id === id);
  if (!item) return;

  editingPengumumanId = id;
  document.getElementById("formPengumumanJudul").value = item.judul || "";
  document.getElementById("formPengumumanTanggal").value = item.tanggal || "";
  document.getElementById("formPengumumanDeskripsi").value = item.deskripsi || "";
  document.getElementById("formPengumumanMediaType").value = item.mediaType || "none";
  handlePengumumanMediaTypeChange();

  document.getElementById("pengumumanFormTitle").textContent = "1. Edit Pengumuman";
  document.getElementById("btnSubmitPengumuman").textContent = "Perbarui Pengumuman";
  document.getElementById("btnCancelEditPengumuman").classList.remove("hidden");

  // Scroll to form
  const tab = document.getElementById("tabContent_pengumuman");
  if (tab) tab.scrollTop = 0;
}

function cancelEditPengumuman() {
  editingPengumumanId = null;
  resetPengumumanForm();
  document.getElementById("pengumumanFormTitle").textContent = "1. Tambah Pengumuman Baru (Carousel)";
  document.getElementById("btnSubmitPengumuman").textContent = "Terbitkan Pengumuman";
  document.getElementById("btnCancelEditPengumuman").classList.add("hidden");
}

function resetPengumumanForm() {
  document.getElementById("formPengumumanJudul").value = "";
  document.getElementById("formPengumumanTanggal").value = "";
  document.getElementById("formPengumumanDeskripsi").value = "";
  document.getElementById("formPengumumanMediaType").value = "none";
  document.getElementById("formPengumumanMediaFile").value = "";
  handlePengumumanMediaTypeChange();
}

async function togglePengumumanActive(id) {
  const item = (APP_DB.pengumuman || []).find(p => p.id === id);
  if (item) {
    item.active = item.active === false ? true : false;
    await saveDatabase();
    renderAdminPengumumanList();
    renderPengumumanCarousel();
    showToast(`Status pengumuman diubah jadi ${item.active ? 'Aktif' : 'Nonaktif'}!`);
  }
}

async function deletePengumuman(id) {
  if (confirm("Hapus pengumuman ini secara permanen dari database?")) {
    APP_DB.pengumuman = (APP_DB.pengumuman || []).filter(p => p.id !== id);
    if (editingPengumumanId === id) cancelEditPengumuman();
    await saveDatabase();
    renderAdminPengumumanList();
    renderPengumumanCarousel();
    showToast("Pengumuman berhasil dihapus permanen dari database! ✓");
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

  if (imgInput.files && imgInput.files[0]) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      await saveOrUpdateArticle(folderId, title, ayat, konten, e.target.result);
    };
    reader.readAsDataURL(imgInput.files[0]);
    return;
  }

  // Jika edit dan tidak ada gambar baru yang dipilih, pertahankan gambar lama
  let existingImg = "";
  if (editingRenunganArticleId) {
    const existing = (APP_DB.renungan.articles || []).find(a => a.id === editingRenunganArticleId);
    if (existing) existingImg = existing.imageUrl || "";
  }

  await saveOrUpdateArticle(folderId, title, ayat, konten, existingImg);
}

async function saveOrUpdateArticle(folderId, title, ayat, konten, imageUrl) {
  if (!APP_DB.renungan.articles) APP_DB.renungan.articles = [];

  if (editingRenunganArticleId) {
    const art = APP_DB.renungan.articles.find(a => a.id === editingRenunganArticleId);
    if (art) {
      art.folderId = folderId;
      art.title = title;
      art.ayat = ayat;
      art.konten = konten;
      if (imageUrl !== undefined) art.imageUrl = imageUrl;
      showToast("Renungan berhasil diperbarui! ✓");
    }
    cancelEditRenunganArticle();
  } else {
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
    showToast("Renungan harian berhasil diterbitkan! ✓");
    cancelEditRenunganArticle();
  }

  await saveDatabase();
  renderAdminRenunganArticlesList();
  renderRenungan();
}

function renderAdminRenunganArticlesList() {
  const container = document.getElementById("adminRenunganArticlesList");
  if (!container) return;

  const articles = (APP_DB.renungan && APP_DB.renungan.articles) || [];
  if (!articles.length) {
    container.innerHTML = `<span class="text-xs text-royal-navy/50 italic py-2">Belum ada artikel renungan harian.</span>`;
    return;
  }

  let html = "";
  articles.forEach(art => {
    const folder = findFolderById(art.folderId);
    const folderName = folder ? folder.name : "Tanpa Folder";

    html += `
      <div class="p-2.5 rounded-xl bg-sky-cloud/30 border border-sky-soft flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div class="flex flex-col min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <strong class="font-serif text-royal-navy text-[12px]">${art.title}</strong>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-soft text-royal-navy">📁 ${folderName}</span>
          </div>
          <span class="text-[10px] text-royal-navy/60 font-sans">${art.date} ${art.ayat ? `• <em>(${art.ayat})</em>` : ''} • ${(art.konten || '').slice(0, 60)}...</span>
        </div>
        <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <button type="button" onclick="editRenunganArticle('${art.id}')" class="px-2 py-1 rounded-lg bg-sky-soft hover:bg-sky-mid/60 text-royal-navy font-semibold text-[10px] flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px]">edit</span> Edit
          </button>
          <button type="button" onclick="deleteRenunganArticle('${art.id}')" class="text-rose-500 hover:text-rose-700 p-1" title="Hapus Permanen">
            <span class="material-symbols-outlined text-[17px]">delete</span>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function editRenunganArticle(id) {
  const art = (APP_DB.renungan.articles || []).find(a => a.id === id);
  if (!art) return;

  editingRenunganArticleId = id;
  const folderSelect = document.getElementById("adminRenunganArticleFolderSelect");
  if (folderSelect && art.folderId) folderSelect.value = art.folderId;

  document.getElementById("formRenunganTitle").value = art.title || "";
  document.getElementById("formRenunganAyat").value = art.ayat || "";
  document.getElementById("formRenunganContent").value = art.konten || "";

  document.getElementById("renunganFormTitle").textContent = "2. Edit Renungan Harian";
  document.getElementById("btnSubmitRenungan").textContent = "Perbarui Renungan";
  document.getElementById("btnCancelEditRenungan").classList.remove("hidden");

  // Scroll to form
  const formEl = document.getElementById("renunganFormTitle");
  if (formEl) formEl.scrollIntoView({ behavior: "smooth" });
}

function cancelEditRenunganArticle() {
  editingRenunganArticleId = null;
  document.getElementById("formRenunganTitle").value = "";
  document.getElementById("formRenunganAyat").value = "";
  document.getElementById("formRenunganContent").value = "";
  document.getElementById("formRenunganImageInput").value = "";
  document.getElementById("renunganFormTitle").textContent = "2. Tulis & Unggah Renungan Harian";
  document.getElementById("btnSubmitRenungan").textContent = "Terbitkan Renungan";
  document.getElementById("btnCancelEditRenungan").classList.add("hidden");
}

async function deleteRenunganArticle(id) {
  if (confirm("Hapus artikel renungan ini secara permanen dari database?")) {
    APP_DB.renungan.articles = (APP_DB.renungan.articles || []).filter(a => a.id !== id);
    if (editingRenunganArticleId === id) cancelEditRenunganArticle();
    await saveDatabase();
    renderAdminRenunganArticlesList();
    renderRenungan();
    showToast("Renungan berhasil dihapus permanen dari database! ✓");
  }
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
  showToast("Menyinkronkan data dari Cloud...");
  await loadDatabase();
  renderAll();
  showToast("Sinkronisasi Cloud Berhasil! ✓ Data Terkini Tampil");
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
  { key: "pengumuman", label: "Pengumuman Gereja (Carousel)", desc: "Warta geser info kegiatan, banner visual & dokumen jemaat", icon: "campaign" },
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
      pengumuman: true,
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
