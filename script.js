// module entry
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import {
  getDatabase, ref, set, push, remove, onValue, update
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

/* Config Database Barang */
const firebaseConfigBarang = {
  apiKey: "AIzaSyDvaODMK4sLyLkclEp29JBWCI100bctII0",
  authDomain: "pi-barang.firebaseapp.com",
  databaseURL: "https://pi-barang-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pi-barang",
  storageBucket: "pi-barang.firebasestorage.app",
  messagingSenderId: "1374610989",
  appId: "1:1374610989:web:0d35285e9c868a7ea8faa4",
  measurementId: "G-3LWVBPGNGT"
};

/* Config Database Alat */
const firebaseConfigAlat = {
  apiKey: "AIzaSyBfaKu155uy0ddui4Xq9e5fhPtHcEiNTAo",
  authDomain: "pi-alat.firebaseapp.com",
  databaseURL: "https://pi-alat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pi-alat",
  storageBucket: "pi-alat.firebasestorage.app",
  messagingSenderId: "587198376954",
  appId: "1:587198376954:web:3c1185ace9c3005ff01243",
  measurementId: "G-8EZ9HBQYY1"
};

/* initialize two apps with names */
const appBarang = initializeApp(firebaseConfigBarang, "appBarang");
const auth = getAuth(appBarang);
const analyticsBarang = getAnalytics(appBarang);
const dbBarang = getDatabase(appBarang);

// AUTO LOGIN (WAJIB)
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentRole = "admin";
    afterLogin();
  } else {
    currentRole = null;
    loginCard.style.display = "block";
    appRoot.style.display = "none";
  }
});

const appAlat = initializeApp(firebaseConfigAlat, "appAlat");
const analyticsAlat = getAnalytics(appAlat);
const dbAlat = getDatabase(appAlat);

/* =======================================================
   LOGIN CONFIG
======================================================= */

let currentRole = null; // 'admin' | 'guest'

/* =======================================================
   DOM ELEMENTS (global)
======================================================= */
const loginCard = document.getElementById("loginCard");
const appRoot = document.getElementById("app");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const btnLogin = document.getElementById("btnLogin");
const btnGuest = document.getElementById("btnGuest");
const togglePassword = document.getElementById("togglePassword");

const btnSwitch = document.getElementById("btnSwitch");
const btnLogout = document.getElementById("btnLogout");
const appTitle = document.getElementById("appTitle");

/* edit modal shared */
const editModal = document.getElementById("editModal");
const editModalTitle = document.getElementById("editModalTitle");
const editFieldsBarang = document.getElementById("editFieldsBarang");
const editFieldsAlat = document.getElementById("editFieldsAlat");
const btnUpdate = document.getElementById("btnUpdate");
const btnCancelEdit = document.getElementById("btnCancelEdit");

/* =======================================================
   STATE untuk barang & alat (terpisah)
======================================================= */
let stokBarang = {};
let riwayat = [];
let editMode = null;

let stokAlat = {};
let riwayatAlat = [];

/* =======================================================
   ELEMS (barang) - prefix barang_
======================================================= */
const barang_inputNama = document.getElementById("barang_inputNama");
const barang_inputJumlah = document.getElementById("barang_inputJumlah");
const barang_inputSatuan = document.getElementById("barang_inputSatuan");
const barang_inputTanggal = document.getElementById("barang_inputTanggal");
const barang_btnSimpan = document.getElementById("barang_btnSimpan");
const barang_btnReset = document.getElementById("barang_btnReset");
const barang_searchBar = document.getElementById("barang_searchBar");
const barang_searchStok = document.getElementById("barang_searchStok");
const barang_tabelStokBody = document.querySelector("#barang_tabelStok tbody");
const barang_tabelRiwayatBody = document.querySelector("#barang_tabelRiwayat tbody");
const barang_btnExportStok = document.getElementById("barang_btnExportStok");
const barang_btnExportRiwayat = document.getElementById("barang_btnExportRiwayat");
const barang_bulanExport = document.getElementById("barang_bulanExport");

/* edit modal barang inputs */
const edit_barang_nama = document.getElementById("edit_barang_nama");
const edit_barang_jumlah = document.getElementById("edit_barang_jumlah");
const edit_barang_satuan = document.getElementById("edit_barang_satuan");

