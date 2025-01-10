const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0";
let pokeDatas = [];
let currentNames = [];
let pokeDetails = [];
let pokeEvolutionChains = [];

async function init() {
    
    await loadPokeData();
    currentNames = pokeDatas;
    await loadContent();
    currentNames = pokeDatas;
    await creatPokeContent();
    currentNames = pokeDatas;
    await loadAllPokeSpeciesDetails();
    currentNames = pokeDatas;
};

async function loadPokeData() {
    let allPokeData = await loadAllPokeData();
    let pokeKeyArray = Object.keys(allPokeData)
        for (let i = 0; i < pokeKeyArray.length; i++) {
            pokeDatas.push(
                {
                    [pokeKeyArray[i]] : allPokeData[pokeKeyArray[i]],
                }
            ) 
        }
    pokeDatas = allPokeData.results;
};

async function loadAllPokeData() {
    let response = await fetch(BASE_URL);
    return responseToJson = await response.json();
};

async function loadAllSeparatePokeDetails(url) {
    let response = await fetch(url);
    let allPokeDetails = await response.json();
    pokeDetails.push(allPokeDetails);
}

async function loadEvolutionChain(url) {
    try {
        let response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Fehler beim Laden der Evolution Chain: ${response.statusText}`);
        }

        let evolutionData = await response.json();
    } catch (error) {
        console.error("Fehler beim Abrufen der Evolution Chain:", error);
    }
}

async function loadAllPokeSpeciesDetails(url) {
    if (!url) {
        console.log("Keine URL für Spezies-Daten bereitgestellt!");
        return null;
    }
    try {
        let speciesDetail = await fetch(url);
        
        if (!speciesDetail.ok) {
            console.error("Fehler beim Abrufen der Spezies-Daten:", speciesDetail.statusText);
            return null;
        }
        let allSpeciesDetails = await speciesDetail.json();
        return allSpeciesDetails;
    } catch (error) {
        console.error("Fehler beim Abrufen der Spezies-Daten:", error);
        return null;
    }
}

async function loadContent() {
    let refLoadContent = document.getElementById('content');
    refLoadContent.innerHTML = await getTemplateLoadContent();
};

async function creatPokeContent() {
    let refCreatPokeContent = document.getElementById('poke_cards');
    refCreatPokeContent.innerHTML = "";
    for (let index = 0; index < currentNames.length; index++) {
        let poke = currentNames[index];
        let formattedName = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
        let detailedData = await loadAllSeparatePokeDetails(poke.url);
        let type1 = pokeDetails[index].types[0].type.name;
        let type2 = pokeDetails[index].types[1]?.type.name || null;
        if (pokeDetails[index] && pokeDetails[index].species && pokeDetails[index].species.url) {
            let speciesUrl = pokeDetails[index].species.url;
            let speciesData = await loadAllPokeSpeciesDetails(speciesUrl);
            if (speciesData && speciesData.evolution_chain && speciesData.evolution_chain.url) {
                let evolutionChainUrl = speciesData.evolution_chain.url;
                await loadEvolutionChain(evolutionChainUrl);
            } else {
                console.log("Keine Evolution Chain für dieses Pokémon gefunden.");
            }
        } else {
            console.error("Keine Spezies-URL für Pokémon gefunden.");
        }
        createOverlayPokeCard(formattedName, index, type1, type2, detailedData);
        refCreatPokeContent.innerHTML += await getTemplateCreatPokeCards(formattedName, index, type1, type2, detailedData);
    }
}

async function displayEvolutionChain(chain) {
    if (!chain) {
        showNoEvolutionsMessage();
        return;
    }
    let evoChainHTML = "<div class='evolution-container'>";
    let currentEvolution = chain;
    while (currentEvolution) {
        let pokemonName = currentEvolution.species.name;
        let formattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
        let pokemonData;
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            pokemonData = await response.json();
        } catch (error) {
            pokemonData = null;
        }
        let imageUrl = "";
        if (pokemonData && pokemonData.sprites && pokemonData.sprites.other) {
            imageUrl = pokemonData.sprites.other["official-artwork"]?.front_default || "";
        }
        evoChainHTML += getTemplateEvoChain(formattedName, imageUrl)
        if (currentEvolution.evolves_to && currentEvolution.evolves_to.length > 0) {
            evoChainHTML += `
                <div class="evolution-arrow">
                    <p class="bracket">&#x300B;</p> <!-- Pfeil oder Klammer -->
                </div>
            `;
            currentEvolution = currentEvolution.evolves_to[0];
        } else {
            currentEvolution = null;
        }
    }
    evoChainHTML += "</div>";
    let evoContainer = document.getElementById("mainDetails");
    evoContainer.innerHTML = evoChainHTML;
}

function toggleOverlay(index) {
    let refOverlay = document.getElementById('overlay');
    refOverlay.classList.toggle('d-none');
    if (!refOverlay.classList.contains('d-none')) {
        let poke = pokeDatas[index];
        let detailedData = pokeDetails[index];
        let formattedName = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
        let type1 = detailedData.types[0].type.name;
        let type2 = detailedData.types[1]?.type.name || null;
        createOverlayPokeCard(formattedName, index, type1, type2, detailedData);
        showMain(index);
    }
}

function createOverlayPokeCard(formattedName, index, type1, type2,  detailedData) {
    let refOverlayContainer = document.getElementById('overlayContainer');
    refOverlayContainer.innerHTML = getOverlayContainer(formattedName, index, type1, type2,  detailedData);
}

function showMain(index) {
    const detailedData = pokeDetails[index];
    const height = (detailedData.height / 10).toFixed(1);
    const weight = (detailedData.weight / 10).toFixed(1);
    const baseExperience = detailedData.base_experience;
    const abilities = detailedData.abilities.map(ability => ability.ability.name).join(", ");
    let mainDetailsHTML = getTemplateShowMain(height, weight, baseExperience, abilities);
    let mainDetailsContainer = document.getElementById("mainDetails");
    mainDetailsContainer.innerHTML = mainDetailsHTML;
}

function showStats(index) {
    const detailedData = pokeDetails[index];
    const stats = {
        hp: detailedData.stats.find(stat => stat.stat.name === "hp").base_stat,
        attack: detailedData.stats.find(stat => stat.stat.name === "attack").base_stat,
        defense: detailedData.stats.find(stat => stat.stat.name === "defense").base_stat,
        specialAttack: detailedData.stats.find(stat => stat.stat.name === "special-attack").base_stat,
        specialDefense: detailedData.stats.find(stat => stat.stat.name === "special-defense").base_stat,
        speed: detailedData.stats.find(stat => stat.stat.name === "speed").base_stat
    };
    let statsDetailsHTML = getTemplateShowStats(stats);
    const statsContainer = document.getElementById("mainDetails");
    statsContainer.innerHTML = statsDetailsHTML;
}

async function showEvoChain(index) {
    const detailedData = pokeDetails[index];
    const speciesUrl = detailedData.species.url;
    if (!speciesUrl) {
        return;
    }
    const speciesData = await loadAllPokeSpeciesDetails(speciesUrl);
    if (speciesData && speciesData.evolution_chain && speciesData.evolution_chain.url) {
        const evolutionChainUrl = speciesData.evolution_chain.url;
        try {
            let response = await fetch(evolutionChainUrl);
            if (!response.ok) {
                throw new Error(`Fehler beim Laden der Evolution Chain: ${response.statusText}`);
            }
            let evolutionData = await response.json();
            if (evolutionData && evolutionData.chain) {
                displayEvolutionChain(evolutionData.chain);
            } else {
                showNoEvolutionsMessage();
            }
        } catch (error) {
            showNoEvolutionsMessage();
        }
    } else {
        showNoEvolutionsMessage();
    }
}

function showNoEvolutionsMessage() {
    let evoContainer = document.getElementById("evolutionDetails");
    evoContainer.innerHTML = "<p>Keine Entwicklungsstufen für dieses Pokémon vorhanden.</p>";
}

function setActiveButton(button) {
    const buttons = document.querySelectorAll(".overlay-button");
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

async function filterAndShowName() {
    let filterName = document.getElementById('pokemon-search').value.toLowerCase(); 
    currentNames = pokeDatas.filter(pokemon => pokemon.name.toLowerCase().includes(filterName)); 
    await creatPokeContent();
}