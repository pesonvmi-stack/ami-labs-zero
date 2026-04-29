let rulesData = [];

async function loadRules() {
    const res = await fetch('/data/rioriserules.json');
    rulesData = await res.json();

    console.log("DATA:", rulesData); // 👈 tambahin ini
    renderRules(rulesData);
}

function renderRules(data) {
    const container = document.getElementById("ruleList");

    if (!container) return; // penting

    container.innerHTML = "";

    data.forEach(rule => {
        container.innerHTML += `
            <div class="card p-2 mb-2">
                <b>${rule.title}</b>
                <p>${rule.description}</p>
                <small>${rule.category}</small>
            </div>
        `;
    });
}

function filterRules() {
    const keyword = document.getElementById("searchRule").value.toLowerCase();
    const role = document.getElementById("filterRole").value;

    let filtered = rulesData.filter(r =>
        r.title.toLowerCase().includes(keyword) &&
        (role === "" || r.roles.includes(role))
    );

    renderRules(filtered);
}

function showRules() {
    document.getElementById("rulesIntro").style.display = "none";
    document.getElementById("rulesContent").style.display = "block";

    if (rulesData.length === 0) {
        loadRules();
    }
}

function showIntro() {
    document.getElementById("rulesIntro").style.display = "block";
    document.getElementById("rulesContent").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {

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


    const search = document.getElementById("searchRule");
    const filter = document.getElementById("filterRole");

    // hanya jalan kalau elemen ada
    if (search && filter) {

        loadRules();

        search.addEventListener("input", filterRules);
        filter.addEventListener("change", filterRules);

    }

});