/* =======================================================
   ELEMS (alat) - prefix alat_
======================================================= */
const alat_inputNama = document.getElementById("alat_inputNama");
const alat_inputSpesifikasi = document.getElementById("alat_inputSpesifikasi");
const alat_inputJumlah = document.getElementById("alat_inputJumlah");
const alat_inputSatuan = document.getElementById("alat_inputSatuan");
const alat_inputKeterangan = document.getElementById("alat_inputKeterangan");
const alat_inputTanggal = document.getElementById("alat_inputTanggal");
const alat_btnSimpan = document.getElementById("alat_btnSimpan");
const alat_btnReset = document.getElementById("alat_btnReset");
const alat_searchBar = document.getElementById("alat_searchBar");
const alat_searchStok = document.getElementById("alat_searchStok");
const alat_tabelStokBody = document.querySelector("#alat_tabelStok tbody");
const alat_tabelRiwayatBody = document.querySelector("#alat_tabelRiwayat tbody");
const alat_btnExportStok = document.getElementById("alat_btnExportStok");
const alat_btnExportRiwayat = document.getElementById("alat_btnExportRiwayat");
const alat_bulanExport = document.getElementById("alat_bulanExport");

/* edit modal alat inputs */
const edit_alat_nama = document.getElementById("edit_alat_nama");
const edit_alat_spesifikasi = document.getElementById("edit_alat_spesifikasi");
const edit_alat_jumlah = document.getElementById("edit_alat_jumlah");
const edit_alat_satuan = document.getElementById("edit_alat_satuan");
const edit_alat_keterangan = document.getElementById("edit_alat_keterangan");

/* pages */
const pageBarang = document.getElementById("pageBarang");
const pageAlat = document.getElementById("pageAlat");
const formBarangCard = document.getElementById("formBarangCard");
const formAlatCard = document.getElementById("formAlatCard");

/* =======================================================
   LOGIN & UI
======================================================= */
btnLogin.addEventListener("click", () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      currentRole = "admin";
      afterLogin();
    })
    .catch((error) => {
      alert("Login gagal: " + error.message);
    });
});

btnGuest.addEventListener("click", () => {
  currentRole = "guest";
  afterLogin();
});

if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const type = loginPassword.getAttribute("type") === "password" ? "text" : "password";
    loginPassword.setAttribute("type", type);
    togglePassword.textContent = type === "password" ? "😑" : "😐";
  });
}

function afterLogin() {
  loginCard.style.display = "none";
  appRoot.style.display = "block";
  // default halaman: Barang
  showPage("barang");
  applyRoleUI();
  attachListeners();
}

/* logout simple (reset UI) */
btnLogout.addEventListener("click", () => {
  if (currentRole === "guest") {
    currentRole = null;
    loginCard.style.display = "block";
    appRoot.style.display = "none";
  } else {
    signOut(auth).then(() => {
      currentRole = null;
      loginEmail.value = "";
      loginPassword.value = "";
      loginCard.style.display = "block";
      appRoot.style.display = "none";
    });
  }
});

/* switch halaman */
btnSwitch.addEventListener("click", () => {
  const isBarang = pageBarang.style.display !== "none";
  showPage(isBarang ? "alat" : "barang");
});

function showPage(page) {
  if (page === "barang") {
    pageBarang.style.display = "block";
    pageAlat.style.display = "none";
    appTitle.textContent = "Stok Barang";
    btnSwitch.textContent = "Stok Alat";
  } else {
    pageBarang.style.display = "none";
    pageAlat.style.display = "block";
    appTitle.textContent = "Stok Alat";
    btnSwitch.textContent = "Stok Barang";
  }
}

/* disable/enable inputs based on role */
function applyRoleUI() {
  const isGuest = currentRole === "guest";
  btnLogout.textContent = isGuest ? "Halaman Login" : "Logout";

  if (isGuest) {
    if (formBarangCard) formBarangCard.style.display = "none";
    if (formAlatCard) formAlatCard.style.display = "none";
  } else {
    if (formBarangCard) formBarangCard.style.display = "block";
    if (formAlatCard) formAlatCard.style.display = "block";
  }

  // barang
  barang_inputNama.disabled = isGuest;
  barang_inputJumlah.disabled = isGuest;
  barang_inputSatuan.disabled = isGuest;
  barang_inputTanggal.disabled = isGuest;
  barang_btnSimpan.disabled = isGuest;
  barang_btnReset.disabled = isGuest;
  barang_bulanExport.disabled = false;

  // alat
  alat_inputNama.disabled = isGuest;
  alat_inputSpesifikasi.disabled = isGuest;
  alat_inputJumlah.disabled = isGuest;
  alat_inputSatuan.disabled = isGuest;
  alat_inputKeterangan.disabled = isGuest;
  alat_inputTanggal.disabled = isGuest;
  alat_btnSimpan.disabled = isGuest;
  alat_btnReset.disabled = isGuest;
  alat_bulanExport.disabled = false;

  renderStok();
  renderRiwayat();
  renderStokAlat();
  renderRiwayatAlat();
}

