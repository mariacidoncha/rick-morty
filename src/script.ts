import * as type from './types/interfaces';
import {elements} from './domElements.js'

const RMUrl = 'https://rickandmortyapi.com/api/episode';

// This function sets home page
async function main() {
    showSidebar();
    showSeasons();
}
main();

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

async function getEpisodes (): Promise<type.Episode[]> {
    let page = await APIFetch<type.APIEpisode>(RMUrl);
    let episodes = page.results;
    
    while(page.info.next){
        page = await APIFetch<type.APIEpisode>(page.info.next);
        episodes.push(...page.results);
    }
    
    return episodes;
}

async function getSeasons(): Promise<string[]> {
    let episodes = await getEpisodes();
    let seasons: string[] = [episodes[0].episode.split('E')[0]];
    
    episodes.forEach( (episode) => {
        if(!seasons.includes(episode.episode.split('E')[0])){
            seasons.push(episode.episode.split('E')[0]);
        }
    });
    
    return seasons;
}

async function getCharacter (url: string): Promise<type.Character> {
    let page = await APIFetch<type.Character>(url);
    
    return page;
}

async function getLocation (url:string): Promise<type.Place> {
    let page = await APIFetch<type.Place>(url);

    return page;
}

async function showSidebar() {
    const { sidebarMenu } = elements;
    let episodes = await getEpisodes();
    let seasons = await getSeasons();
    
    seasons.forEach( (season) => {
        const seasonNav = `
        <div class="accordion-item">
        <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne${season}" aria-expanded="false" aria-controls="flush-collapseOne">
        Season ${season}
        </button>
        </h2>
        <div id="flush-collapseOne${season}" class="overflow-y-scroll accordion-collapse collapse" data-bs-parent="#sidebarMenu">
        
        </div>
        </div>
        `;
        sidebarMenu.insertAdjacentHTML('beforeend', seasonNav);
        episodes.forEach( (episode) => {
            if(episode.episode.startsWith(season)){
                const episodeItem = ` 
                <a id="${episode.id}_a_episode" class="accordion-body">${episode.episode}: ${episode.name}</a>
                `;
                document.getElementById(`flush-collapseOne${season}`)?.insertAdjacentHTML('beforeend',episodeItem);
                document.getElementById(`${episode.id}_a_episode`)?.addEventListener('click', showEpisodeInfo);
            }
        });
    });
}

async function showSeasons() {
    const { mainSection } = elements;
    mainSection.innerHTML = '';
    const seasons = await getSeasons();
    
    seasons.forEach( (season) => {
        const seasonBtn = `<button id="main__btn${season}" class="episode__btn">Season ${season}</button>`;
        mainSection.insertAdjacentHTML('beforeend', seasonBtn);
        document.getElementById(`main__btn${season}`)?.addEventListener('click', showEpisodes);
    });
}

async function showEpisodes(e: MouseEvent) {
    const target = e.target as HTMLButtonElement;
    const season = target.id.split('S')[1];
    const episodes = (await getEpisodes()).filter( (episode) => {
        return episode.episode.split('S')[1].split('E')[0] === season;
    });
    const { mainSection } = elements;
    mainSection.innerHTML = '';
    const header = `
    <button id="toHomePage__btn" class="toHomePage__btn">Home</button>
    <h2> Season ${season} </h2>
    <section class="card__container"></section>
    `
    mainSection.insertAdjacentHTML('beforeend', header);
    document.getElementById('toHomePage__btn')?.addEventListener('click', showSeasons);
    episodes.forEach( (episode) => {
        const episodeCard = ` 
        <article class="card">
            <div class="card-details">
                <p class="text-title">${episode.episode}: ${episode.name}</p>
                <hr>
                <p class="text-body">${episode.air_date}</p>
            </div>
            <button id="${episode.id}_btn_episode" class="card-button">Episode info</button>
        </article>
        `
        mainSection.children[mainSection.children.length - 1].insertAdjacentHTML('beforeend', episodeCard);
        document.getElementById(`${episode.id}_btn_episode`)?.addEventListener('click', showEpisodeInfo);
    });
    
}

