function getTemplateContent() {
return `
<header>
    <div class="headline">
        <div class="icon-name">
            <img class="header-icon" src="assets/icons/pokemon-icon.png" alt="" />
            <h2>Pokedex</h2>
        </div>
    <div>
        <input type="search" name="" id="" />
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

async function getTemplatePokeData(results, index) {
    let pokeData = await getPokeData(results, index);
return `
    <div class="cards">
        <div class="text-container">
            <p>#${index + 1}</p> <p>${pokeData.pokemonName}</p>
        </div>
        <div class="image-container ${pokeData.pokemonType}">
            <button class="image-btn" onclick="toggleOverlay('${pokeData.pokemonName}', '${pokeData.pokemonImage}', '${pokeData.pokemonType}', '${pokeData.primaryTypeImagePath}', '${pokeData.secondaryTypeImagePath}', ${index + 1})">
            <img class="image" src="${pokeData.pokemonImage}" alt="">
        </button>
        </div>
        <div class="type-icon">
            <button>
                <img class="type-image" src="${pokeData.primaryTypeImagePath}" alt="Primary Type">
                ${pokeData.secondaryTypeImagePath 
                    ? `<img class="type-image" src="${pokeData.secondaryTypeImagePath}" alt="Secondary Type">`
                    : ''}
            </button>
        </div>
        
    </div>
`
}


function getOverlayContainer(pokemonName, pokemonImage, pokemonType, primaryTypeImagePath, secondaryTypeImagePath, index) {
    return `
       <div class="overlay-container" onclick="event.stopPropagation()">
            <h2>#${index + 1} ${pokemonName}</h2>
        <div class="${pokemonType} image-position">
            <img class="overlay-image" src="${pokemonImage}" alt="${pokemonName}">
        </div>
        <div class="type-icon">
            <img class="type-image" src="${primaryTypeImagePath}" alt="Primary Type">
            ${secondaryTypeImagePath 
                ? `<img class="type-image" src="${secondaryTypeImagePath}" alt="Secondary Type">`
                : ''}
        </div>
        <div class="overlay-container-button">
            <button class="info-btn" onclick="showInfoMain()">Main</button>
            <button class="info-btn" onclick="showInfoStats()">Stats</button>
            <button class="info-btn" onclick="showInfoEvoChain()">Evo Chain</button>
           </div>
        <div class="informaition-content">
            <div id="infoMain"></div>
            <div id="infoStats"></div>
            <div id="infoEvoChain"></div>
       </div>
       </div>
       
    `
}

function getInfoTemplateMain() {
    return `
    
    `;
}

function getInfoTemplateStats() {
    return `
    <h1>Bello</h1>
    `
}

function getInfoTemplateEvoChain() {
    return `
    <h1>Tschau</h1>
    `
}

