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
    let pokemonImage = await loadPokeImages(results[index].url);
return `
    <div class="cards">
        <div>
            <h3>#${index + 1} ${results[index].name}</h3>
        </div>
        <div class="image-container">
            <button><img src="${pokemonImage}" alt=""></button>
        </div>
        <div></div>
    </div>
`
}




