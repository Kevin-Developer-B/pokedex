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
`
}

async function getTemplatePokeData(results, index) {
    let pokeData = await getPokeData(results, index);
return `
    <div class="cards">
        <div class="text-container">
            <P>#${index + 1}</p> <p>${pokeData.pokemonName}</p>
        </div>
        <div class="image-container ${pokeData.pokemonType}">
            <button class="image-btn">
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




