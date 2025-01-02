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









function getTemplatePokeData(results, index) {
return `
    <div class="cards">
        <p style="color: white">#${results[index].id} ${results[index].name}</p>
    </div>
`
}




