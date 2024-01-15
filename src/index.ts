import * as type from './types/types';
import {elements} from './domElements.js'

const RMUrl = 'https://rickandmortyapi.com/api/episode';

async function APIFetch<T>(url : string): Promise<T> {
    try {
        const response = await fetch(url);
        const JSONResponse = await response.json();
        return JSONResponse;
    } catch (error) {
        throw new Error(`Something is wrong ${error}`);
    }
}
/*card para los episodios*/
// const el = `
// <div class="card">
//     <img src="" class="card-img-top" alt="...">
//     <div class="card-body">
//         <h5 class="card-title">Card title</h5>
//         <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//         <a href="#" class="btn btn-primary">Go somewhere</a>
//     </div>
// </div>
// `;

async function main() {
    const { mainSection, sidebarMenu } = elements;
    let page = (await APIFetch<type.API>(RMUrl));
    let episodes = page.results;
    let seasons: string[] = [page.results[0].episode.split('E')[0]];

    while(page.info.next){
        page = await APIFetch<type.API>(page.info.next);
        for(let i = 0; i < page.results.length; i++) {
            const episode = page.results[i];
            const thisSeason = episode.episode.split('E')[0];
            if(!seasons.includes(thisSeason)){
                seasons.push(thisSeason);
            }
        }
        episodes.push(...page.results);
    }
    
    seasons.forEach( (season) => {
        const seasonBtn = `<button id="main__btn${season}" class="episode__btn">Season ${season}</button>`;
        mainSection.insertAdjacentHTML('beforeend', seasonBtn);
        const seasonNav = `
        <div class="accordion-item">
        <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne${season}" aria-expanded="false" aria-controls="flush-collapseOne">
        Season ${season}
        </button>
        </h2>
        <div id="flush-collapseOne${season}" class="accordion-collapse collapse" data-bs-parent="#sidebarMenu">
        
        </div>
        </div>
        `;
        sidebarMenu.insertAdjacentHTML('beforeend', seasonNav);
        episodes.forEach( (episode) => {
            if(episode.episode.startsWith(season)){
                const episodeItem = ` 
                <a class="accordion-body">${episode.name}</a>
                `;
                document.getElementById(`flush-collapseOne${season}`)?.insertAdjacentHTML('beforeend',episodeItem);
            }
        });
    });
    
}

main();

async function print() {
    const data = (await APIFetch<type.API>(RMUrl)).results;
    console.log("🚀 ~ print ~ data:", data);
    let characters: type.Character[] = [];
    for(let i = 0; i < data[0].characters.length; i++) {
        characters[i] = await APIFetch<type.Character>(data[0].characters[i]);
    }
    console.log("🚀 ~ print ~ characters:", characters)
    // const nextData = await APIFetch<type.API>(data.info.next);
    // console.log("🚀 ~ print ~ nextData:", nextData)
}