/* =======================================================
   LOGIC: BARANG (database di dbBarang path: stok, riwayat)
======================================================= */
function resetFormBarang() {
  barang_inputNama.value = "";
  barang_inputJumlah.value = "";
  barang_inputSatuan.value = "";
  barang_inputTanggal.value = "";
}

barang_btnReset.addEventListener("click", () => {
  resetFormBarang();
});

/* SIMPAN BARANG */
barang_btnSimpan.addEventListener("click", () => {
  if (currentRole === "guest") {
    alert("Mode Tamu: tidak diizinkan mengubah data.");
    return;
  }
  const nama = (barang_inputNama.value || "").trim();
  const jumlah = Number(barang_inputJumlah.value);
  const satuan = (barang_inputSatuan.value || "").trim() || "-";
  const tanggal = barang_inputTanggal.value;

  if (!nama) return alert("Nama barang wajib diisi.");
  if (!tanggal) return alert("Tanggal wajib diisi.");
  if (Number.isNaN(jumlah)) return alert("Jumlah harus angka.");
  if (jumlah === 0) return alert("Jumlah tidak boleh 0.");

  const stokLama = stokBarang[nama]?.jumlah || 0;
  const sisaBaru = stokLama + jumlah;
  if (jumlah < 0 && sisaBaru < 0) return alert(`Stok tidak cukup. Stok saat ini: ${stokLama}`);

  set(ref(dbBarang, `stok/${nama}`), { jumlah: sisaBaru, satuan })
    .then(() => {
      return push(ref(dbBarang, "riwayat"), {
        tanggal,
        nama,
        perubahan: jumlah,
        sisa: sisaBaru,
        satuan
      });
    })
    .then(() => {
      alert("✅ Data berhasil disimpan.");
      resetFormBarang();
    })
    .catch(err => console.error("❌ Gagal menyimpan data:", err));
});

