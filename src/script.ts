import * as type from './types/interfaces.js';
import {elements} from './domElements.js'

const RMUrl = 'https://rickandmortyapi.com/api/episode';

document.addEventListener('DOMContentLoaded', main);

// This function sets home page
async function main() {
    const { header } = elements;
    header.addEventListener('click', showSeasons);
    setSidebar();
    showSeasons();
}

// This function returns a promise
async function APIFetch<T>(url : string): Promise<T> {
    try {
        const response = await fetch(url);
        const JSONResponse = await response.json();
        return JSONResponse;
    } catch (error) {
        throw new Error(`Something is wrong ${error}`);
    }
}

// This function returns an array with all seasons name
async function getSeasons(): Promise<string[]> {
    try {
        let episodes = await getEpisodes();
        let seasons: string[] = [episodes[0].episode.split('S')[1].split('E')[0]];
        
        episodes.forEach( (episode) => {
            if(!seasons.includes(episode.episode.split('S')[1].split('E')[0])){
                seasons.push(episode.episode.split('S')[1].split('E')[0]);
            }
        });
        
        return seasons;
    } catch (error) {
        throw new Error(`Something is wrong ${error}`);
    }
}

// This function returns an array with all the episodes
async function getEpisodes (): Promise<type.Episode[]> {
    try {
        let page = await APIFetch<type.APIEpisode>(RMUrl);
        let episodes = page.results;
        
        while(page.info.next){
            page = await APIFetch<type.APIEpisode>(page.info.next);
            episodes.push(...page.results);
        }
        
        return episodes;
    } catch (error) {
        throw new Error(`Something is wrong ${error}`);
    }
}

// This function empties element
function cleanSection (element:HTMLElement) {
    element.innerHTML='';
}

// This function sets de side bar menu on the home page
async function setSidebar() {
    try {
        const { navUl } = elements;
        let episodes = await getEpisodes();
        let seasons = await getSeasons();
        
        seasons.forEach( (season) => {
            const seasonNav = `
            <li class="accordion-item">
                <button class="accordion-header accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne${season}" aria-expanded="false" aria-controls="flush-collapseOne">
                Season ${season}
                </button>
                <ul id="flush-collapseOne${season}" class="overflow-y-scroll accordion-collapse collapse" data-bs-parent="#sidebarMenu">
                </ul>
            </li>
            `;
            navUl.insertAdjacentHTML('beforeend', seasonNav);
            episodes.forEach( (episode) => {
                if(episode.episode.split('S')[1].startsWith(season)){
                    const episodeItem = ` 
                    <li><a id="${episode.id}_a_episode" class="accordion-body">${episode.episode}: ${episode.name}</a></li>
                    `;
                    document.getElementById(`flush-collapseOne${season}`)?.insertAdjacentHTML('beforeend',episodeItem);
                    document.getElementById(`${episode.id}_a_episode`)?.addEventListener('click', showEpisodeInfo);
                }
            });
        });
    } catch (error) {
        throw new Error(`Something is wrong ${error}`);
    }
}

// This function prints season buttons on the main section
async function showSeasons() {
    try {
        const { mainSection } = elements;
        cleanSection(mainSection);
        const seasons = await getSeasons();
        
        seasons.forEach( (season) => {
            const seasonBtn = `<button id="main__btn${season}" class="episode__btn" season="${season}">Season ${season}</button>`;
            mainSection.insertAdjacentHTML('beforeend', seasonBtn);
            document.getElementById(`main__btn${season}`)?.addEventListener('click', showEpisodes);
        });
    } catch (error) {
        throw new Error(`Something is wrong ${error}`);
    }
}

// This function creates a card with an optional image, title, body and button
function createCard (title:string, body:string, button:string, img?:string[]): HTMLElement {
    const card = document.createElement('article');
    card.classList.add('myCard');
    if(typeof img !== 'undefined'){
        const cardImg = document.createElement('img');
        cardImg.src = img[0];
        cardImg.title = img[1];
        card.appendChild(cardImg);
    }
    const details = `
    <div class="card-details">
        <p class="text-title">${title}</p>
        <hr>
        <p class="text-body">${body}</p>
    </div>
    <button id="${button}" class="card-button">Episode info</button>
    `;
    card.insertAdjacentHTML('beforeend', details);

    return card;
}

// This function prints cards with episodes' info
async function showEpisodes(e: MouseEvent) {
    try {
        const target = e.target as HTMLButtonElement;
        const season = target.getAttribute('season');
        const episodes = (await getEpisodes()).filter( (episode) => {
            return episode.episode.split('S')[1].split('E')[0] === season;
        });
        const { mainSection } = elements;
        mainSection.innerHTML = '';
        const header = `
            <button id="toHomePage__btn" class="toHomePage__btn">Home</button>
            <h2> Season ${season} </h2>
            <section class="card__container"></section>
        `;
        mainSection.insertAdjacentHTML('beforeend', header);
        document.getElementById('toHomePage__btn')?.addEventListener('click', showSeasons);
        episodes.forEach( (episode) => {
            const episodeCard = createCard(`${episode.episode}: ${episode.name}`, `${episode.air_date}`, `${episode.id}_btn_episode`);
            mainSection.children[mainSection.children.length - 1].insertAdjacentElement('beforeend', episodeCard);
            document.getElementById(`${episode.id}_btn_episode`)?.addEventListener('click', showEpisodeInfo);
        });
    } catch (error) {
        throw new Error(`Something is wrong ${error}`);
    }
    
}

