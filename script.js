const BASE_URL = 'https://pokeapi.co/api/v2/pokemon?limit=100&offset=0'


function init() {
    loadContent()
    loadPokeData()
}

async function loadPokeData() {
    let responsePokeDatas = await fetch(BASE_URL);
    let responseAsJson = await responsePokeDatas.json();
    let pokeKeysArray = Object.keys(responseAsJson)

    console.log(pokeKeysArray);
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        if (Object.keys(responseAsJson).length === 0) {
            reject("Keine Daten erhalten");
        }else {
            CreatPokeContent(responseAsJson.results)
            resolve(console.log("Alle Daten erfolgreich verarbeitet")
            );
        }
    }, 300);
  });
}


function loadContent() {
    let contentRef = document.getElementById('content');
    contentRef.innerHTML = getTemplateContent();
}

async function loadPokeImages(url) {
    // Abrufen der Details für das Pokémon
    let detailsResponse = await fetch(url);
    let detailsData = await detailsResponse.json();

    // Zugriff auf das Bild (sprites.front_default)
    return detailsData.sprites.front_default;
}

async function CreatPokeContent(results) {
    let pokeData = document.getElementById('poke_cards');
    for (let index = 0; index < results.length; index++) {
        pokeData.innerHTML += await getTemplatePokeData(results, index);
    }
}

