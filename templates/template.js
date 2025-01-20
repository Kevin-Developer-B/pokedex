async function getTemplateLoadContent() {
    return `
    <header>
        <div class="headline">
            <div class="icon-name">
                <img class="icon" src="assets/icons/pokemon-icon.png" alt="">
                <h2>Pokedex</h2>
            </div>
            <div>
                <input type="text" id="filterInput" oninput="filter()" placeholder="search Pokémon...">
            </div>
        </div>
    </header>
    <div id="loading-spinner" class="d-none spinner-overlay">
        <div class="spinner-position">
            <img src="assets/icons/pokemon-icon.png" alt="Loading" id="spinner-img">
            <p>loading...</p>
        </div>
    </div>
    <main>
        <div id="pokeCards" class="cards-position"></div>
        <div class="load-more-button-container">
            <button id="loadMoreButton" class="load-more-button" onclick="loadMorePokemons()">show more</button>
        </div>
    </main>
    <footer></footer>
    <div id="overlay" class="overlay d-none" onclick="toggleOverlay()">
        <div id="overlayContainer"></div>
    </div>
    `;
}
    
async function getTemplateCreatPokeCards(index) {
    return `
        <div class="cards">
            <div class="index-name">
                <p>#${pokemonRenderList[index].pokemonData.id}</p> <p>${pokemonRenderList[index].pokemonData.name.charAt(0).toUpperCase() + pokemonRenderList[index].pokemonData.name.slice(1)}</p>
            </div>
            <div class="image-container ${pokemonRenderList[index].pokemonData.types[0].type.name}" onclick="toggleOverlay(${index})">
                <img class="image" src="${pokemonRenderList[index].pokemonData.sprites.other['official-artwork'].front_default}" alt="">
            </div>
            <div>
                <div class="type-icon">
                    <img class="type-image" src="assets/images/${pokemonRenderList[index].pokemonData.types[0].type.name}.png" alt="">
                    ${pokemonRenderList[index].pokemonData.types[1] ? `<img class="type-image" src="assets/images/${pokemonRenderList[index].pokemonData.types[1].type.name}.png" alt="">` : ""}
                </div>
            </div>
        </div>
    `
    }
    
    function getOverlayContainer(i) {
        const isFirst = i === 0;
        const isLast = i === pokemonRenderList.length - 1;
        return `
            <div class="overlay-container" onclick="event.stopPropagation()">
                <div class="overlay-pokename-position">
                   <p>#${pokemonRenderList[i].pokemonData.id}</p> 
                   <p>${pokemonRenderList[i].pokemonData.name.charAt(0).toUpperCase() + pokemonRenderList[i].pokemonData.name.slice(1)}</p>
                   <button class="close-button" onclick="toggleOverlay()">X</button>
                </div>
                <div class="${pokemonRenderList[i].pokemonData.types[0].type.name} image-position">
                    <img class="overlay-image" src="${pokemonRenderList[i].pokemonData.sprites.other['official-artwork'].front_default}" alt="">
                </div>
                <div>
                    <div class="type-icon">
                        <img class="type-image" src="assets/images/${pokemonRenderList[i].pokemonData.types[0].type.name}.png" alt="">
                        ${pokemonRenderList[i].pokemonData.types[1] ? `<img class="type-image" src="assets/images/${pokemonRenderList[i].pokemonData.types[1].type.name}.png" alt="">` : ""}
                    </div>
                    <div class="button-container">
                        <button class="overlay-button active" onclick="showMainWithActiveState(this, ${i})">Main</button>
                        <button class="overlay-button" onclick="showStatsWithActiveState(this, ${i})">Stats</button>
                        <button class="overlay-button" onclick="showEvoChainWithActiveState(this, ${i})">Evo Chain</button>
                    </div>
                    <div id="mainDetails" class="details-container"></div>
                    <div id="evolutionDetails"></div>
                </div>
                <div class="navigation-buttons">
                    <button 
                        class="nav-button ${isFirst ? 'd-none' : ''}" 
                        onclick="switchPokemon(${i}, -1)">←</button>
                    <button 
                        class="nav-button ${isLast ? 'd-none' : ''}" 
                        onclick="switchPokemon(${i}, 1)">→</button>
                </div>
            </div>
        `;
    }
    
function getTemplateShowMain(index) {
    return `
    <div class="main-position">
        <p><strong>Height</strong> <span>: ${pokemonRenderList[index].pokemonData.height} m</span></p>
        <p><strong>Weight</strong> <span>: ${pokemonRenderList[index].pokemonData.weight} kg</span></p>
        <p><strong>Base Experience</strong> <span>: ${pokemonRenderList[index].pokemonData.base_experience}</span></p>
        <p><strong>Abilities</strong> <span>: ${
                pokemonRenderList[index].pokemonData.abilities && pokemonRenderList[index].pokemonData.abilities.length > 0
                    ? pokemonRenderList[index].pokemonData.abilities
                        .map(ability => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1))
                        .join(', ')
                    : 'No Abilities Available'
            }</span></p>
    </div>
    `;
    };
    
function getTemplateShowStats(i) {
    return `
        <div class="stats-position">
        <p><strong>HP:</strong> ${pokemonRenderList[i].pokemonData.stats[0].base_stat} <div class="stat-bar" style="width: ${pokemonRenderList[i].pokemonData.stats[0].base_stat/ 2}%"></div></p>
        <p><strong>Attack:</strong> ${pokemonRenderList[i].pokemonData.stats[1].base_stat} <div class="stat-bar" style="width: ${pokemonRenderList[i].pokemonData.stats[1].base_stat/ 2}%"></div></p>
        <p><strong>Defense:</strong> ${pokemonRenderList[i].pokemonData.stats[2].base_stat} <div class="stat-bar" style="width: ${pokemonRenderList[i].pokemonData.stats[2].base_stat/ 2}%"></div></p>
        <p><strong>Special Attack:</strong> ${pokemonRenderList[i].pokemonData.stats[3].base_stat} <div class="stat-bar" style="width: ${pokemonRenderList[i].pokemonData.stats[3].base_stat/ 2}%"></div></p>
        <p><strong>Special Defense:</strong> ${pokemonRenderList[i].pokemonData.stats[4].base_stat} <div class="stat-bar" style="width: ${pokemonRenderList[i].pokemonData.stats[4].base_stat/ 2}%"></div></p>
        <p><strong>Speed:</strong> ${pokemonRenderList[i].pokemonData.stats[5].base_stat} <div class="stat-bar" style="width: ${pokemonRenderList[i].pokemonData.stats[5].base_stat/ 2}%"></div></p>
        </div>
    `;
    };
    
    function getTemplateShowEvoChain(index) {
        let evolutionChain = extractEvolutionChain(pokemonRenderList[index].evolutionChain);
        let evolutionDetails = getEvolutionDetails(evolutionChain);
        let evoChainHTML = evolutionDetails
            .map((evo, i) => ` <!-- Verwende 'i' statt 'index' -->
            <div class="evo-stage">
                <div class="evo-chain-container">
                    <img class="overlay-evolution-img" src="${evo.image}" alt="${evo.name}">
                    <p class="evo-name">${evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}</p>
                </div>
                ${i < evolutionDetails.length - 1 ? '<div class="arrow">→</div>' : ""} <!-- Überprüfe den Schleifenindex 'i' -->
            </div>
        `)
            .join("");
        return `
        <div class="evolution-container">
            ${evoChainHTML}
        </div>
        `;
    }