/* RENDER STOK BARANG */
function renderStok() {
  barang_tabelStokBody.innerHTML = "";
  const key = (barang_searchStok.value || "").trim().toLowerCase();
  const filtered = Object.keys(stokBarang).filter(nama => nama.toLowerCase().includes(key));

  if (filtered.length === 0) {
    barang_tabelStokBody.innerHTML = `<tr><td colspan="4">Tidak ada stok</td></tr>`;
    return;
  }

  const isGuest = currentRole === "guest";
  const fragment = document.createDocumentFragment();
  filtered.sort().forEach(nama => {
    const item = stokBarang[nama];
    const jumlah = item?.jumlah ?? 0;
    const satuan = item?.satuan ?? "-";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(nama)}</td>
      <td>
        <span>${jumlah}</span>
        ${isGuest ? "" : `
          <input type="text" class="input-perubahan-stok" data-nama="${escapeHtml(nama)}" style="width: 60px; margin-left: 10px;" placeholder="+/-" oninput="this.value = this.value.replace(/[^0-9-]/g, '')" />
        `}
      </td>
      <td>${escapeHtml(satuan)}</td>
      <td>
        ${isGuest ? "" : `
          <button class="smallBtn btn-simpan-perubahan" data-nama="${escapeHtml(nama)}" disabled>Simpan</button>
          <button class="smallBtn" data-edit-barang="${escapeHtml(nama)}">Edit</button>
          <button class="smallBtn" data-hapus-barang="${escapeHtml(nama)}">Hapus</button>
        `}
      </td>
    `;
    fragment.appendChild(tr);
  });
  barang_tabelStokBody.appendChild(fragment);

  if (!currentRole || currentRole === "guest") return;

  document.querySelectorAll(".input-perubahan-stok").forEach(input => {
    input.addEventListener("input", (e) => {
      const nama = e.target.getAttribute("data-nama");
      const btnSimpan = document.querySelector(`.btn-simpan-perubahan[data-nama="${CSS.escape(nama)}"]`);
      if (btnSimpan) {
        btnSimpan.disabled = (e.target.value === "" || e.target.value === "0");
      }
    });
  });

  document.querySelectorAll(".btn-simpan-perubahan").forEach(btn => {
    btn.addEventListener("click", () => {
      const nama = btn.getAttribute("data-nama");
      const input = document.querySelector(`.input-perubahan-stok[data-nama="${CSS.escape(nama)}"]`);
      if (!input) return;
      const perubahan = Number(input.value);
      if (Number.isNaN(perubahan) || perubahan === 0) return;

      const itemLama = stokBarang[nama];
      const jumlahLama = itemLama?.jumlah ?? 0;
      const sisaBaru = jumlahLama + perubahan;
      const satuan = itemLama?.satuan ?? "-";

      if (perubahan < 0 && sisaBaru < 0) {
        return alert(`Stok tidak cukup. Stok saat ini: ${jumlahLama}`);
      }

      const tanggal = todayISO();

      set(ref(dbBarang, `stok/${nama}`), { jumlah: sisaBaru, satuan })
        .then(() => {
          return push(ref(dbBarang, "riwayat"), {
            tanggal,
            nama,
            perubahan,
            sisa: sisaBaru,
            satuan
          });
        })
        .then(() => {
          alert("✅ Perubahan stok berhasil disimpan.");
        })
        .catch(err => console.error("❌ Gagal menyimpan perubahan:", err));
    });
  });

  document.querySelectorAll("[data-hapus-barang]").forEach(btn => {
    btn.addEventListener("click", () => {
      const namaBarang = btn.getAttribute("data-hapus-barang");
      if (!confirm(`Yakin menghapus barang "${namaBarang}"?`)) return;
      remove(ref(dbBarang, `stok/${namaBarang}`));
      onValue(ref(dbBarang, "riwayat"), snapshot => {
        snapshot.forEach(child => {
          if (child.val().nama === namaBarang) remove(ref(dbBarang, `riwayat/${child.key}`));
        });
      }, { onlyOnce: true });
    });
  });

  document.querySelectorAll("[data-edit-barang]").forEach(btn => {
    btn.addEventListener("click", () => {
      const namaBarang = btn.getAttribute("data-edit-barang");
      const item = stokBarang[namaBarang];
      editMode = { type: "barang", namaLama: namaBarang };
      editModalTitle.textContent = `Edit Barang: ${namaBarang}`;
      editFieldsBarang.style.display = "block";
      editFieldsAlat.style.display = "none";
      edit_barang_nama.value = namaBarang;
      edit_barang_jumlah.value = item?.jumlah ?? 0;
      edit_barang_satuan.value = item?.satuan ?? "-";
      editModal.style.display = "flex";
    });
  });
}

/* RENDER RIWAYAT BARANG */
function renderRiwayat() {
  let data = [...riwayat];
  const key = (barang_searchBar.value || "").trim().toLowerCase();
  if (key) {
    data = data.filter(it => it.nama.toLowerCase().includes(key) || (it.tanggal || "").includes(key));
  }

  barang_tabelRiwayatBody.innerHTML = "";
  if (data.length === 0) {
    barang_tabelRiwayatBody.innerHTML = `<tr> <td colspan="7">Tidak ada riwayat</td></tr> `;
    return;
  }

  const isGuest = currentRole === "guest";

  const fragment = document.createDocumentFragment();
  data.forEach((it, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td> ${idx + 1}</td>
      <td>${escapeHtml(it.tanggal)}</td>
      <td>${escapeHtml(it.nama)}</td>
      <td>${it.perubahan > 0 ? "+" + it.perubahan : it.perubahan}</td>
      <td>${it.sisa}</td>
      <td>${escapeHtml(it.satuan ?? "-")}</td>
      <td>${isGuest ? "" : `<button class="smallBtn" data-id="${it.id}">Hapus</button>`}</td>
    `;
    fragment.appendChild(tr);
  });
  barang_tabelRiwayatBody.appendChild(fragment);

  if (!currentRole || currentRole === "guest") return;

  document.querySelectorAll("#barang_tabelRiwayat .smallBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (id && confirm(`Yakin ingin menghapus riwayat ini?`)) {
        remove(ref(dbBarang, `riwayat/${id}`));
      }
    });
  });
}

/* real-time listeners barang */
let listenersAttached = false;

function attachListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  const handleDbError = (err) => {
    if (err.code === "PERMISSION_DENIED") {
      alert("Akses Ditolak oleh Firebase (Permission Denied). Data tidak bisa ditampilkan.nnSolusi: Anda harus mengubah Rules Firebase Realtime Database 'pi-barang' bagian .read menjadi 'true' agar Guest bisa melihat data.");
      console.error("Firebase Permission Denied:", err);
    }
  };

  onValue(ref(dbBarang, "stok"), snapshot => {
    stokBarang = snapshot.val() || {};
    renderStok();
  }, handleDbError);

  onValue(ref(dbBarang, "riwayat"), snapshot => {
    const arr = [];
    const currentYear = new Date().getFullYear().toString();
    const updatesToHapus = {};
    let hasOldData = false;

    snapshot.forEach(child => {
      const data = child.val();
      if (data.tanggal && data.tanggal.startsWith(currentYear)) {
        arr.push({ id: child.key, ...data });
      } else if (data.tanggal && !data.tanggal.startsWith(currentYear)) {
        updatesToHapus[child.key] = null;
        hasOldData = true;
      }
    });

    if (hasOldData && currentRole === "admin") {
      update(ref(dbBarang, "riwayat"), updatesToHapus).catch(err => console.error("Gagal hapus riwayat lama:", err));
    }
    arr.sort((a, b) => {
      if (a.tanggal === b.tanggal) return a.id < b.id ? 1 : -1;
      return (a.tanggal < b.tanggal ? 1 : -1);
    });
    riwayat = arr;
    renderRiwayat();
  }, handleDbError);

  /* real-time listeners alat */
  onValue(ref(dbAlat, "stokAlat"), snapshot => {
    stokAlat = snapshot.val() || {};
    renderStokAlat();
  }, handleDbError);

  onValue(ref(dbAlat, "riwayatAlat"), snapshot => {
    const arr = [];
    const currentYear = new Date().getFullYear().toString();
    const updatesToHapus = {};
    let hasOldData = false;

    snapshot.forEach(child => {
      const data = child.val();
      if (data.tanggal && data.tanggal.startsWith(currentYear)) {
        arr.push({ id: child.key, ...data });
      } else if (data.tanggal && !data.tanggal.startsWith(currentYear)) {
        updatesToHapus[child.key] = null;
        hasOldData = true;
      }
    });

    if (hasOldData && currentRole === "admin") {
      update(ref(dbAlat, "riwayatAlat"), updatesToHapus).catch(err => console.error("Gagal hapus riwayat lama:", err));
    }
    arr.sort((a, b) => {
      if (a.tanggal === b.tanggal) return a.id < b.id ? 1 : -1;
      return (a.tanggal < b.tanggal ? 1 : -1);
    });
    riwayatAlat = arr;
    renderRiwayatAlat();
  }, handleDbError);
}

