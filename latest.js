async function fetchLatestAnime() {
    try {
        const response = await fetch("https://api.jikan.moe/v4/seasons/now?limit=25");
        const data = await response.json();
        const animeList = data.data.slice(0, 25); // Get 10 latest anime

        const animeContainer = document.getElementById("animeContainer");
        animeContainer.innerHTML = ""; // Clear previous content

        animeList.forEach(anime => {
            const animeCard = document.createElement("div");
            animeCard.classList.add("anime-card");
            animeCard.innerHTML = `
             <a href="anime-details.html?id=${anime.mal_id}">
                <img  src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <h3>${anime.title}</h3>
                </a>
                <p>Episodes: ${anime.episodes || "?"}</p>
                <p>Score: ${anime.score || "N/A"}</p>
            `;
            animeContainer.appendChild(animeCard);
        });
    } catch (error) {
        console.error("Error fetching anime:", error);
    }
}

fetchLatestAnime();




document.getElementById("searchButton").addEventListener("click", async () => {
    let query = document.getElementById("search").value.trim();
    
    if (query === "") {
        alert("Please enter an anime name!");
        return;
    }

    try {
        let response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
        let data = await response.json();

        const resultsContainer = document.getElementById("searchResults");
        resultsContainer.innerHTML = ""; // Clear previous results

        if (!data.data || data.data.length === 0) {
            resultsContainer.innerHTML = "<p>No results found.</p>";
            return;
        }

        // Display first 5 search results
        data.data.slice(0, 5).forEach(anime => {
            const animeCard = document.createElement("div");
            animeCard.classList.add("anime-seg");
            animeCard.innerHTML = `
             <a href="anime-details.html?id=${anime.mal_id}">
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <h3>${anime.title}</h3>
             </a>
                <p>Episodes: ${anime.episodes || "?"}</p>
                <p>Score: ${anime.score || "N/A"}</p>
            `;
            resultsContainer.appendChild(animeCard);
        });

    } catch (error) {
        console.error("Error fetching anime search results:", error);
    }
});

document.getElementById('btn').addEventListener("click", function fetchButtonTop (){
         window.scrollTo({top: 0, behavior: 'smooth'});
})

fetchButtonTop()