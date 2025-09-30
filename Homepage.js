// === HERO SLIDER FEATURE ===
async function fetchFeaturedAnime() {
  try {
    const response = await fetch("https://kitsu.io/api/edge/anime?page[limit]=5&sort=-averageRating");
    const data = await response.json();
    const featuredAnime = data.data;

    const heroSlider = document.getElementById("heroSlider");

    featuredAnime.forEach((anime, index) => {
      const { id, attributes } = anime;
      const title = attributes.titles.en_jp || attributes.titles.en || attributes.canonicalTitle;
      const image = attributes.coverImage?.original || attributes.posterImage?.original;

      const slide = document.createElement("div");
      slide.classList.add("hero-slide");
      if (index === 0) slide.classList.add("active");

      slide.style.backgroundImage = `url(${image})`;
      slide.innerHTML = `
        <a href="anime-details.html?id=${id}">
          <div class="overlay">
            <h2>${title}</h2>
          </div>
        </a>
      `;
      heroSlider.appendChild(slide);
    });

    let currentSlide = 0;
    setInterval(() => {
      const slides = document.querySelectorAll(".hero-slide");
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 5000);
  } catch (error) {
    console.error("Error loading hero slider:", error);
  }
}

fetchFeaturedAnime();

// === FETCH LATEST ANIME ===
async function fetchLatestAnime() {
  try {
    const response = await fetch("https://api.jikan.moe/v4/seasons/now");
    const data = await response.json();
    const animeList = data.data.slice(0, 12);
    const animeContainer = document.getElementById("animeContainer");
    animeContainer.innerHTML = "";

    animeList.forEach(anime => {
      const animeCard = document.createElement("div");
      animeCard.classList.add("anime-card");
      animeCard.innerHTML = `
        <a href="anime-details.html?id=${anime.mal_id}">
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
          <h3>${anime.title}</h3>
        </a>
        <p>Episodes: ${anime.episodes || "?"}</p>
        <p>Score: ${anime.score || "N/A"}</p>
      `;
      animeContainer.appendChild(animeCard);
    });
  } catch (error) {
    console.error("Error fetching latest anime:", error);
  }
}

fetchLatestAnime();

// === FETCH UPCOMING ANIME ===
async function fetchUpcomingAnime() {
  try {
    const result = await fetch("https://api.jikan.moe/v4/seasons/upcoming");
    const data = await result.json();
    const animeList = data.data.slice(0, 10);
    const container = document.getElementById("upcomingContainer");
    container.innerHTML = "";

    animeList.forEach(anime => {
      const animeCard = document.createElement("div");
      animeCard.classList.add("anime-box");
      animeCard.innerHTML = `
        <a href="anime-details.html?id=${anime.mal_id}">
          <img class="latestanimeimage" src="${anime.images.jpg.image_url}" alt="${anime.title}">
          <h3>${anime.title}</h3>
        </a>
        <p>Episodes: ${anime.episodes || "?"}</p>
        <p>Score: ${anime.score || "N/A"}</p>
      `;
      container.appendChild(animeCard);
    });
  } catch (error) {
    console.error("Error fetching upcoming anime:", error);
  }
}

fetchUpcomingAnime();

// === FETCH TOP RATED ANIME ===
async function fetchTopAnime() {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime");
    const data = await response.json();
    const animeList = data.data.slice(0, 10);
    const container = document.getElementById("topAnime");
    container.innerHTML = "";

    animeList.forEach((anime, index) => {
      const animeCard = document.createElement("div");
      animeCard.classList.add("anime-cards");

      const genres = anime.genres.map(genre => genre.name).join(", ") || "Unknown";
      animeCard.innerHTML = `
        <div class="number"><h2>${index + 1}</h2></div>
        <a href="anime-details.html?id=${anime.mal_id}">
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        </a>
        <div class="anime-info">
          <h3>${anime.title}</h3>
          <p>Episodes: ${anime.episodes || "?"}</p>
          <p>Score: ${anime.score || "N/A"}</p>
          <p><strong>Genre:</strong> ${genres}</p>
        </div>
      `;
      container.appendChild(animeCard);
    });
  } catch (error) {
    console.error("Error fetching top anime:", error);
  }
}

fetchTopAnime();