/* search listeners barang */
barang_searchBar.addEventListener("input", renderRiwayat);
barang_searchStok.addEventListener("input", renderStok);

/* EXPORT BARANG */
document.getElementById("barang_btnExportStok").addEventListener("click", () => {
  const rows = [["Nama Barang", "Jumlah", "Satuan"]];
  Object.keys(stokBarang).sort().forEach(nama => {
    const item = stokBarang[nama];
    rows.push([nama, item?.jumlah ?? 0, item?.satuan ?? "-"]);
  });
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Stok");
  XLSX.writeFile(wb, `stok_barang_${todayCompact()}.xls`);
});

document.getElementById("barang_btnExportRiwayat").addEventListener("click", () => {
  const bulan = (barang_bulanExport.value || "").trim();
  if (!bulan) { alert("Pilih bulan terlebih dahulu."); return; }
  const rows = [["Tanggal", "Nama Barang", "Perubahan", "Sisa", "Satuan"]];
  riwayat.filter(it => (it.tanggal || "").startsWith(bulan)).forEach(it => rows.push([it.tanggal, it.nama, it.perubahan, it.sisa, it.satuan ?? "-"]));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Riwayat");
  XLSX.writeFile(wb, `riwayat_${bulan}.xls`);
});

/* =======================================================
   LOGIC: ALAT (database di dbAlat path: stokAlat, riwayatAlat)
======================================================= */
function resetFormAlat() {
  alat_inputNama.value = "";
  alat_inputSpesifikasi.value = "";
  alat_inputJumlah.value = "";
  alat_inputSatuan.value = "";
  alat_inputTanggal.value = "";
}

alat_btnReset.addEventListener("click", () => resetFormAlat());

/* SIMPAN ALAT */
alat_btnSimpan.addEventListener("click", () => {
  if (currentRole === "guest") {
    alert("Mode Tamu: tidak diizinkan mengubah data.");
    return;
  }

  const nama = alat_inputNama.value.trim();
  const spesifikasi = alat_inputSpesifikasi.value.trim() || "-";
  const jumlah = Number(alat_inputJumlah.value);
  const satuan = alat_inputSatuan.value.trim() || "-";
  const tanggal = alat_inputTanggal.value;
  const keterangan = alat_inputKeterangan.value.trim() || "-";

  if (!nama) return alert("Nama alat wajib diisi.");
  if (!tanggal) return alert("Tanggal wajib diisi.");
  if (Number.isNaN(jumlah)) return alert("Jumlah harus angka.");
  if (jumlah === 0) return alert("Jumlah tidak boleh 0.");

  const stokLama = stokAlat[nama]?.jumlah || 0;
  const sisaBaru = stokLama + jumlah;
  if (jumlah < 0 && sisaBaru < 0) {
    return alert(`Stok tidak cukup. Stok saat ini: ${stokLama}`);
  }

  set(ref(dbAlat, `stokAlat/${nama}`), { jumlah: sisaBaru, satuan, spesifikasi, keterangan })
    .then(() => {
      return push(ref(dbAlat, "riwayatAlat"), {
        tanggal,
        nama,
        spesifikasi,
        perubahan: jumlah,
        sisa: sisaBaru,
        satuan,
        keterangan
      });
    })
    .then(() => {
      alert("✅ Data berhasil disimpan.");
      resetFormInputs();
    })
    .catch(err => console.error("❌ Gagal menyimpan data:", err));
});

