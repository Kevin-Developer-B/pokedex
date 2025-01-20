const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
let loadAllPokemons = [];
let pokemonRenderList = [];
let displayedPokemons = 0; 
const POKEMONS_INCREMENT = 20;

async function init() {
    await content();
    await loadSpinner(true);
    await loadMorePokemons();
    pokemonRenderList = loadAllPokemons;
    await render();
    await loadSpinner(false);
};

async function loadMorePokemons() {
    await loadSpinner(true);
    let nextBatchStart = displayedPokemons + 1;
    let nextBatchEnd = displayedPokemons + POKEMONS_INCREMENT;
    for (let index = nextBatchStart; index <= nextBatchEnd; index++) {
        let combinedData = await allPokeData(index);
        if (combinedData) {
            loadAllPokemons.push(combinedData);
        }
    }
    displayedPokemons += POKEMONS_INCREMENT;
    await loadSpinner(false);
    await render();
}

async function allPokeData(index) {
    try {
        let response = await fetch(BASE_URL + index);
        let responseToJson = await response.json();
        let speciesPokemon = await fetch(responseToJson.species.url);
        let responseSpeciesPokemon = await speciesPokemon.json();
        let pokeEvolutionChain = await fetch(responseSpeciesPokemon.evolution_chain.url);
        let responsePokeEvolutionChain = await pokeEvolutionChain.json();
        return {
            pokemonData: responseToJson,
            speciesData: responseSpeciesPokemon,
            evolutionChain: responsePokeEvolutionChain,
        };
    } catch (error) {
        console.error(`Fehler beim Laden von Pokémon #${index}:`, error);
        return null;
    }
}

async function loadSpinner(isLoading) {
    let spinner = document.getElementById('loading-spinner');
    if (spinner) {
        if (isLoading) {
            spinner.classList.remove('d-none');
        } else {
            spinner.classList.add('d-none');
        }
    }
}

async function content() {
    let refContent = document.getElementById("content");
    refContent.innerHTML = await getTemplateLoadContent();
};

function filter() {
    let filterInput = document.getElementById("filterInput");
    let filterword = filterInput.value.toLowerCase();
    let refCreatPokeContent = document.getElementById('pokeCards');
    if (filterword.length >= 3) {
        pokemonRenderList = loadAllPokemons.filter(pokemon => 
            pokemon.pokemonData.name.toLowerCase().startsWith(filterword)
        );
    } else {
        pokemonRenderList = loadAllPokemons;
    }
    if (pokemonRenderList.length === 0) {
        refCreatPokeContent.innerHTML = `
            <div class="no-results">
                <p>Kein Pokémon gefunden. Bitte überprüfe die Eingabe oder versuche es mit einem anderen Namen.</p>
            </div>
        `;
    } else {
        render();
    }
}

async function render() {
    let refCreatPokeContent = document.getElementById('pokeCards');
    refCreatPokeContent.innerHTML = "";
    for (let index = 0; index < Math.min(displayedPokemons, pokemonRenderList.length); index++) {
        refCreatPokeContent.innerHTML += await getTemplateCreatPokeCards(index);
    }
}

async function toggleOverlay(index) {
    let refOverlay = document.getElementById('overlay');
    refOverlay.classList.toggle('d-none');
    if (!refOverlay.classList.contains('d-none') && pokemonRenderList[index]) {
        await createOverlayPokeCard(index);
    }
}

async function createOverlayPokeCard(index) {
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

function switchPokemon(currentIndex, direction) {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < pokemonRenderList.length) {
        const refOverlayContainer = document.getElementById('overlayContainer');
        refOverlayContainer.innerHTML = getOverlayContainer(newIndex);
        showMain(newIndex);
    }
}