// === SEARCH FEATURE ===
document.getElementById("searchButton").addEventListener("click", async () => {
  const query = document.getElementById("search").value.trim();
  if (!query) return alert("Please enter an anime name!");

  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
    const data = await response.json();
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "";

    if (!data.data || data.data.length === 0) {
      resultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }

    data.data.slice(0, 5).forEach(anime => {
      const animeCard = document.createElement("div");
      animeCard.classList.add("anime-detail");
      const genres = anime.genres.map(g => g.name).join(", ") || "Unknown";
      animeCard.innerHTML = `
        <a href="anime-details.html?id=${anime.mal_id}">
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
          <h3>${anime.title}</h3>
        </a>
        <p>Episodes: ${anime.episodes || "?"}</p>
        <p>Score: ${anime.score || "N/A"}</p>
        <p>Genre: ${genres}</p>
      `;
      resultsContainer.appendChild(animeCard);
    });
  } catch (error) {
    console.error("Search failed:", error);
  }
});

// === FETCH CURRENTLY AIRING (using popular filter from Kitsu) ===
// async function fetchLatestAnime() {
//   try {
//     const response = await fetch("https://kitsu.io/api/edge/anime?page[limit]=12&sort=-startDate");
//     const data = await response.json();
//     const animeList = data.data;
//     const animeContainer = document.getElementById("animeContainer");
//     animeContainer.innerHTML = "";

//     animeList.forEach(anime => {
//       const attributes = anime.attributes;
//       animeContainer.innerHTML += `
//         <div class="anime-card">
//           <a href="anime-details.html?id=${anime.id}">
//             <img src="${attributes.posterImage?.medium}" alt="${attributes.canonicalTitle}">
//             <h3>${attributes.canonicalTitle}</h3>
//           </a>
//           <p>Episodes: ${attributes.episodeCount || "?"}</p>
//           <p>Rating: ${attributes.averageRating || "N/A"}</p>
//         </div>
//       `;
//     });
//   } catch (error) {
//     console.error("Error fetching latest anime from Kitsu:", error);
//   }
// }

// // === FETCH UPCOMING === (Kitsu lacks official 'upcoming', so use by popularity)
// async function fetchUpcomingAnime() {
//   try {
//     const response = await fetch("https://kitsu.io/api/edge/anime?page[limit]=10&sort=-popularityRank");
//     const data = await response.json();
//     const animeList = data.data;
//     const container = document.getElementById("upcomingContainer");
//     container.innerHTML = "";

//     animeList.forEach(anime => {
//       const attributes = anime.attributes;
//       container.innerHTML += `
//         <div class="anime-box">
//           <a href="anime-details.html?id=${anime.id}">
//             <img class="latestanimeimage" src="${attributes.posterImage?.medium}" alt="${attributes.canonicalTitle}">
//             <h3>${attributes.canonicalTitle}</h3>
//           </a>
//           <p>Episodes: ${attributes.episodeCount || "?"}</p>
//           <p>Rating: ${attributes.averageRating || "N/A"}</p>
//         </div>
//       `;
//     });
//   } catch (error) {
//     console.error("Error fetching upcoming anime from Kitsu:", error);
//   }
// }

// // === FETCH TOP ANIME ===
// async function fetchTopAnime() {
//   try {
//     const response = await fetch("https://kitsu.io/api/edge/anime?page[limit]=10&sort=-averageRating");
//     const data = await response.json();
//     const animeList = data.data;
//     const container = document.getElementById("topAnime");
//     container.innerHTML = "";

//     animeList.forEach((anime, index) => {
//       const attributes = anime.attributes;
//       const genres = (attributes.genres || []).join(", ") || "Unknown";

//       container.innerHTML += `
//         <div class="anime-cards">
//           <div class="number"><h2>${index + 1}</h2></div>
//           <a href="anime-details.html?id=${anime.id}">
//             <img src="${attributes.posterImage?.medium}" alt="${attributes.canonicalTitle}">
//           </a>
//           <div class="anime-info">
//             <h3>${attributes.canonicalTitle}</h3>
//             <p>Episodes: ${attributes.episodeCount || "?"}</p>
//             <p>Rating: ${attributes.averageRating || "N/A"}</p>
//             <p><strong>Status:</strong> ${attributes.status || "Unknown"}</p>
//           </div>
//         </div>
//       `;
//     });
//   } catch (error) {
//     console.error("Error fetching top anime from Kitsu:", error);
//   }
// }
// fetchLatestAnime();
// fetchUpcomingAnime();
// fetchTopAnime();

// === SCROLL TO TOP BUTTON ===
document.getElementById("btn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// === BURGER MENU ===
const burger = document.getElementById("burger");
const header = document.getElementById("First-header");
if (burger && header) {
  burger.addEventListener("click", () => header.classList.toggle("active"));
  burger.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      header.classList.toggle("active");
    }
  });
}
