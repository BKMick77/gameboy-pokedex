let pokemonRepository = (function () {
  let pokemon = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=48&offset=0";
  let isLoading = false;
  let hasMore = true;

  // Add a Pokémon to the repository
  function add(p) {
    pokemon.push(p);
  }

  // Get all Pokémon in the repository
  // This function returns the entire Pokémon list
  function getAll() {
    return pokemon;
  }

  // Capitalize the first letter of a string
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Show details of a Pokémon in a modal
  // This function fetches details about a Pokémon and displays them in a modal
  function showDetails(pokemon) {
    console.log(pokemon);
    pokemonRepository.loadDetails(pokemon).then(function () {
      let types = pokemon.types
        .map((typeSlot) => typeSlot.type.name)
        .join(", ");
      let content = `Height: ${(pokemon.height / 10).toFixed(1)}m 
                Weight: ${(pokemon.weight / 10).toFixed(1)}kg
                Type: ${types}`;
      // let image = pokemon.pixelUrl; //Gen5 Pixel
      let image = pokemon.gen1Url; // Gen1 Pixel
      modalModule.showModal(capitalize(pokemon.name), content, image);
    });
  }

  // Add a Pokémon to the list in the DOM
  // This function creates a new list item for a Pokémon and appends it to the DOM
  function addListItem(pokemon) {
    let list = document.querySelector(".pokemon-list");
    let template = document.querySelector("#cartridge-template");

    let col = document.createElement("div");
    col.classList.add("col-12", "col-md-6", "col-lg-4", "mb-3");

    // (true) clones entire sub tree of template
    let clone = template.content.cloneNode(true);

    // random color with Math.floor() Math.random()
    let cartColors = ["cart--red", "cart--blue", "cart--yellow", "cart--gray"];
    let randomColor = cartColors[Math.floor(Math.random() * cartColors.length)];

    //  finds and removes red wrapper
    let shell = clone.querySelector(".cart--red");
    shell.classList.remove("cart--red");
    shell.classList.add(randomColor);

    // fills Pokemon data
    clone.querySelector(".poke-name").textContent = capitalize(pokemon.name);
    let image = clone.querySelector(".poke-sprite");
    image.src = pokemon.imageUrl;
    image.alt = pokemon.name;

    let cartBody = clone.querySelector(".cart-body");
    cartBody.addEventListener("click", () => {
      showDetails(pokemon);
    });

    col.appendChild(clone);
    list.appendChild(col);
  }

  // Load Pokémon list from the API
  // This function fetches the initial list of Pokémon from the API
  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  // Load details for a specific Pokémon
  // This function fetches additional details about a Pokémon
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.height = details.height;
        item.types = details.types;
        item.weight = details.weight;
        item.imageUrl = details.sprites.other["official-artwork"].front_default;
        item.pixelUrl = details.sprites.front_default;
        item.gen1Url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/transparent/${details.id}.png`;
      })

      .catch(function (e) {
        console.error(e);
      });
  }

  // Load more functionality
  // This function fetches the next set of Pokémon from the API
  function loadMore() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        data.results.forEach((item) => {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
          loadDetails(pokemon).then(() => {
            addListItem(pokemon);
          });
        });
        if (data.next) {
          apiUrl = data.next;
        } else {
          hasMore = false;
        }
      })
      .catch((e) => console.error(e))
      .finally(() => {
        isLoading = false;
      });
  }

  //   loadMore();
  // Infinite scroll

  return {
    getAll,
    add,
    addListItem,
    loadList,
    loadDetails,
    loadMore,
  };
})();

pokemonRepository.loadList().then(() => {
  pokemonRepository.getAll().forEach((pokemon) => {
    pokemonRepository.loadDetails(pokemon).then(() => {
      pokemonRepository.addListItem(pokemon);
    });
  });
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      pokemonRepository.loadMore();
    }
  });
});
