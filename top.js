let currentPage = 1;
let allAnime = [];
let displayedCount = 0;

// === FETCH TOP ANIME ===
async function fetchTopAnime(page = 1) {
  try {
    let response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=25`);
    let data = await response.json();
    let animeList = data.data;

    // Save globally
    allAnime = [...allAnime, ...animeList];

    // Show first 25 by default
    renderAnime(allAnime.slice(0, 25));
    if (!data.pagination.has_next_page) {
      document.getElementById("loadMore").disabled = true;
    }
  } catch (error) {
    console.log("Error loading TopAnime", error);
  }
}

// === RENDER ANIME CARDS ===
function renderAnime(list, containerId = "topAnime") {
  const animeContainer = document.getElementById(containerId);
  animeContainer.innerHTML = "";

  if (containerId === "searchResults" && list.length === 0) {
    animeContainer.innerHTML = "<p>No anime found</p>";
    return;
  }

  list.forEach((anime, index) => {
    const animeCard = document.createElement("div");
    animeCard.classList.add("anime-cards");
    animeCard.innerHTML = `
      <a class="anime-link" href="anime-details.html?id=${anime.mal_id}&source=jikan">
        <img src="${anime.images.jpg.image_url}" alt="${anime.title} Poster">
        <div class="anime-info">
          <h3>${anime.title}</h3>
          <p>Episodes: ${anime.episodes || "?"}</p>
          <p class="rating">⭐ ${anime.score || "N/A"}</p>
          <p>${containerId === "topAnime" ? `Type: ${anime.type || "N/A"}` : `Genres: ${anime.genres?.map(genre => genre.name).join(", ") || "Unknown"}`}</p>
        </div>
      </a>
    `;
    animeContainer.appendChild(animeCard);
  });
}

// === SORT FUNCTION ===
document.getElementById("sort").addEventListener("change", () => {
  let sortValue = document.getElementById("sort").value;
  let sorted = [...allAnime];

  if (sortValue === "score") {
    sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
  } else if (sortValue === "popularity") {
    sorted.sort((a, b) => (a.popularity || 0) - (b.popularity || 0));
  } else if (sortValue === "title") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  renderAnime(sorted);
});

// === FILTER FUNCTION ===
document.getElementById("filter").addEventListener("change", () => {
  let filterValue = document.getElementById("filter").value;
  let filtered = allAnime;

  if (filterValue !== "all") {
    filtered = allAnime.filter(anime => anime.type.toLowerCase() === filterValue.toLowerCase());
  }

  renderAnime(filtered);
});

// === LOAD MORE FUNCTION ===
document.getElementById("loadMore").addEventListener("click", async () => {
  currentPage++;
  await fetchTopAnime(currentPage);
});

// === SEARCH FEATURE ===
document.getElementById("searchButton").addEventListener("click", async () => {
  let query = document.getElementById("search").value.trim();

  if (query === "") {
    alert("Enter an anime name!");
    return;
  }

  const resultContainer = document.getElementById("searchResults");
  resultContainer.innerHTML = "<p>Loading...</p>";

  try {
    let response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
    let data = await response.json();
    renderAnime(data.data.slice(0, 6), "searchResults");
  } catch (error) {
    console.log("Search failed:", error);
    resultContainer.innerHTML = "<p>Error loading results</p>";
  }
});

// === BACK TO TOP BUTTON ===
document.getElementById("btn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// === INITIAL FETCH ===
fetchTopAnime();