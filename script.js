const BASE_URL = 'https://pokeapi.co/api/v2/pokemon?limit=100&offset=0'


function init() {
    loadContent()
    loadPokeData()
}

async function loadPokeData() {
    let responsePokeDatas = await fetch(BASE_URL);
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

async function loadPokeImages(url) {
    // Abrufen der Details für das Pokémon
    let detailsResponse = await fetch(url);
    let detailsData = await detailsResponse.json();

    // Zugriff auf das Bild (sprites.front_default)
    return detailsData.sprites.front_default;
}

async function loadPokeDetails(url) {
    // Abrufen der Details für das Pokémon
    let detailsResponse = await fetch(url);
    let detailsData = await detailsResponse.json();
    // console.log(detailsData); // Überprüfe hier die Struktur der API-Antwort

    return {
        pokemonImage: detailsData.sprites.front_default,
        primaryType: detailsData.types[0]?.type.name || 'normal',
        secondaryType: detailsData.types[1]?.type.name || '',
    };
}

async function getPokeData(results, index) {
    // Details des Pokémons abrufen (Bild und Typ)
    let pokeDetails = await loadPokeDetails(results[index].url);

    // Bildpfade für Primary- und Secondary-Typen vorbereiten
    let primaryTypeImagePath = `assets/images/${pokeDetails.primaryType}.png`;
    let secondaryTypeImagePath = pokeDetails.secondaryType
        ? `assets/images/${pokeDetails.secondaryType}.png`
        : ''; // Falls kein zweiter Typ vorhanden ist, bleibt der Pfad leer.

    // Rückgabe der gesammelten Daten als Objekt
    return {
        pokemonImage: pokeDetails.pokemonImage,
        pokemonName: results[index].name,
        pokemonType: pokeDetails.primaryType,
        primaryTypeImagePath,
        secondaryTypeImagePath,
    };
}

async function CreatPokeContent(results) {
    let pokeData = document.getElementById('poke_cards');
    for (let index = 0; index < results.length; index++) {
        pokeData.innerHTML += await getTemplatePokeData(results, index);
    }
}

function toggleOverlay(pokemonName = '', pokemonImage = '', pokemonType = '', primaryTypeImagePath = '', secondaryTypeImagePath = '', index = '', pokemonData = '') {
    let refOverlay = document.getElementById('overlay');
    refOverlay.classList.toggle('d-none');
    let refOverlayContainer = document.getElementById('overlayContainer');
    refOverlayContainer.innerHTML = getOverlayContainer(pokemonName, pokemonImage, pokemonType, primaryTypeImagePath, secondaryTypeImagePath, index);

    showInfoMain()
}

function showInfoMain() {
    let refInformationMain = document.getElementById('infoMain');
    refInformationMain.innerHTML = getInfoTemplateMain();
    document.getElementById('infoStats').innerHTML = '';
    document.getElementById('infoEvoChain').innerHTML = '';
}

function showInfoStats() {
    let refInformationStats = document.getElementById('infoStats');
    refInformationStats.innerHTML = getInfoTemplateStats();
    // Leere die anderen Container (falls sie vorher gesetzt wurden)
    document.getElementById('infoMain').innerHTML = '';
    document.getElementById('infoEvoChain').innerHTML = '';
}

function showInfoEvoChain() {
    let refInformationEvoChain = document.getElementById('infoEvoChain');
    refInformationEvoChain.innerHTML = getInfoTemplateEvoChain();
    // Leere die anderen Container (falls sie vorher gesetzt wurden)
    document.getElementById('infoMain').innerHTML = '';
    document.getElementById('infoStats').innerHTML = '';
}