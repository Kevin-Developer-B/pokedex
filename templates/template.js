async function getTemplateLoadContent() {
return `
<header>
    <div class="headline">
        <div class="icon-name">
            <img class="header-icon" src="assets/icons/pokemon-icon.png" alt="">
            <h2>Pokedex</h2>
        </div>
        <div>
            <input type="search" id="pokemon-search" placeholder="Search Pokémon" oninput="filterAndShowName()"/>
        </div>
    </div>
</header>
<main>
    <div id="poke_cards" class="cards-position"></div>
</main>
<footer></footer>
<div id="overlay" class="overlay d-none" onclick="toggleOverlay()">
    <div id="overlayContainer"></div>
</div>
    `
}

async function getTemplateCreatPokeCards(name, index, type1, type2) {
return `
    <div class="cards">
        <div class="index-name">
        <p>#${index + 1}</p> <p>${name}</p>
        </div>
        <div class="image-container ${pokeDetails[index].types[0].type.name}" onclick="toggleOverlay(${index})">
            <img class="image" src="${pokeDetails[index].sprites.other['official-artwork'].front_default}" alt="">
        </div>
        <div>
            <div class="type-icon">
                <img class="type-image" src="assets/images/${type1}.png" alt="${type1}">
                ${type2 ? `<img class="type-image" src="assets/images/${type2}.png" alt="${type2}">` : ""}
            </div>
        </div>
    </div>
`
}

function getOverlayContainer(name, index, type1, type2) {
return `
    <div class="overlay-container" onclick="event.stopPropagation()">
        <div class="overlay-pokename-position">
            <p>#${index + 1}</p> <p>${name}</p>
        </div>
            <div class="${pokeDetails[index].types[0].type.name} image-position">
            <img class="overlay-image" src="${pokeDetails[index].sprites.other['official-artwork'].front_default}" alt="">
        </div>
        <div class="type-icon">
            <img class="type-image" src="assets/images/${type1}.png" alt="${type1}">
                ${type2 ? `<img class="type-image" src="assets/images/${type2}.png" alt="${type2}">` : ""}
        </div>
        <div class="button-container">
            <button class="overlay-button active" onclick="showMainWithActiveState(this, ${index})">Main</button>
            <button class="overlay-button" onclick="showStatsWithActiveState(this, ${index})">Stats</button>
            <button class="overlay-button" onclick="showEvoChainWithActiveState(this, ${index})">Evo Chain</button>
        </div>
        <div id="mainDetails" class="details-container"></div> <!-- Platzhalter für Details -->
        <div id="evolutionDetails"></div>
    </div>
`
}

function getTemplateShowMain(height, weight, baseExperience, abilities) {
return `
<div class="main-position">
    <p><strong>Height</strong> <span>: ${height} m</span></p>
    <p><strong>Weight</strong> <span>: ${weight} kg</span></p>
    <p><strong>Base Experience</strong> <span>: ${baseExperience}</span></p>
    <p><strong>Abilities</strong> <span>: ${abilities}</span></p>
</div>
`;
}

function getTemplateShowStats(stats) {
return `
    <div class="stats-position">
    <p><strong>HP:</strong> ${stats.hp} <div class="stat-bar" style="width: ${stats.hp / 2}%"></div></p>
    <p><strong>Attack:</strong> ${stats.attack} <div class="stat-bar" style="width: ${stats.attack / 2}%"></div></p>
    <p><strong>Defense:</strong> ${stats.defense} <div class="stat-bar" style="width: ${stats.defense / 2}%"></div></p>
    <p><strong>Special Attack:</strong> ${stats.specialAttack} <div class="stat-bar" style="width: ${stats.specialAttack / 2}%"></div></p>
    <p><strong>Special Defense:</strong> ${stats.specialDefense} <div class="stat-bar" style="width: ${stats.specialDefense / 2}%"></div></p>
    <p><strong>Speed:</strong> ${stats.speed} <div class="stat-bar" style="width: ${stats.speed / 2}%"></div></p>
    </div>
`
}

function getTemplateEvoChain(formattedName, imageUrl) {
return `
    <div class="evolution-step">
        <img class="overlay-evolution-img" src="${imageUrl}" alt="${formattedName}">
        <p>${formattedName}</p>
    </div>
`
}