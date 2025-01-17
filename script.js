const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
let loadAllPokemons = [];
let pokemonRenderList = [];


async function init() {
    await allPokemons()
    pokemonRenderList = loadAllPokemons;
    await content()
    await render()
};

async function allPokemons() {
    for (let index = 1; index < 20; index++) {
        let response = await fetch(BASE_URL + index);
        let responseToJson = await response.json();
        let speciesPokemon = await fetch(responseToJson.species.url);
        let responseSpeciesPokemon = await speciesPokemon.json();
        let pokeEvolutionChain = await fetch(responseSpeciesPokemon.evolution_chain.url);
        let responsePokeEvolutionChain = await pokeEvolutionChain.json();
        let combinedData = {
            pokemonData: responseToJson,
            speciesData: responseSpeciesPokemon,
            evolutionChain: responsePokeEvolutionChain, 
        };
        loadAllPokemons.push(combinedData);
    } 
};

async function content() {
    let refContent = document.getElementById("content");
    refContent.innerHTML = await getTemplateLoadContent();
    
};

function filter() {
    const searchQuery = document.getElementById("pokemon-search").value.toLowerCase();
    if (searchQuery.length < 1) {
        pokemonRenderList = loadAllPokemons;
    } else {
        pokemonRenderList = loadAllPokemons.filter(pokemon => 
            pokemon.pokemonData.name.toLowerCase().startsWith(searchQuery)
        );
    }
    const cardsContainer = document.getElementById('pokeCards');
    cardsContainer.innerHTML = '';
    render();
}

async function render() {
    let refCreatPokeContent = document.getElementById('pokeCards');
    for (let index = 0; index < pokemonRenderList.length; index++) {
        refCreatPokeContent.innerHTML += await getTemplateCreatPokeCards(index);
    } 
};

async function toggleOverlay(index) {
    let refOverlay = document.getElementById('overlay');
    refOverlay.classList.toggle('d-none');
    createOverlayPokeCard(index)
}

function createOverlayPokeCard(index) {
    let refOverlayContainer = document.getElementById('overlayContainer');
    refOverlayContainer.innerHTML = getOverlayContainer(index);
    showMain(index)
}

function showMain(index) {
    let mainDetailsContainer = document.getElementById('mainDetails');
    mainDetailsContainer.innerHTML = getTemplateShowMain(index)
}

function showStats(index) {
    let statsDetailsHTML = getTemplateShowStats(index);
    let statsContainer = document.getElementById("mainDetails");
    statsContainer.innerHTML = statsDetailsHTML;
}

function showEvoChain(index) {
    let evoChainDetailsHTML = getTemplateShowEvoChain(index);
    let evoChainContainer = document.getElementById("mainDetails");
    evoChainContainer.innerHTML = evoChainDetailsHTML;
}

function extractEvolutionChain(evolutionData) {
    let chain = [];
    let currentStage = evolutionData.chain;
    while (currentStage) {
        chain.push(currentStage.species.name);
        currentStage = currentStage.evolves_to.length > 0 ? currentStage.evolves_to[0] : null;
    }
    return chain;
}

function getEvolutionDetails(evolutionChain) {
    return evolutionChain.map(pokemonName => {
        let pokemonData = loadAllPokemons.find(pokemon => pokemon.pokemonData.name === pokemonName);
        return pokemonData
            ? {
                  name: pokemonName,
                  image: pokemonData.pokemonData.sprites.other['official-artwork'].front_default,
              }
            : {
                  name: pokemonName,
                  image: "assets/images/placeholder.png",
              };
    });
}

function setActiveButton(button) {
    let buttons = document.querySelectorAll(".overlay-button");
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
}

function showMainWithActiveState(button, index) {
    setActiveButton(button);
    showMain(index);
}

function showStatsWithActiveState(button, index) {
    setActiveButton(button);
    showStats(index);
}

function showEvoChainWithActiveState(button, index) {
    setActiveButton(button); 
    showEvoChain(index); 
}