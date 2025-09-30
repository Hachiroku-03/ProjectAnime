// Get query params
const urlParams = new URLSearchParams(window.location.search);
const animeId = urlParams.get("id");
const source = urlParams.get("source");

// Main function
async function fetchAnimeDetails() {
  if (!animeId || !source) {
    document.getElementById("animeDetails").innerHTML = "<p>No anime selected.</p>";
    return;
  }

  try {
    if (source === "jikan") {
      await fetchFromJikan(animeId);
    } else if (source === "kitsu") {
      await fetchFromKitsu(animeId);
    } else {
      document.getElementById("animeDetails").innerHTML = "<p>Unknown source.</p>";
    }
  } catch (error) {
    console.error("Error fetching anime details:", error);
    document.getElementById("animeDetails").innerHTML = "<p>Failed to load anime details.</p>";
  }
}

// === Fetch from Jikan ===
async function fetchFromJikan(id) {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
  const data = await response.json();
  const anime = data.data;

  // Header
  document.getElementById("animeHeader").innerHTML = `
    <h1>${anime.title}</h1>
    <p><strong>Score:</strong> ${anime.score || "N/A"}</p>
    <p><strong>Status:</strong> ${anime.status}</p>
    <p>${anime.synopsis || "No synopsis available."}</p>
  `;

  // Info
  document.getElementById("animeInfo").innerHTML = `
    <p><strong>Type:</strong> ${anime.type}</p>
    <p><strong>Aired:</strong> ${anime.aired?.string || "Unknown"}</p>
    <p><strong>Episodes:</strong> ${anime.episodes || "?"}</p>
    <p><strong>Duration:</strong> ${anime.duration}</p>
    <p><strong>Genres:</strong> ${anime.genres.map(g => g.name).join(", ")}</p>
  `;

  // Trailer
  document.getElementById("animeTrailer").innerHTML = anime.trailer?.embed_url
    ? `<iframe width="850" height="500" src="${anime.trailer.embed_url}" frameborder="0" allowfullscreen></iframe>`
    : "<p>No trailer available.</p>";

  // Episodes
  fetchEpisodes(id);
}

// === Fetch Jikan Episodes ===
async function fetchEpisodes(id) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`);
    const data = await response.json();
    const episodes = data.data;

    const container = document.getElementById("episodeListContainer");
    container.innerHTML = episodes.length ? "" : "<p>No episodes available.</p>";

    episodes.forEach(ep => {
      const div = document.createElement("div");
      div.classList.add("episode-item");
      div.innerHTML = `<h3>Episode ${ep.mal_id}: ${ep.title}</h3>`;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
}

// === Fetch from Kitsu ===
async function fetchFromKitsu(id) {
  const response = await fetch(`https://kitsu.io/api/edge/anime/${id}`);
  const data = await response.json();
  const anime = data.data.attributes;

  // Header
  document.getElementById("animeHeader").innerHTML = `
    <h1>${anime.titles.en_jp || anime.canonicalTitle}</h1>
    <p><strong>Status:</strong> ${anime.status}</p>
    <p>${anime.synopsis || "No synopsis available."}</p>
  `;

  // Info
  document.getElementById("animeInfo").innerHTML = `
    <p><strong>Type:</strong> ${anime.showType}</p>
    <p><strong>Episodes:</strong> ${anime.episodeCount || "?"}</p>
    <p><strong>Duration:</strong> ${anime.episodeLength} min</p>
    <p><strong>Rating:</strong> ${anime.averageRating || "N/A"}</p>
  `;

  // Trailer
  document.getElementById("animeTrailer").innerHTML = anime.youtubeVideoId
    ? `<iframe width="850" height="500" src="https://www.youtube.com/embed/${anime.youtubeVideoId}" frameborder="0" allowfullscreen></iframe>`
    : "<p>No trailer available.</p>";

  // Episodes not available
  document.getElementById("episodeListContainer").innerHTML = "<p>Kitsu does not provide full episode lists.</p>";
}

// Call function
fetchAnimeDetails();
