
const urlParams = new URLSearchParams(window.location.search);
const typeId = urlParams.get("typeId");

// Predefined anime types (since Jikan API doesn't provide a types endpoint)
const animeTypes = [
  { value: "tv", name: "TV" },
  { value: "movie", name: "Movie" },
  { value: "ova", name: "OVA" },
  { value: "special", name: "Special" },
  { value: "ona", name: "ONA" },
  { value: "music", name: "Music" }
];

// Populate type dropdown
function populateTypes() {
  const typeSelect = document.getElementById("typeSelect");
  typeSelect.innerHTML = '<option value="">Select a type</option>';
  
  animeTypes.forEach(type => {
    const option = document.createElement("option");
    option.value = type.value;
    option.textContent = type.name;
    if (typeId === type.value) {
      option.selected = true;
    }
    typeSelect.appendChild(option);
  });

  typeSelect.addEventListener("change", () => {
    const selectedType = typeSelect.value;
    if (selectedType) {
      window.history.pushState({}, "", `?typeId=${selectedType}`);
      fetchAnimeType(selectedType);
    } else {
      document.getElementById("typeContainer").innerHTML = "<p>Please select a type</p>";
    }
  });
}

// Fetch anime by type
async function fetchAnimeType(typeId) {
  if (!typeId) {
    document.getElementById("typeContainer").innerHTML = "<p>Please select a type</p>";
    return;
  }
  try {
    const animeContainer = document.getElementById("typeContainer");
    animeContainer.innerHTML = "<p>Loading...</p>";
    const response = await fetch(`https://api.jikan.moe/v4/anime?type=${typeId}&limit=25`);
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      animeContainer.innerHTML = "<p>No anime found for this type.</p>";
      return;
    }
    
    animeContainer.innerHTML = "";
    data.data.forEach(anime => {
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
    console.error("Error fetching anime by type:", error);
    document.getElementById("typeContainer").innerHTML = "<p>Error loading anime</p>";
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
    console.error("Search failed:", error);
    resultContainer.innerHTML = "<p>Error loading results</p>";
  }
});

// Back to top button
document.getElementById("btn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Initialize
populateTypes();
if (typeId) {
  fetchAnimeType(typeId);
} else {
  document.getElementById("typeContainer").innerHTML = "<p>Please select a type</p>";
}
