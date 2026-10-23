$(function () {
    let baseURL = "https://pokeapi.co/api/v2";

    //1. Get all Pokemon
    $.getJSON(`${baseURL}/pokemon?limit=1400`).then(data => {
        console.log(data);
    }); 

    //2. Requests to 3 random pokemon
    $.getJSON(`${baseURL}/pokemon?limit=1400`).then(data => {
        let randomPokemon = [];
        for (let i = 0; i < 3; i++) {
            let randomIndex = Math.floor(Math.random() * data.results.length);
            randomPokemon.push(data.results[randomIndex]);
        }
        console.log("Random Pokemon:", randomPokemon);
    });

    //3. Makes a request to the API for 3 random pokemon and logs
  let names = null;
  $.getJSON(`${baseURL}/pokemon/?limit=1000`)
    .then(data => {
      let randomPokemonUrls = [];
      for (let i = 0; i < 3; i++) {
        let randomIdx = Math.floor(Math.random() * data.results.length);
        let url = data.results.splice(randomIdx, 1)[0].url;
        randomPokemonUrls.push(url);
      }
      return Promise.all(randomPokemonUrls.map(url => $.getJSON(url)));
    })
    .then(data => {
      names = data.map(d => d.name);
      return Promise.all(data.map(d => $.getJSON(d.species.url)))
    })
    .then(data => {
      let descriptions = data.map(d => {
        let descriptionObj = d.flavor_text_entries.find(
          entry => entry.language.name === "en"
        );
        return descriptionObj ? descriptionObj.flavor_text : "No description available."; 
      });
      descriptions.forEach((desc, i) => {
        console.log(`${names[i]}: ${desc}`);
      });
    });

    //4. Creates a UI for the randomly generated pokemon. Includes the name of the pokemon, an image of the pokemon, and the description of its species.
    let $pokeArea = $("#pokemon-area");

  $btn.on("click", function() {
    $pokeArea.empty();
    let namesAndImages = [];
    $.getJSON(`${baseURL}/pokemon/?limit=1000`)
      .then(data => {
        let randomPokemonUrls = [];
        for (let i = 0; i < 3; i++) {
          let randomIdx = Math.floor(Math.random() * data.results.length);
          let url = data.results.splice(randomIdx, 1)[0].url;
          randomPokemonUrls.push(url);
        }
        return Promise.all(randomPokemonUrls.map(url => $.getJSON(url)));
      })
      .then(pokemonData => {
        namesAndImages = pokemonData.map(p => ({
          name: p.name,
          imgSrc: p.sprites.front_default
        }));
        return Promise.all(pokemonData.map(p => $.getJSON(p.species.url)));
      })
      .then(speciesData => {
        speciesData.forEach((d, i) => {
          let descriptionObj = d.flavor_text_entries.find(function(entry) {
            return entry.language.name === "en";
          });
          let description = descriptionObj ? descriptionObj.flavor_text : "";
          let { name, imgSrc } = namesAndImages[i];
          $pokeArea.append(makePokeCard(name, imgSrc, description));
        });
      });
  });

  function makePokeCard(name, imgSrc, description) {
    return `
      <div class="card">
        <h1>${name}</h1>
        <img src=${imgSrc} />
        <p>${description}</p>
      </div>
    `;
  }
});
