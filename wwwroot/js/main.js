document.addEventListener("DOMContentLoaded", function () {

    if (window.lucide) {
        lucide.createIcons();
    }
    const btn = document.getElementById("toggleDark");
    let latestJson = [];

    if (btn) {
        btn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            const isDark = document.body.classList.contains("dark-mode");
            localStorage.setItem("darkMode", isDark);

            btn.innerText = isDark ? "☀️" : "🌙";
        });

        // set icon saat load
        const isDark = localStorage.getItem("darkMode") === "true";
        btn.innerText = isDark ? "☀️" : "🌙";
    }

    document.querySelectorAll(".sidebar .nav-link").forEach(link => {
        link.addEventListener("click", function () {

            // hapus active dari semua
            document.querySelectorAll(".sidebar .nav-link")
                .forEach(l => l.classList.remove("active"));

            // tambahin ke yang diklik
            this.classList.add("active");
        });
    });

    // load dari storage
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    document.getElementById("btnConvert").addEventListener("click", () => {
        const input = document.getElementById("inputPeriod").value;

        if (!input) {
            alert("Isi dulu period nya!");
            return;
        }

        const { month, year } = parsePeriod(input);

        const start = getStartDate(month, year);
        const end = getEndDate(month, year);

        document.getElementById("startDate").innerText = start;
        document.getElementById("endDate").innerText = end;

        // save ke localStorage
        localStorage.setItem("lastPeriod", input);
    });

    document.getElementById("btnCopy").addEventListener("click", () => {
        const start = document.getElementById("startDate").innerText;
        const end = document.getElementById("endDate").innerText;

        navigator.clipboard.writeText(`Start: ${start} | End: ${end}`);
        alert("Copied!");
    });

    document.getElementById("btnFormatJson")
        .addEventListener("click", formatJSON);

    window.onload = () => {
        const last = localStorage.getItem("lastPeriod");
        if (last) {
            document.getElementById("inputPeriod").value = last;
        }
    }; 
     
    // 🔥 CONVERT EXCEL
    document.getElementById("btnConvertExcel")?.addEventListener("click", handleExcel);

    // 🔥 DOWNLOAD JSON
    document.getElementById("btnDownloadJson")?.addEventListener("click", () => {

        if (!latestJson.length) {
            alert("Belum ada data 😆");
            return;
        }

        const blob = new Blob([JSON.stringify(latestJson, null, 2)], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "rules.json";
        a.click();

        URL.revokeObjectURL(url);
    });
});


function handleExcel() {

    const fileInput = document.getElementById("excelFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Pilih file Excel dulu 😆");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        let json = XLSX.utils.sheet_to_json(sheet);

        // 🔥 FIX roles jadi array
        json = json.map(item => ({
            ...item,
            roles: item.roles
                ? item.roles.split(",").map(r => r.trim())
                : []
        }));

        // simpan ke global
        latestJson = json;

        // tampilkan ke UI
        document.getElementById("jsonOutput").textContent =
            JSON.stringify(json, null, 2);
    };

    reader.readAsArrayBuffer(file);
}

function formatJSON() {
    const input = document.getElementById("jsonInput").value;

    if (!input) {
        alert("Isi JSON dulu ya!");
        return;
    }

    try {
        const parsed = JSON.parse(input);

        document.getElementById("jsonOutput").innerText =
            JSON.stringify(parsed, null, 2);

    } catch (err) {
        alert("JSON tidak valid!");
    }
}