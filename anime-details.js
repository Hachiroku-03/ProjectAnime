const urlParams = new URLSearchParams(window.location.search);
const animeId = urlParams.get("id");

async function fetchAnimeDetails() {
    if (!animeId) {
        document.getElementById("animeDetails").innerHTML = "<p>No anime selected.</p>";
        return;
    }

    try {
        let response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`);
        let data = await response.json();
        let anime = data.data;

        // Header Section
        document.getElementById("animeHeader").innerHTML = `
            <div class="anime-header-content">
                <h1 class="anime-title">${anime.title}</h1>
                <p class="anime-score">Score: ${anime.score}</p>
                <p class="anime-status">Status: ${anime.status}</p>
                <p class="anime-synopsis">${anime.synopsis}</p>
            </div>
        `;

        // Anime Info Section
        document.getElementById("animeInfo").innerHTML = `
            <div class="anime-genres">
                <h2>Genres</h2>
                <ul>
                    ${anime.genres.map(genre => `<li>${genre.name}</li>`).join('')}
                </ul>
            </div>
            <div class="anime-details">
                <p><strong>Type:</strong> ${anime.type}</p>
                <p><strong>Aired:</strong> ${anime.aired.string}</p>
                <p><strong>Episodes:</strong> ${anime.episodes}</p>
                <p><strong>Duration:</strong> ${anime.duration}</p>
            </div>
        `;

        // Episodes Section
        fetchEpisodes();

        // Trailer Section
        document.getElementById("animeTrailer").innerHTML = `
        ${anime.trailer.embed_url ? `<iframe width="850" height="500" src="${anime.trailer.embed_url}" frameborder="0" allowfullscreen></iframe>` : "<p>No trailer available.</p>"}
        <h2>Trailer</h2>
        `;

    } catch (error) {
        console.error("Error fetching anime details:", error);
    }
}

// Fetch episode list
async function fetchEpisodes() {
    try {
        let response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes`);
        let data = await response.json();
        let episodes = data.data;

        const episodeListContainer = document.getElementById("episodeListContainer");
        episodeListContainer.innerHTML = episodes.length ? "" : "<p>No episode list available.</p>";

        episodes.forEach(ep => {
            let episodeItem = document.createElement("div");
            episodeItem.classList.add("episode-item");
            episodeItem.innerHTML = `
            <h3>Episode ${ep.mal_id}: ${ep.title}</h3>
            <p>${ep.title}</p>
        
            `;
            episodeListContainer.appendChild(episodeItem);
        });

    } catch (error) {
        console.error("Error fetching episodes:", error);
    }
}

// Run the function on page load
fetchAnimeDetails();


// <a href="${ep.url}" target="_blank">
//                 </a>