async function showEpisodeInfo (e: MouseEvent) {
    const { mainSection } = elements;
    mainSection.innerHTML = '';
    const target = e.target as HTMLButtonElement;
    const episodeId = target.id.split('_')[0];
    const episode = (await getEpisodes()).find((e) => e.id.toString() === episodeId);
    const season = episode?.episode.split('E')[0];
    const header = `
        <button id="to__btn${season}" class="toHomePage__btn">Back season</button>
        <h2>${episode?.episode}: ${episode?.name} </h2>
        <h3>${episode?.air_date}</h3>
        <section class="card__container"></section>
    `;
    const characters = episode?.characters;
    characters?.forEach( async (character) => {
        const info = await getCharacter(character);
        const characterCard = ` 
        <article class="card">
        <img src="${info.image}" title="${info.name} image">
        <div class="card-details">
            <p class="text-title">${info.name}</p>
                <hr>
                <p class="text-body">${info.status} | ${info.species}</p>
            </div>
            <button id="${info.id}_btn_character" class="card-button">Character info</button>
        </article>
        `;
        mainSection.children[mainSection.children.length - 1].insertAdjacentHTML('beforeend', characterCard);
        document.getElementById(`${info.id}_btn_character`)?.addEventListener('click', showCharacterInfo);

    });
    mainSection.insertAdjacentHTML('beforeend', header);
    document.getElementById(`to__btn${season}`)?.addEventListener('click', showEpisodes);
}

async function showCharacterInfo(e: MouseEvent) {
    const { mainSection } = elements;
    mainSection.innerHTML = '';
    const target = e.target as HTMLButtonElement;
    const characterId = target.id.split('_')[0];
    const character = await getCharacter(`https://rickandmortyapi.com/api/character/${characterId}`);
    const header = `
    <section class="character__header">
    <img src="${character.image}" alt="${character.name} image">
        <section class="character__info">
            <button id="toHomePage__btn" class="toHomePage__btn">Home</button>
            <h2> ${character.name} </h2>
            <h3> ${character.species} | ${character.status} | ${character.gender} | <a href="#" id="${character.origin.name}_a" url=${character.origin.url} title="${character.name} origin page">${character.origin.name}</a></h3>
        </section>
    </section>
    `;
    mainSection.insertAdjacentHTML('beforeend', header);
    document.getElementById('toHomePage__btn')?.addEventListener('click', showSeasons);
    if(character.origin.name != 'unknown'){
        document.getElementById(`${character.origin.name}_a`)?.addEventListener('click', showOrigin);
    }
    const episodesSection = `<h2> Episodes where ${character.name} appears: ${character.episode.length} </h2>
    <section class="card__container">
    </section>`
    mainSection.insertAdjacentHTML('beforeend', episodesSection);
    character.episode.forEach( async (episode) => {
        const tempEpisode = (await getEpisodes()).find((e) => e.url === episode);
        const episodeCard = `
        <article class="card">
            <div class="card-details">
                <p class="text-title">${tempEpisode?.episode}: ${tempEpisode?.name}</p>
                <hr>
                <p class="text-body">${tempEpisode?.air_date}</p>
            </div>
            <button id="${tempEpisode?.id}_btn_episode" class="card-button">Episode info</button>
        </article>
        `
        mainSection.children[mainSection.children.length - 1].insertAdjacentHTML('beforeend', episodeCard);
        document.getElementById(`${tempEpisode?.id}_btn_episode`)?.addEventListener('click', showEpisodeInfo);
    });
    
}

async function showOrigin (e: MouseEvent) {
    try {
        const { mainSection } = elements;
        mainSection.innerHTML = '';
        const target = e.target as HTMLButtonElement;
        const originId = target.id.split('_')[0];
        const originUrl = target.getAttribute('url')!;
        const location = await getLocation(originUrl);
        console.log("🚀 ~ showOrigin ~ location:", location)
        const header = `
            <section class="character__info">
                <button id="toHomePage__btn" class="toHomePage__btn">Home</button>
                <h2> ${location.name} </h2>
                <h3> ${location.type} | ${location.dimension}</h3>
            </section>
        `;
        mainSection.insertAdjacentHTML('beforeend', header);
        document.getElementById('toHomePage__btn')?.addEventListener('click', showSeasons);
        const residentsSection = `<h2> Residents in ${location.name}: ${location.residents.length} </h2>
        <section class="card__container">
        </section>`
        mainSection.insertAdjacentHTML('beforeend', residentsSection);
        let characters = location.residents;
        characters.forEach( async (character) => {
            const info = await getCharacter(character);
            const characterCard = ` 
            <article class="card">
            <img src="${info.image}" title="${info.name} image">
            <div class="card-details">
                <p class="text-title">${info.name}</p>
                    <hr>
                    <p class="text-body">${info.status} | ${info.species}</p>
                </div>
                <button id="${info.id}_btn_character" class="card-button">Character info</button>
            </article>
            `;
            mainSection.children[mainSection.children.length - 1].insertAdjacentHTML('beforeend', characterCard);
            document.getElementById(`${info.id}_btn_character`)?.addEventListener('click', showCharacterInfo);
        });
    } catch (error) {
        throw new Error('error en showOrigin');
    }
}
