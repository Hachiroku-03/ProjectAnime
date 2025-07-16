async function fetchAllUpcomingAnime() {
    try {
        let response = await fetch("https://api.jikan.moe/v4/seasons/upcoming?limit=25"); 
        let data = await response.json();
        let animeList = data.data.slice(0,25);

        const container = document.getElementById("allUpcomingAnime");
        if (!container) {
            console.error("Error: allUpcomingAnime container not found.");
            return;
        }

        container.innerHTML = ""; // Clear previous content

        animeList.forEach(anime => {
            const animeCard = document.createElement("div");
            animeCard.classList.add("anime-box");

            animeCard.innerHTML = `
             <a href="anime-details.html?id=${anime.mal_id}">
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <h3>${anime.title}</h3>
                </a>
                <p>Episodes: ${anime.episodes || "?"}</p>
                <p>Score: ${anime.score || "N/A"}</p>
                <p>Release: ${anime.aired.prop.from?.year || "TBA"}</p>
            `;

            container.appendChild(animeCard);
        });

        console.log("All upcoming anime displayed!");
    } catch (error) {
        console.error("Error fetching upcoming anime:", error);
    }
}

// Run the function
fetchAllUpcomingAnime();


document.getElementById("searchButton").addEventListener("click", async () => {
    let query = document.getElementById("search").value.trim();
    
    if(query === ""){
        alert("Enter an anime name!");
        return;
    }

    try{
        let response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`)
        let data = await response.json();

         const resultContainer = document.getElementById("searchResults");
         resultContainer.innerHTML="";

         if(!data.data || data.data.length === 0){
            resultContainer.innerHTML="<p>No anime found</p>";
            return;
         }

         let searchResultsList = data.data.slice(0,5);
         
         searchResultsList.forEach(anime =>{
             const animeCard = document.createElement("div");
             animeCard.classList.add("anime-seg");
             let genres = anime.genres.map(genre => genre.name).join(",") || "unknown";
            animeCard.innerHTML=`
             <a href="anime-details.html?id=${anime.mal_id}">
                  <img src="${anime.images.jpg.image_url}" alt="${anime.title}" >
                  <h3>${anime.title}</h3>
                </a>
                  <p>Episode: ${anime.episodes || "?"}</p>
                  <p>Scores: ${anime.score || "N/A"}</p>
                  <p>Genres: ${genres || "N/A"}</p>
                  
            `;

            resultContainer.appendChild(animeCard);

        })
    }
    catch(error){
        console.log("Not found");
    }
})