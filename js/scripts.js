let pokemonRepository = (function () {
    let pokemon = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function add(p) {
        pokemon.push(p);
    }

    function getAll() {
        return pokemon;
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function showDetails(pokemon) {
        console.log(pokemon);
        pokemonRepository.loadDetails(pokemon).then(function () {
            let types = pokemon.types
                .map((typeSlot) => typeSlot.type.name)
                .join(', ');
            let content = `Height: ${(pokemon.height / 10).toFixed(1)}m 
                Weight: ${(pokemon.weight / 10).toFixed(1)}kg
                Type: ${types}`;
            let image = pokemon.pixelUrl;

            modalModule.showModal(capitalize(pokemon.name), content, image);
        });
    }

    function addListItem(pokemon) {
        let list = document.querySelector('.pokemon-list');
        let template = document.querySelector('#cartridge-template');

        // (true) clones entire sub tree of template
        let clone = template.content.cloneNode(true);

        // Random color with Math.floor() Math.random()
        let cartColors = [
            'cart--red',
            'cart--blue',
            'cart--yellow',
            'cart--gray',
        ];
        let randomColor =
            cartColors[Math.floor(Math.random() * cartColors.length)];

        //  finds and removes red wrapper
        let shell = clone.querySelector('.cart--red');
        shell.classList.remove('cart--red');
        shell.classList.add(randomColor);

        // fills Pokemon data
        clone.querySelector('.poke-name').textContent = capitalize(
            pokemon.name
        );
        let image = clone.querySelector('.poke-sprite');
        image.src = pokemon.imageUrl;
        image.alt = pokemon.name;

        let cartBody = clone.querySelector('.cart-body');
        cartBody.addEventListener('click', () => {
            showDetails(pokemon);
        });

        list.appendChild(clone);
    }

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

    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (details) {
                item.height = details.height;
                item.types = details.types;
                item.imageUrl =
                    details.sprites.other['official-artwork'].front_default;
                item.pixelUrl = details.sprites.front_default;
                item.weight = details.weight;
            })
            .catch(function (e) {
                console.error(e);
            });
    }

    return {
        getAll: getAll,
        add: add,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
    };
})();

pokemonRepository.loadList().then(() => {
    pokemonRepository.getAll().forEach((pokemon) => {
        pokemonRepository.loadDetails(pokemon).then(() => {
            pokemonRepository.addListItem(pokemon);
        });
    });
});
