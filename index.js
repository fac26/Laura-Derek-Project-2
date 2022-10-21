const form = document.querySelector("form");
const apiKey = "Uw5sF7tekQMGdK5DhL2yGg9JPCutP6SU";
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
    const gif = document.querySelector(".search-results-gif");
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${word}&limit=1&offset=0&rating=g&lang=en`)
        .then(response => {
            if (!response.ok){
                throw new Error(response.status); // check that there isn't a error
            }
            return response.json()
        })
        .then(gifSearchResults => {
            if (gifSearchResults.data.length === 0){
                throw new Error("There are no related gifs"); // deal with the problem of no related gifs in the catch block
            }
            const gifURL = gifSearchResults.data[0].images.downsized.url;
            const gifAltText = gifSearchResults.data[0].title;
            gif.src = gifURL;
            gif.alt = gifAltText;

        })
        .catch(error => {
            // code to deal with error goes here
        })
}