var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { elements } from './domElements.js';
const RMUrl = 'https://rickandmortyapi.com/api/episode';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        showSidebar();
        showSeasons();
    });
}
main();
function APIFetch(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            const JSONResponse = yield response.json();
            return JSONResponse;
        }
        catch (error) {
            throw new Error(`Something is wrong ${error}`);
        }
    });
}
function getEpisodes() {
    return __awaiter(this, void 0, void 0, function* () {
        let page = yield APIFetch(RMUrl);
        let episodes = page.results;
        while (page.info.next) {
            page = yield APIFetch(page.info.next);
            episodes.push(...page.results);
        }
        return episodes;
    });
}
function getSeasons() {
    return __awaiter(this, void 0, void 0, function* () {
        let episodes = yield getEpisodes();
        let seasons = [episodes[0].episode.split('E')[0]];
        episodes.forEach((episode) => {
            if (!seasons.includes(episode.episode.split('E')[0])) {
                seasons.push(episode.episode.split('E')[0]);
            }
        });
        return seasons;
    });
}
function getCharacter(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let page = yield APIFetch(url);
        return page;
    });
}
function getLocation(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let page = yield APIFetch(url);
        return page;
    });
}
function showSidebar() {
    return __awaiter(this, void 0, void 0, function* () {
        const { sidebarMenu } = elements;
        let episodes = yield getEpisodes();
        let seasons = yield getSeasons();
        seasons.forEach((season) => {
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
            episodes.forEach((episode) => {
                var _a, _b;
                if (episode.episode.startsWith(season)) {
                    const episodeItem = ` 
                <a id="${episode.id}_a_episode" class="accordion-body">${episode.episode}: ${episode.name}</a>
                `;
                    (_a = document.getElementById(`flush-collapseOne${season}`)) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('beforeend', episodeItem);
                    (_b = document.getElementById(`${episode.id}_a_episode`)) === null || _b === void 0 ? void 0 : _b.addEventListener('click', showEpisodeInfo);
                }
            });
        });
    });
}
function showSeasons() {
    return __awaiter(this, void 0, void 0, function* () {
        const { mainSection } = elements;
        mainSection.innerHTML = '';
        const seasons = yield getSeasons();
        seasons.forEach((season) => {
            var _a;
            const seasonBtn = `<button id="main__btn${season}" class="episode__btn">Season ${season}</button>`;
            mainSection.insertAdjacentHTML('beforeend', seasonBtn);
            (_a = document.getElementById(`main__btn${season}`)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showEpisodes);
        });
    });
}
function showEpisodes(e) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const target = e.target;
        const season = target.id.split('S')[1];
        const episodes = (yield getEpisodes()).filter((episode) => {
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
        (_a = document.getElementById('toHomePage__btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showSeasons);
        episodes.forEach((episode) => {
            var _a;
            const episodeCard = ` 
        <article class="card">
            <div class="card-details">
                <p class="text-title">${episode.episode}: ${episode.name}</p>
                <hr>
                <p class="text-body">${episode.air_date}</p>
            </div>
            <button id="${episode.id}_btn_episode" class="card-button">Episode info</button>
        </article>
        `;
            mainSection.children[mainSection.children.length - 1].insertAdjacentHTML('beforeend', episodeCard);
            (_a = document.getElementById(`${episode.id}_btn_episode`)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showEpisodeInfo);
        });
    });
}
function showEpisodeInfo(e) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { mainSection } = elements;
        mainSection.innerHTML = '';
        const target = e.target;
        const episodeId = target.id.split('_')[0];
        const episode = (yield getEpisodes()).find((e) => e.id.toString() === episodeId);
        const season = episode === null || episode === void 0 ? void 0 : episode.episode.split('E')[0];
        const header = `
        <button id="to__btn${season}" class="toHomePage__btn">Back season</button>
        <h2>${episode === null || episode === void 0 ? void 0 : episode.episode}: ${episode === null || episode === void 0 ? void 0 : episode.name} </h2>
        <h3>${episode === null || episode === void 0 ? void 0 : episode.air_date}</h3>
        <section class="card__container"></section>
    `;
        const characters = episode === null || episode === void 0 ? void 0 : episode.characters;
        characters === null || characters === void 0 ? void 0 : characters.forEach((character) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const info = yield getCharacter(character);
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
            (_b = document.getElementById(`${info.id}_btn_character`)) === null || _b === void 0 ? void 0 : _b.addEventListener('click', showCharacterInfo);
        }));
        mainSection.insertAdjacentHTML('beforeend', header);
        (_a = document.getElementById(`to__btn${season}`)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showEpisodes);
    });
}
function showCharacterInfo(e) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const { mainSection } = elements;
        mainSection.innerHTML = '';
        const target = e.target;
        const characterId = target.id.split('_')[0];
        const character = yield getCharacter(`https://rickandmortyapi.com/api/character/${characterId}`);
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
        (_a = document.getElementById('toHomePage__btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showSeasons);
        if (character.origin.name != 'unknown') {
            (_b = document.getElementById(`${character.origin.name}_a`)) === null || _b === void 0 ? void 0 : _b.addEventListener('click', showOrigin);
        }
        const episodesSection = `<h2> Episodes where ${character.name} appears: ${character.episode.length} </h2>
    <section class="card__container">
    </section>`;
        mainSection.insertAdjacentHTML('beforeend', episodesSection);
        character.episode.forEach((episode) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const tempEpisode = (yield getEpisodes()).find((e) => e.url === episode);
            const episodeCard = `
        <article class="card">
            <div class="card-details">
                <p class="text-title">${tempEpisode === null || tempEpisode === void 0 ? void 0 : tempEpisode.episode}: ${tempEpisode === null || tempEpisode === void 0 ? void 0 : tempEpisode.name}</p>
                <hr>
                <p class="text-body">${tempEpisode === null || tempEpisode === void 0 ? void 0 : tempEpisode.air_date}</p>
            </div>
            <button id="${tempEpisode === null || tempEpisode === void 0 ? void 0 : tempEpisode.id}_btn_episode" class="card-button">Episode info</button>
        </article>
        `;
            mainSection.children[mainSection.children.length - 1].insertAdjacentHTML('beforeend', episodeCard);
            (_c = document.getElementById(`${tempEpisode === null || tempEpisode === void 0 ? void 0 : tempEpisode.id}_btn_episode`)) === null || _c === void 0 ? void 0 : _c.addEventListener('click', showEpisodeInfo);
        }));
    });
}
function showOrigin(e) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { mainSection } = elements;
            mainSection.innerHTML = '';
            const target = e.target;
            const originId = target.id.split('_')[0];
            const originUrl = target.getAttribute('url');
            const location = yield getLocation(originUrl);
            console.log("🚀 ~ showOrigin ~ location:", location);
            const header = `
            <section class="character__info">
                <button id="toHomePage__btn" class="toHomePage__btn">Home</button>
                <h2> ${location.name} </h2>
                <h3> ${location.type} | ${location.dimension}</h3>
            </section>
        `;
            mainSection.insertAdjacentHTML('beforeend', header);
            (_a = document.getElementById('toHomePage__btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showSeasons);
            const residentsSection = `<h2> Residents in ${location.name}: ${location.residents.length} </h2>
        <section class="card__container">
        </section>`;
            mainSection.insertAdjacentHTML('beforeend', residentsSection);
            let characters = location.residents;
            characters.forEach((character) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                const info = yield getCharacter(character);
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
                (_b = document.getElementById(`${info.id}_btn_character`)) === null || _b === void 0 ? void 0 : _b.addEventListener('click', showCharacterInfo);
            }));
        }
        catch (error) {
            throw new Error('error en showOrigin');
        }
    });
}
//# sourceMappingURL=script.js.map