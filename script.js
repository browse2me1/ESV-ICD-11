let diseases = [];
let currentChapter = "All Chapters";

// ======================
// LOAD DATA
// ======================

async function loadData() {

    try {

        const response = await fetch("diseases.json");
        diseases = await response.json();

        document.getElementById("totalDiseases").textContent =
            diseases.length;
          //totalchapters
        document.getElementById("totalChapters").textContent =
            [...new Set(
                diseases.map(item => item.chapter)
            )].length;

        generateChapterButtons();

        displayResults(diseases);
        loadFavorites();
       

        setTimeout(() => {
            document.getElementById("loader").style.display = "none";
        }, 500);

    } catch (error) {

        console.error(error);

        document.getElementById("results").innerHTML = `
            <div class="result-card">
                <h3>⚠ Failed to load ICD database</h3>
            </div>
        `;

        document.getElementById("loader").style.display = "none";
    }
}

// ======================
// DISPLAY RESULTS
// ======================

function displayResults(data) {

    const results = document.getElementById("results");

    document.getElementById("resultCount").textContent =
        `${data.length} Result(s) Found`;

    if (data.length === 0) {

        results.innerHTML = `
            <div class="result-card">
                <h3>No matching diseases found.</h3>
            </div>
        `;

        return;
    }

    results.innerHTML = data.map(item => `

        <div class="result-card">

            <div class="card-header">

                <span class="code">
                    ${item.code}
                </span>

                <div class="card-actions">

    <button
        class="copy-btn"
        onclick="copyCode('${item.code}')">
        📋 Copy
    </button>

    <button
        class="fav-btn"
        onclick="toggleFavorite('${item.code}')">
                ${
    JSON.parse(
        localStorage.getItem("favorites")
    )?.includes(item.code)
    ? "⭐"
    : "☆"
}
    </button>

</div>

            </div>

            <div class="disease">
                ${item.category}
            </div>

            <div class="chapter-badge">
                ${item.chapter}
            </div>

        </div>

    `).join('');
}
function toggleFavorite(code){

    let favorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];

    if(favorites.includes(code)){

        favorites =
            favorites.filter(
                item => item !== code
            );

        alert("Removed from Favorites");

    }else{

        favorites.push(code);

        alert("Added to Favorites");
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    loadFavorites();
}

function loadFavorites(){

    const favorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];

    const favoriteDiseases =
        diseases.filter(item =>
            favorites.includes(item.code)
        );

    const container =
        document.getElementById("favoriteResults");

    if(favoriteDiseases.length === 0){

        container.innerHTML = `
            <div class="empty-state">
                No favorite diseases saved.
            </div>
        `;

        return;
    }

    container.innerHTML =
        favoriteDiseases.map(item => `

            <div class="result-card">

                <div class="card-header">

                    <span class="code">
                        ${item.code}
                    </span>

                    <button
                        class="fav-btn"
                        onclick="toggleFavorite('${item.code}')">

                        ❌

                    </button>

                </div>

                <div class="disease">
                    ${item.category}
                </div>

                <div class="chapter-badge">
                    ${item.chapter}
                </div>

            </div>

        `).join('');
}
// ======================
// SEARCH
// ======================

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("searchInput");

    searchInput.addEventListener("input", function () {

        const keyword =
            this.value.toLowerCase().trim();

        let filtered = diseases;

        if (currentChapter !== "All Chapters") {

            filtered = filtered.filter(
                item => item.chapter === currentChapter
            );
        }

        if (keyword !== "") {

            filtered = filtered.filter(item =>

                item.code.toLowerCase().includes(keyword) ||

                item.category.toLowerCase().includes(keyword) ||

                item.chapter.toLowerCase().includes(keyword)

            );
        }

        displayResults(filtered);
    });

});

// ======================
// COPY CODE
// ======================

function copyCode(code) {

    navigator.clipboard.writeText(code);

    const originalTitle = document.title;

    document.title = `${code} Copied!`;

    setTimeout(() => {
        document.title = originalTitle;
    }, 1000);
}

// ======================
// CHAPTER BUTTONS
// ======================

function generateChapterButtons() {

    const container =
        document.getElementById("chapterContainer");

    const chapters = [
        ...new Set(
            diseases.map(item => item.chapter)
        )
    ];

    chapters.sort();

    container.innerHTML = `
        <button
            class="chapter-btn active"
            onclick="filterChapter('All Chapters', this)">
            All Chapters
        </button>
    `;

    chapters.forEach(chapter => {

        container.innerHTML += `

            <button
                class="chapter-btn"
                onclick="filterChapter('${chapter}', this)">
                ${chapter}
            </button>

        `;
    });
}

// ======================
// CHAPTER FILTER
// ======================

function filterChapter(chapter, btn) {

    currentChapter = chapter;

    document
        .querySelectorAll(".chapter-btn")
        .forEach(button =>
            button.classList.remove("active")
        );

    btn.classList.add("active");

    let filtered = diseases;

    if (chapter !== "All Chapters") {

        filtered = diseases.filter(
            item => item.chapter === chapter
        );
    }

    const keyword =
        document.getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    if (keyword !== "") {

        filtered = filtered.filter(item =>

            item.code.toLowerCase().includes(keyword) ||

            item.category.toLowerCase().includes(keyword)

        );
    }

    displayResults(filtered);
}

// ======================
// DARK MODE
// ======================

const darkBtn =
    document.getElementById("darkModeBtn");

if (localStorage.getItem("darkMode") === "true") {

    document.body.classList.add("dark-mode");

    darkBtn.innerHTML =
        "☀️ Light Mode";
}

darkBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    const isDark =
        document.body.classList.contains("dark-mode");

    localStorage.setItem("darkMode", isDark);

    darkBtn.innerHTML =
        isDark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
});
// Mobile Sidebar Toggle

const menuToggle =
    document.getElementById("menuToggle");

const sidebar =
    document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {

    sidebar.classList.toggle("show");

});
function showSection(sectionId, clickedItem){

    document
        .querySelectorAll('.page-section')
        .forEach(section => {

            section.style.display = "none";

        });

    document
        .getElementById(sectionId)
        .style.display = "block";

    document
        .querySelectorAll('.menu li')
        .forEach(item => {

            item.classList.remove('active');

        });

    if(clickedItem){
        clickedItem.classList.add('active');
    }

    if(window.innerWidth <= 900){

        sidebar.classList.remove('show');
    }
}
// ======================
// INITIALIZE
// ======================

loadData();