alat_btnReset.addEventListener("click", () => {
  resetFormInputs();
  editMode = null;
});

function resetFormInputs() {
  alat_inputNama.value = "";
  alat_inputSpesifikasi.value = "";
  alat_inputJumlah.value = "";
  alat_inputSatuan.value = "";
  alat_inputTanggal.value = "";
  alat_inputKeterangan.value = "";
}

/* RENDER STOK ALAT */
function renderStokAlat() {
  alat_tabelStokBody.innerHTML = "";

  const key = (alat_searchStok.value || "").trim().toLowerCase();
  const filtered = Object.keys(stokAlat).filter(nama =>
    nama.toLowerCase().includes(key)
  );

  if (filtered.length === 0) {
    alat_tabelStokBody.innerHTML = `<tr> <td colspan="6">Tidak ada stok</td></tr> `;
    return;
  }

  const isGuest = currentRole === "guest";

  const fragment = document.createDocumentFragment();
  filtered.sort().forEach(nama => {
    const item = stokAlat[nama];
    const jumlah = item?.jumlah ?? item ?? 0;
    const satuan = item?.satuan ?? "-";
    const spesifikasi = item?.spesifikasi ?? "-";
    const keterangan = item?.keterangan ?? "-";

    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td> ${escapeHtml(nama)}</td>
      <td>${escapeHtml(spesifikasi)}</td>
      <td>
        <span>${jumlah}</span>
        ${isGuest ? "" : `
          <input type="text" class="input-perubahan-alat" data-nama="${escapeHtml(nama)}" style="width: 60px; margin-left: 10px;" placeholder="+/-" oninput="this.value = this.value.replace(/[^0-9-]/g, '')" />
        `}
      </td>
      <td>${escapeHtml(satuan)}</td>
      <td>${escapeHtml(keterangan)}</td>
      <td>
        ${isGuest ? "" : `
          <button class="smallBtn btn-simpan-perubahan-alat" data-nama="${escapeHtml(nama)}" disabled>Simpan</button>
          <button class="smallBtn" data-edit-alat="${escapeHtml(nama)}">Edit</button>
          <button class="smallBtn" data-hapus-alat="${escapeHtml(nama)}">Hapus</button>
        `}
      </td>
    `;
    fragment.appendChild(tr);
  });
  alat_tabelStokBody.appendChild(fragment);

  if (!currentRole || currentRole === "guest") return;

  document.querySelectorAll(".input-perubahan-alat").forEach(input => {
    input.addEventListener("input", (e) => {
      const nama = e.target.getAttribute("data-nama");
      const btnSimpan = document.querySelector(`.btn-simpan-perubahan-alat[data-nama="${CSS.escape(nama)}"]`);
      if (btnSimpan) {
        btnSimpan.disabled = (e.target.value === "" || e.target.value === "0");
      }
    });
  });

  document.querySelectorAll(".btn-simpan-perubahan-alat").forEach(btn => {
    btn.addEventListener("click", () => {
      const nama = btn.getAttribute("data-nama");
      const input = document.querySelector(`.input-perubahan-alat[data-nama="${CSS.escape(nama)}"]`);
      if (!input) return;
      const perubahan = Number(input.value);
      if (Number.isNaN(perubahan) || perubahan === 0) return;

      const itemLama = stokAlat[nama];
      const jumlahLama = itemLama?.jumlah ?? itemLama ?? 0;
      const sisaBaru = jumlahLama + perubahan;
      const satuan = itemLama?.satuan ?? "-";
      const spesifikasi = itemLama?.spesifikasi ?? "-";
      const keterangan = itemLama?.keterangan ?? "-";

      if (perubahan < 0 && sisaBaru < 0) {
        return alert(`Stok tidak cukup. Stok saat ini: ${jumlahLama}`);
      }

      const tanggal = todayISO();

      set(ref(dbAlat, `stokAlat/${nama}`), { jumlah: sisaBaru, satuan, spesifikasi, keterangan })
        .then(() => {
          return push(ref(dbAlat, "riwayatAlat"), {
            tanggal,
            nama,
            spesifikasi,
            perubahan,
            sisa: sisaBaru,
            satuan,
            keterangan
          });
        })
        .then(() => {
          alert("✅ Perubahan stok alat berhasil disimpan.");
        })
        .catch(err => console.error("❌ Gagal menyimpan perubahan:", err));
    });
  });

  document.querySelectorAll("[data-hapus-alat]").forEach(btn => {
    btn.addEventListener("click", () => {
      const namaAlat = btn.getAttribute("data-hapus-alat");
      if (confirm(`Yakin ingin menghapus alat "${namaAlat}"?`)) {
        remove(ref(dbAlat, `stokAlat/${namaAlat}`));
        onValue(ref(dbAlat, "riwayatAlat"), snapshot => {
          snapshot.forEach(child => {
            if (child.val().nama === namaAlat) {
              remove(ref(dbAlat, `riwayatAlat/${child.key}`));
            }
          });
        }, { onlyOnce: true });
      }
    });
  });

  document.querySelectorAll("[data-edit-alat]").forEach(btn => {
    btn.addEventListener("click", () => {
      const namaAlat = btn.getAttribute("data-edit-alat");
      const item = stokAlat[namaAlat];
      editMode = { type: "alat", namaLama: namaAlat };
      editModalTitle.textContent = `Edit Alat: ${namaAlat}`;
      editFieldsBarang.style.display = "none";
      editFieldsAlat.style.display = "block";
      edit_alat_nama.value = namaAlat;
      edit_alat_spesifikasi.value = item?.spesifikasi ?? "-";
      edit_alat_jumlah.value = item?.jumlah ?? item ?? 0;
      edit_alat_satuan.value = item?.satuan ?? "-";
      edit_alat_keterangan.value = item?.keterangan ?? "-";
      editModal.style.display = "flex";
    });
  });
}

/* RENDER RIWAYAT ALAT */
function renderRiwayatAlat() {
  let data = [...riwayatAlat];
  const key = (alat_searchBar.value || "").trim().toLowerCase();
  if (key) {
    data = data.filter(it =>
      it.nama.toLowerCase().includes(key) ||
      (it.spesifikasi || "").toLowerCase().includes(key) ||
      (it.tanggal || "").includes(key)
    );
  }

  alat_tabelRiwayatBody.innerHTML = "";
  if (data.length === 0) {
    alat_tabelRiwayatBody.innerHTML = `<tr> <td colspan="9">Tidak ada riwayat</td></tr> `;
    return;
  }

  const isGuest = currentRole === "guest";

  const fragment = document.createDocumentFragment();
  data.forEach((it, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td> ${idx + 1}</td>
      <td>${escapeHtml(it.tanggal)}</td>
      <td>${escapeHtml(it.nama)}</td>
      <td>${escapeHtml(it.spesifikasi ?? "-")}</td>
      <td>${it.perubahan > 0 ? "+" + it.perubahan : it.perubahan}</td>
      <td>${it.sisa}</td>
      <td>${escapeHtml(it.satuan ?? "-")}</td>
      <td>${escapeHtml(it.keterangan ?? "-")}</td>
      <td>${isGuest ? "" : `<button class="smallBtn" data-id="${it.id}">Hapus</button>`}</td>
    `;
    fragment.appendChild(tr);
  });
  alat_tabelRiwayatBody.appendChild(fragment);

  if (!currentRole || currentRole === "guest") return;

  document.querySelectorAll("#alat_tabelRiwayat .smallBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (id && confirm(`Yakin ingin menghapus riwayat ini?`)) {
        remove(ref(dbAlat, `riwayatAlat/${id}`));
      }
    });
  });
}



