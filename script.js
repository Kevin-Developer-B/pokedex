function init() {
    loadContent()
    loadPokeData()
}

async function loadPokeData() {
    let responsePokeDatas = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0');
    let responseAsJson = await responsePokeDatas.json();
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

function CreatPokeContent(results) {
    let pokeData = document.getElementById('poke_cards');
    for (let index = 0; index < results.length; index++) {
        pokeData.innerHTML += getTemplatePokeData(results, index);
    }
}