const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop the form's default behaviour of submitting
    const input = document.querySelector("input");
    const searchTerm = input.value.toLowerCase().trim(); // save the word to a variable
    input.value = ""; // clear the search bar
    removeBox(); //removes the main placeholder container when user first searches to be replaced by output container
    createOutput(); //creates an output container for the fetched API information with the same styling as the placeholder 
    getGif(searchTerm); //fetches the gif API and returns into the created output container
    getDefinition(searchTerm); //same s getGif but for dictionary definitions of the searched word. 
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
    if (document.body.contains(document.querySelector(".hero"))){ // removes the placeholder container if it exists
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
                        const randomGifURL = randomGif.data.images.downsized.url; //finds the link of the gif
                        const randomGifAltText = randomGif.data.title;//finds the title of the gif to be used as the alt text
                        gif.src = randomGifURL; //sets link of gif to returned data
                        gif.alt = randomGifAltText; //sets alt text to returned data
                    })            
            } else { // If there is a related gif, use a random related gif out of the search results 
            const NoOfResults = gifSearchResults.data.length; //figures out how many gifs returned
            const randomIndex = Math.floor(Math.random() * NoOfResults); //generates a random integer between 0 and number of gifs returned
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
      .then((data_arr) => { //returns object containing data relating to work
          data_arr.forEach ( data => { //looping through each item in the object
            console.log(data_arr)
              headingOutput.textContent = data.word; //accessing the value in the word key
              data.meanings.forEach ( meaning => { //accessing the value in the meanings key. As meanings is an array and not a single value, I'm looping through the array
                  let subHeading = document.createElement("p"); 
                  const wordType = document.createTextNode(`${meaning.partOfSpeech}`); //accessing the value within the part of speech key within each index of the array
                  subHeading.appendChild(wordType); //adding the value of part of speech within the created paragraph tag
                  subHeading.classList.add("search-results-part-of-speech"); //adding the correct css class to the paragraph element
                  const list = document.querySelector(".search-results-description"); 
                  list.appendChild(subHeading);

                  let index = 0; //starting a count
                  meaning.definitions.every(item => { //looping through every index within definitions array within meaning key value
                      let para = document.createElement("p");
                      let str = `${[index +1]}) ${item.definition}`;
                      const definition = document.createTextNode(str);
                      para.appendChild(definition);
                      para.classList.add("search-results-definition");
                      const list = document.querySelector(".search-results-description");
                      list.appendChild(para);
                      index +=1; //adding one to the count each time it loops
                      return !(index === 3) //return false when second index = 3, so that .every stops calling the callback
                  })
              })    
          });
      })
      .catch(error => {
          console.log(error);
          let para = document.createElement("p");
          let str = "Sorry, we couldn't find this word in the dictionary.";
          const definition = document.createTextNode(str);
          para.appendChild(definition);
          const list = document.querySelector(".search-results-description");
          list.appendChild(para);
      }) 
    }
