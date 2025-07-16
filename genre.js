// Extract the genreId from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const genreId = urlParams.get('genreId'); // Get the genreId from the URL

// Function to fetch anime based on the genreId
async function fetchAnimeByGenre(genreId) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}`);
        const data = await response.json();
        const animeList = data.data.slice(0, 25); // Get the first 6 anime of the selected genre

        const animeContainer = document.getElementById("genreContainer");
        genreContainer.innerHTML = ""; // Clear previous content

        // Loop through the anime list and create a card for each anime
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
        console.error("Error fetching anime by genre:", error);
    }
}

// Fetch the anime for the genre on page load
if (genreId) {
    fetchAnimeByGenre(genreId);
} else {
    console.log("No genre ID provided.");
}


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
                  <p>Scores: ${genres || "N/A"}</p>
                  
            `;

            resultContainer.appendChild(animeCard);

        })
    }
    catch(error){
        console.log("Not found");
    }
})



document.getElementById('btn').addEventListener("click", function fetchButtonTop (){
         window.scrollTo({top: 0, behavior: 'smooth'});
})

fetchButtonTop()
