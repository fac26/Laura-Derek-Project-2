const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop the form's default behaviour of submitting
    const input = document.querySelector("input");
    const searchTerm = input.value.toLowerCase().trim(); // save the word to a variable
    input.value = ""; // clear the search bar
    removeBox();
    createOutput();
    getGif(searchTerm);
    getDefinition(searchTerm);
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
            <div class="search-results-description"></div>
        </div>
    <img class="search-results-gif" src="" alt="">
    </output>
    `;
    outputSection.innerHTML = outputSectionHTML; 
    document.body.appendChild(outputSection); // add new section to DOM for displaying search results
}
function removeBox(){
    if (document.body.contains(document.querySelector(".hero"))){
        document.querySelector(".hero").remove();
    }
}

function getGif(word){
    const apiKey = "Uw5sF7tekQMGdK5DhL2yGg9JPCutP6SU";
    const gif = document.querySelector(".search-results-gif");
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${word}&limit=50&offset=0&rating=g&lang=en`)
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
            } else { // If there is a related gif, use a random related gif out of the search results 
            const NoOfResults = gifSearchResults.data.length;
            const randomIndex = Math.floor(Math.random() * NoOfResults);
            const gifURL = gifSearchResults.data[randomIndex].images.downsized.url;
            const gifAltText = gifSearchResults.data[randomIndex].title;
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

function getDefinition(word){
    const headingOutput = document.querySelector(".search-results-heading");
    // request that word from dictionary API
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((response) => {
          if (!response.ok) throw new Error(response.status);
          return response.json();
      })
      .then((data_arr) => {
          data_arr.forEach ( data => {
              headingOutput.textContent = data.word;
              data.meanings.forEach ( meaning => {
                  let subHeading = "";
                  subHeading = document.createElement("p");
                  const wordType = document.createTextNode(`${meaning.partOfSpeech}`);
                  subHeading.appendChild(wordType);
                  subHeading.classList.add("search-results-part-of-speech");
                  const list = document.querySelector(".search-results-description");
                  list.appendChild(subHeading);

                  let index = 0;
                  meaning.definitions.every(item => {
                      let para = "";
                      let str = "";
                      para = document.createElement("p");
                      str += `${[index +1]}) ${item.definition}`;
                      const definition = document.createTextNode(str);
                      para.appendChild(definition);
                      para.classList.add("search-results-definition");
                      const list = document.querySelector(".search-results-description");
                      list.appendChild(para);
                      index +=1;
                      return !(index === 3)
                  })
              })    
          });
      })
      .catch(error => {
          console.log(error);
          let para = "";
          let str = "";
          para = document.createElement("p");
          str += "Sorry, we couldn't find this word in the dictionary.";
          const definition = document.createTextNode(str);
          para.appendChild(definition);
          const list = document.querySelector(".search-results-description");
          list.appendChild(para);
      }) 
    }
