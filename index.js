const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop the form's default behaviour of submitting
    const input = document.querySelector("input");
    const searchTerm = input.value.toLowerCase().trim(); // save the word to a variable
    input.value = ""; // clear the search bar
    createOutput();
    getGif(searchTerm);
})

function createOutput(){
    if (document.body.contains(document.querySelector(".search-results"))){
        document.querySelector(".search-results").remove();
    } // remove the existing search results if it exists
    const outputSection = document.createElement("section");
    outputSection.classList.add("search-results");
    const outputSectionHTML = 
    `
    <output class="search-results-container">
        <div class="search-results-info">
            <h2 class="search-results-heading"></h2>
            <p class="search-results-description"></p>
        </div>
    <img class="search-results-gif" src="" alt="">
    </output>
    `;
    outputSection.innerHTML = outputSectionHTML; 
    document.body.appendChild(outputSection); // add new section to DOM for displaying search results
}

function getGif(word){
    const apiKey = "Uw5sF7tekQMGdK5DhL2yGg9JPCutP6SU";
    const gif = document.querySelector(".search-results-gif");
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${word}&limit=1&offset=0&rating=g&lang=en`)
        .then(response => {
            if (!response.ok){
                throw new Error(response.status); // throw error if GIPHY doesn't respond
            }
            return response.json()
        })
        .then(gifSearchResults => {
            if (gifSearchResults.data.length === 0){ // If no gifs are returned, fetch a random gif
                fetch(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&limit=1&rating=g`)
                    .then(response => {
                        if (!response.ok){
                            throw new Error(response.status); // throw error if GIPHY doesn't respond
                        }
                       return response.json()
                    })
                    .then(randomGif => {
                        const randomGifURL = randomGif.data.images.downsized.url;
                        const randomGifAltText = randomGif.data.title;
                        gif.src = randomGifURL;
                        gif.alt = randomGifAltText;
                    })            
            } else { // If there is a related gif, use the first related gif that comes up 
            const gifURL = gifSearchResults.data[0].images.downsized.url;
            const gifAltText = gifSearchResults.data[0].title;
            gif.src = gifURL;
            gif.alt = gifAltText;
            }
        })
        .catch(error => {
            console.log(error);
            gif.src = "https://media4.giphy.com/media/iI4vhciiVh2b3j9sgo/giphy.gif?cid=ecf05e477g6pz5sfswgsvbkvkzrkq6lxssi2fstgewa7kvdn&rid=giphy.gif&ct=g";
            gif.alt = "Neon planet landscape gif by dualvoidanima"; // If there's some error, use the default gif
        })
}