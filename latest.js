
const urlParams = new URLSearchParams(window.location.search);
const sortBy = urlParams.get("sort") || "score";

// Predefined sort options
const sortOptions = [
  { value: "score", name: "Score" },
  { value: "popularity", name: "Popularity" },
  { value: "title", name: "Title" }
];

// Populate sort dropdown
function populateSort() {
  const sortSelect = document.getElementById("sortSelect");
  sortSelect.innerHTML = '<option value="">Sort By</option>';
  
  sortOptions.forEach(option => {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.textContent = option.name;
    if (sortBy === option.value) {
      opt.selected = true;
    }
    sortSelect.appendChild(opt);
  });

  sortSelect.addEventListener("change", () => {
    const selectedSort = sortSelect.value;
    if (selectedSort) {
      window.history.pushState({}, "", `?sort=${selectedSort}`);
      fetchLatestAnime(selectedSort);
    } else {
      fetchLatestAnime();
    }
  });
}

// Fetch latest anime with optional sorting
async function fetchLatestAnime(sort = sortBy) {
  try {
    const animeContainer = document.getElementById("animeContainer");
    animeContainer.innerHTML = "<p>Loading...</p>";
    let url = `https://api.jikan.moe/v4/seasons/now?limit=25`;
    if (sort) url += `&sort=${sort}`;
    const response = await fetch(url);
    const data = await response.json();
    
    animeContainer.innerHTML = "";
    if (!data.data || data.data.length === 0) {
      animeContainer.innerHTML = "<p>No anime found</p>";
      return;
    }
    
    data.data.slice(0, 25).forEach(anime => {
      const animeCard = document.createElement("div");
      animeCard.classList.add("anime-card");
      animeCard.innerHTML = `
        <a href="anime-details.html?id=${anime.mal_id}&source=jikan" class="anime-link">
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
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
  } catch (error) {
    console.error("Error fetching anime:", error);
    document.getElementById("animeContainer").innerHTML = "<p>Error loading anime</p>";
  }
}

// Search feature
document.getElementById("searchButton").addEventListener("click", async () => {
  const query = document.getElementById("search").value.trim();
  
  if (query === "") {
    document.getElementById("searchResults").innerHTML ="<p>Please enter an anime name!</p>";
    return;
  }
  
  const resultsContainer = document.getElementById("searchResults");
  resultsContainer.innerHTML = "<p>Loading...</p>";
  
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=6`);
    const data = await response.json();
    
    resultsContainer.innerHTML = "";
    if (!data.data || data.data.length === 0) {
      resultsContainer.innerHTML = "<p>No results found</p>";
      return;
    }
    
    data.data.forEach(anime => {
      const animeCard = document.createElement("div");
      animeCard.classList.add("anime-seg");
      animeCard.innerHTML = `
        <a href="anime-details.html?id=${anime.mal_id}&source=jikan" class="anime-link">
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
          <div class="anime-info">
            <h3>${anime.title}</h3>
            <p>Episodes: ${anime.episodes || "?"}</p>
            <p class="rating">⭐ ${anime.score || "N/A"}</p>
            <p>Genres: ${anime.genres?.map(genre => genre.name).join(", ") || "Unknown"}</p>
          </div>
        </a>
      `;
      resultsContainer.appendChild(animeCard);
    });
  } catch (error) {
    console.error("Error fetching anime search results:", error);
    resultsContainer.innerHTML = "<p>Error loading results</p>";
  }
});

// Back to top button
document.getElementById("btn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Initialize
populateSort();
fetchLatestAnime();