/* search listeners alat */
alat_searchBar.addEventListener("input", renderRiwayatAlat);
alat_searchStok.addEventListener("input", renderStokAlat);

/* EXPORT ALAT */
document.getElementById("alat_btnExportStok").addEventListener("click", () => {
  const rows = [["Nama Alat", "Spesifikasi", "Jumlah", "Satuan", "Keterangan"]];
  Object.keys(stokAlat).sort().forEach(nama => {
    const item = stokAlat[nama];
    rows.push([nama, item?.spesifikasi ?? "-", item?.jumlah ?? 0, item?.satuan ?? "-", item?.keterangan ?? "-"]);
  });
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Stok");
  XLSX.writeFile(wb, `stok_alat_${todayCompact()}.xls`);
});

document.getElementById("alat_btnExportRiwayat").addEventListener("click", () => {
  const bulan = (alat_bulanExport.value || "").trim();
  if (!bulan) { alert("Pilih bulan terlebih dahulu."); return; }
  const rows = [["Tanggal", "Nama Alat", "Spesifikasi", "Perubahan", "Sisa", "Satuan", "Keterangan"]];
  riwayatAlat.filter(it => (it.tanggal || "").startsWith(bulan)).forEach(it => rows.push([it.tanggal, it.nama, it.spesifikasi ?? "-", it.perubahan, it.sisa, it.satuan ?? "-", it.keterangan ?? "-"]));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Riwayat");
  XLSX.writeFile(wb, `riwayat_alat_${bulan}.xls`);
});

