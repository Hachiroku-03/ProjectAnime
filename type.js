const urlParams = new URLSearchParams(window.location.search);
const typeId = urlParams.get("typeId");

async function fetchAnimeType(typeId) {
    if(!typeId){
        console.log("no anime type");
    
        return;
    }
    try{
        let response = await fetch(`https://api.jikan.moe/v4/anime?type=${typeId}`);
        let data = await response.json();
        
        if(!data.data || data.data.length === 0){
            console.log("No anime found for this type.")
            return;
        }
        
        let animeList = data.data.slice(0,25);
        const animeContainer = document.getElementById("typeContainer")
        animeContainer.innerHTML="";
 
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
    }   
    catch(error){
        console.error("Error fetching anime by type:", error);
    }

  }

  if (typeId) {
    fetchAnimeType(typeId);
} else {
    console.log("No type ID provided.");
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