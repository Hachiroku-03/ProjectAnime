
const urlParams = new URLSearchParams(window.location.search);
const sortBy = urlParams.get("sort") || "popularity";

// Predefined sort options
const sortOptions = [
  { value: "popularity", name: "Popularity" },
  { value: "score", name: "Score" },
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
      fetchAllUpcomingAnime(selectedSort);
    } else {
      fetchAllUpcomingAnime();
    }
  });
}

// Fetch upcoming anime with optional sorting
async function fetchAllUpcomingAnime(sort = sortBy) {
  try {
    const container = document.getElementById("allUpcomingAnime");
    if (!container) {
      console.error("Error: allUpcomingAnime container not found.");
      return;
    }
    container.innerHTML = "<p>Loading...</p>";
    let url = `https://api.jikan.moe/v4/seasons/upcoming?limit=25`;
    if (sort) url += `&sort=${sort}`;
    const response = await fetch(url);
    const data = await response.json();
    
    container.innerHTML = "";
    if (!data.data || data.data.length === 0) {
      container.innerHTML = "<p>No anime found</p>";
      return;
    }
    
    data.data.slice(0, 25).forEach(anime => {
      const animeCard = document.createElement("div");
      animeCard.classList.add("anime-box");
      animeCard.innerHTML = `
        <a href="anime-details.html?id=${anime.mal_id}&source=jikan" class="anime-link">
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
          <div class="anime-info">
            <h3>${anime.title}</h3>
            <p>Episodes: ${anime.episodes || "?"}</p>
            <p class="rating">⭐ ${anime.score || "N/A"}</p>
            <p>Release: ${anime.aired?.prop?.from?.year || "TBA"}</p>
            <p>Genres: ${anime.genres?.map(genre => genre.name).join(", ") || "Unknown"}</p>
          </div>
        </a>
      `;
      container.appendChild(animeCard);
    });
  } catch (error) {
    console.error("Error fetching upcoming anime:", error);
    document.getElementById("allUpcomingAnime").innerHTML = "<p>Error loading anime</p>";
  }
}

// Search feature
document.getElementById("searchButton").addEventListener("click", async () => {
  const query = document.getElementById("search").value.trim();
  
  if (query === "") {
    alert("Enter an anime name!");
    return;
  }
  
  const resultContainer = document.getElementById("searchResults");
  resultContainer.innerHTML = "<p>Loading...</p>";
  
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=6`);
    const data = await response.json();
    
    resultContainer.innerHTML = "";
    if (!data.data || data.data.length === 0) {
      resultContainer.innerHTML = "<p>No anime found</p>";
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
      resultContainer.appendChild(animeCard);
    });
  } catch (error) {
    console.error("Error fetching anime search results:", error);
    resultContainer.innerHTML = "<p>Error loading results</p>";
  }
});

// Back to top button
document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Initialize
populateSort();
fetchAllUpcomingAnime();