// This function prints the episode information on the main section
async function showEpisodeInfo (e: MouseEvent) {
    try {
        const { mainSection } = elements;
        cleanSection(mainSection);
        const target = e.target as HTMLButtonElement;
        const episodeId = target.id.split('_')[0];
        const episode = (await getEpisodes()).find((e) => e.id.toString() === episodeId);
        const season = episode?.episode.split('S')[1].split('E')[0];
        const header = `
            <button id="to__btn${season}" class="toHomePage__btn" season="${season}">Back season</button>
            <h2>${episode?.episode}: ${episode?.name} </h2>
            <p class="header__info">${episode?.air_date}</p>
            <section class="card__container"></section>
        `;
        const characters = episode?.characters;
        characters?.forEach( async (character) => {
            const characterData = await APIFetch<type.Character>(character);
            characterData.status = characterData.status === 'unknown'? characterData.status = type.Unknown.Status : characterData.status;      
            const characterCard = createCard(`${characterData.name}`, `${characterData.status} | ${characterData.species}`, `${characterData.id}_btn_character`, [`${characterData.image}`, `${characterData.name} image`]);
            mainSection.children[mainSection.children.length - 1].insertAdjacentElement('beforeend', characterCard);
            document.getElementById(`${characterData.id}_btn_character`)?.addEventListener('click', showCharacterInfo);
    
        });
        mainSection.insertAdjacentHTML('beforeend', header);
        document.getElementById(`to__btn${season}`)?.addEventListener('click', showEpisodes);
    } catch (error) {
        throw new Error(`Something is wrong ${error}`);
    }
}

// This function prints the character information on the main section
async function showCharacterInfo(e: MouseEvent) {
    try {
        const { mainSection } = elements;
        mainSection.innerHTML = '';
        const target = e.target as HTMLButtonElement;
        const characterId = target.id.split('_')[0];
        const character = await APIFetch<type.Character>(`https://rickandmortyapi.com/api/character/${characterId}`);
        character.origin.name = character.origin.name === 'unknown'? type.Unknown.Origin : character.origin.name;
        character.status = character.status === 'unknown'? type.Unknown.Status : character.status;
        character.gender = character.gender === 'unknown'? type.Unknown.Gender : character.gender;
        const header = `
        <section class="character__header">
        <img src="${character.image}" alt="${character.name} image">
            <section>
                <button id="toHomePage__btn" class="toHomePage__btn">Home</button>
                <h2> ${character.name} </h2>
                <p class="header__info"> ${character.status} | ${character.species} | ${character.gender} | <a id="${character.origin.name}_a" url=${character.origin.url} title="${character.name} origin page">${character.origin.name}</a></p>
            </section>
        </section>
        `;
        mainSection.insertAdjacentHTML('beforeend', header);
        document.getElementById('toHomePage__btn')?.addEventListener('click', showSeasons);
        if(character.origin.name != type.Unknown.Origin){
            document.getElementById(`${character.origin.name}_a`)?.setAttribute('href', '#');
            document.getElementById(`${character.origin.name}_a`)?.addEventListener('click', showOriginInfo);
        }
        const episodesSection = `<h2> Episodes where ${character.name} appears: ${character.episode.length} </h2>
        <section class="card__container">
        </section>`
        mainSection.insertAdjacentHTML('beforeend', episodesSection);
        character.episode.forEach( async (episode) => {
            const tempEpisode = (await getEpisodes()).find((e) => e.url === episode);
            const episodeCard = createCard(`${tempEpisode?.episode}: ${tempEpisode?.name}`, `${tempEpisode?.air_date}`, `${tempEpisode?.id}_btn_episode`);
            mainSection.children[mainSection.children.length - 1].insertAdjacentElement('beforeend', episodeCard);
            document.getElementById(`${tempEpisode?.id}_btn_episode`)?.addEventListener('click', showEpisodeInfo);
        });        
    } catch (error) {
        throw new Error(`Something is wrong ${error}`);
    }
    
}

// This function prints the location information on the main section
async function showOriginInfo (e: MouseEvent) {
    try {
        const { mainSection } = elements;
        mainSection.innerHTML = '';
        const target = e.target as HTMLButtonElement;
        const originId = target.id.split('_')[0];
        const originUrl = target.getAttribute('url')!;
        let location = await APIFetch<type.Place>(originUrl);
        location.dimension = location.dimension === 'unknown'? type.Unknown.Dimension : location.dimension;
        const header = `
                <button id="toHomePage__btn" class="toHomePage__btn">Home</button>
                <h2> ${location.name} </h2>
                <p class="header__info"> ${location.type} | ${location.dimension}</p>
        `;
        mainSection.insertAdjacentHTML('beforeend', header);
        document.getElementById('toHomePage__btn')?.addEventListener('click', showSeasons);
        const residentsSection = `<h2> Residents in ${location.name}: ${location.residents.length} </h2>
        <section class="card__container">
        </section>`
        mainSection.insertAdjacentHTML('beforeend', residentsSection);
        let characters = location.residents;
        characters.forEach( async (character) => {
            const characterData = await APIFetch<type.Character>(character);
            characterData.status = characterData.status === 'unknown'? type.Unknown.Status : characterData.status;
            const characterCard = createCard(`${characterData.name}`, `${characterData.status} | ${characterData.species}`, `${characterData.id}_btn_character`, [`${characterData.image}`, `${characterData.name} image`]);
            mainSection.children[mainSection.children.length - 1].insertAdjacentElement('beforeend', characterCard);
            document.getElementById(`${characterData.id}_btn_character`)?.addEventListener('click', showCharacterInfo);
        });
    } catch (error) {
        throw new Error('error en showOriginInfo');
    }
}