/* =======================================================
   EDIT MODAL SAVE (satu tombol update untuk kedua tipe)
======================================================= */
btnUpdate.addEventListener("click", () => {
  if (!editMode) return;
  if (editMode.type === "barang") {
    const { namaLama } = editMode;
    const itemLama = stokBarang[namaLama];
    const jumlahLama = itemLama?.jumlah ?? itemLama ?? 0;
    const namaBaru = (edit_barang_nama.value || "").trim();
    const jumlahBaru = Number(edit_barang_jumlah.value);
    const satuanBaru = (edit_barang_satuan.value || "").trim() || "-";

    if (!namaBaru) return alert("Nama barang wajib diisi.");
    if (Number.isNaN(jumlahBaru)) return alert("Jumlah harus angka.");
    if (jumlahBaru < 0) return alert("Jumlah tidak boleh negatif.");

    const updates = {};
    const historyItems = riwayat.filter(it => it.nama === namaLama);
    historyItems.forEach(it => {
      updates[`riwayat/${it.id}/nama`] = namaBaru;
      updates[`riwayat/${it.id}/satuan`] = satuanBaru;
    });

    if (historyItems.length > 0 && jumlahBaru !== jumlahLama) {
      const latestHistory = historyItems[0];
      const diff = jumlahBaru - jumlahLama;
      const newPerubahan = Number(latestHistory.perubahan) + diff;
      updates[`riwayat/${latestHistory.id}/sisa`] = jumlahBaru;
      updates[`riwayat/${latestHistory.id}/perubahan`] = newPerubahan;
    }

    const updatePromise = Object.keys(updates).length > 0 ? update(ref(dbBarang), updates) : Promise.resolve();

    updatePromise
      .then(() => remove(ref(dbBarang, `stok/${namaLama}`)))
      .then(() => set(ref(dbBarang, `stok/${namaBaru}`), { jumlah: jumlahBaru, satuan: satuanBaru }))
      .then(() => {
        alert("✅ Data barang berhasil diperbarui.");
        editMode = null;
        editModal.style.display = "none";
      })
      .catch(err => { console.error("Gagal update barang:", err); alert("Terjadi kesalahan saat update."); });

  } else if (editMode.type === "alat") {
    const { namaLama } = editMode;
    const itemLama = stokAlat[namaLama];
    const jumlahLama = itemLama?.jumlah ?? itemLama ?? 0;
    const namaBaru = (edit_alat_nama.value || "").trim();
    const spesifikasiBaru = (edit_alat_spesifikasi.value || "").trim() || "-";
    const jumlahBaru = Number(edit_alat_jumlah.value);
    const satuanBaru = (edit_alat_satuan.value || "").trim() || "-";
    const keteranganBaru = (edit_alat_keterangan.value || "").trim() || "-";

    if (!namaBaru) return alert("Nama alat wajib diisi.");
    if (Number.isNaN(jumlahBaru)) return alert("Jumlah harus angka.");
    if (jumlahBaru < 0) return alert("Jumlah tidak boleh negatif.");

    const updates = {};
    const historyItems = riwayatAlat.filter(it => it.nama === namaLama);
    historyItems.forEach(it => {
      updates[`riwayatAlat/${it.id}/nama`] = namaBaru;
      updates[`riwayatAlat/${it.id}/spesifikasi`] = spesifikasiBaru;
      updates[`riwayatAlat/${it.id}/satuan`] = satuanBaru;
      updates[`riwayatAlat/${it.id}/keterangan`] = keteranganBaru;
    });

    if (historyItems.length > 0 && jumlahBaru !== jumlahLama) {
      const latestHistory = historyItems[0];
      const diff = jumlahBaru - jumlahLama;
      const newPerubahan = Number(latestHistory.perubahan) + diff;
      updates[`riwayatAlat/${latestHistory.id}/sisa`] = jumlahBaru;
      updates[`riwayatAlat/${latestHistory.id}/perubahan`] = newPerubahan;
    }

    const updatePromise = Object.keys(updates).length > 0 ? update(ref(dbAlat), updates) : Promise.resolve();

    updatePromise
      .then(() => remove(ref(dbAlat, `stokAlat/${namaLama}`)))
      .then(() => set(ref(dbAlat, `stokAlat/${namaBaru}`), { jumlah: jumlahBaru, satuan: satuanBaru, spesifikasi: spesifikasiBaru, keterangan: keteranganBaru }))
      .then(() => {
        alert("✅ Data alat berhasil diperbarui.");
        editMode = null;
        editModal.style.display = "none";
      })
      .catch(err => { console.error("Gagal update alat:", err); alert("Terjadi kesalahan saat update."); });
  }
});

btnCancelEdit.addEventListener("click", () => {
  editMode = null;
  editModal.style.display = "none";
});

/* =======================================================
   UTIL
======================================================= */
function todayCompact() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)
    }${pad(d.getDate())} `;
}
function todayISO() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#039;'
  })[m]);
}
