const urlParams = new URLSearchParams(window.location.search);
const genreId = urlParams.get('genreId');

// === FETCH GENRES ===
async function fetchGenres() {
  try {
    const response = await fetch("https://api.jikan.moe/v4/genres/anime");
    const data = await response.json();
    const genres = data.data || [];
    const genreSelect = document.getElementById("genreSelect");
    genres.forEach(genre => {
      const option = document.createElement("option");
      option.value = genre.mal_id;
      option.textContent = genre.name;
      if (genreId && genre.mal_id === parseInt(genreId)) {
        option.selected = true;
      }
      genreSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching genres:", error);
    document.getElementById("genreContainer").innerHTML = "<p>Error loading genres</p>";
  }
}

// === RENDER ANIME CARDS ===
function renderAnime(list, containerId = "genreContainer") {
  const animeContainer = document.getElementById(containerId);
  animeContainer.innerHTML = "";

  if (list.length === 0) {
    animeContainer.innerHTML = "<p>No anime found</p>";
    return;
  }

  list.forEach((anime) => {
    const animeCard = document.createElement("div");
    animeCard.classList.add("anime-cards");
    animeCard.innerHTML = `
      <a class="anime-link" href="anime-details.html?id=${anime.mal_id}&source=jikan">
        <img src="${anime.images.jpg.image_url}" alt="${anime.title} Poster">
        <div class="anime-info">
          <h3>${anime.title}</h3>
          <p>Episodes: ${anime.episodes || "?"}</p>
          <p class="rating">⭐ ${anime.score || "N/A"}</p>
          <p>Genres: ${anime.genres?.map(genre => genre.name).join(", ") || "Unknown"}</p>
        </div>
      </a>
    `;
    animeContainer.appendChild(animeCard);
  });
}

// === FETCH ANIME BY GENRE ===
async function fetchAnimeByGenre(genreId) {
  try {
    const animeContainer = document.getElementById("genreContainer");
    animeContainer.innerHTML = "<p>Loading...</p>";
    const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}&limit=25`);
    const data = await response.json();
    renderAnime(data.data, "genreContainer");
  } catch (error) {
    console.error("Error fetching anime by genre:", error);
    document.getElementById("genreContainer").innerHTML = "<p>Error loading anime</p>";
  }
}

// === SEARCH FEATURE ===
document.getElementById("searchButton").addEventListener("click", async () => {
  const query = document.getElementById("search").value.trim();

  if (query === "") {
    alert("Enter an anime name!");
    return;
  }

  const resultContainer = document.getElementById("searchResults");
  resultContainer.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
    const data = await response.json();
    renderAnime(data.data.slice(0, 6), "searchResults");
  } catch (error) {
    console.error("Search failed:", error);
    resultContainer.innerHTML = "<p>Error loading results</p>";
  }
});

// === GENRE SELECTION ===
document.getElementById("genreSelect").addEventListener("change", (e) => {
  const genreId = e.target.value;
  if (genreId) {
    window.history.pushState({}, "", `?genreId=${genreId}`);
    fetchAnimeByGenre(genreId);
  } else {
    document.getElementById("genreContainer").innerHTML = "<p>Please select a genre</p>";
  }
});

// === BACK TO TOP BUTTON ===
document.getElementById("btn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// === INITIAL FETCH ===
fetchGenres();
if (genreId) {
  fetchAnimeByGenre(genreId);
} else {
  document.getElementById("genreContainer").innerHTML = "<p>Please select a genre</p>";
}