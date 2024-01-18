var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as type from './types/interfaces.js';
import { elements } from './domElements.js';
const RMUrl = 'https://rickandmortyapi.com/api/episode';
document.addEventListener('DOMContentLoaded', main);
function main() {
    const { header } = elements;
    header.addEventListener('click', showSeasons);
    setSidebar();
    showSeasons();
}
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
function getSeasons() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let episodes = yield getEpisodes();
            let seasons = [episodes[0].episode.split('S')[1].split('E')[0]];
            episodes.forEach((episode) => {
                if (!seasons.includes(episode.episode.split('S')[1].split('E')[0])) {
                    seasons.push(episode.episode.split('S')[1].split('E')[0]);
                }
            });
            return seasons;
        }
        catch (error) {
            throw new Error(`Something is wrong ${error}`);
        }
    });
}
function getEpisodes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let page = yield APIFetch(RMUrl);
            let episodes = page.results;
            while (page.info.next) {
                page = yield APIFetch(page.info.next);
                episodes.push(...page.results);
            }
            return episodes;
        }
        catch (error) {
            throw new Error(`Something is wrong ${error}`);
        }
    });
}
function cleanSection(element) {
    element.innerHTML = '';
}
function setSidebar() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { navUl } = elements;
            let episodes = yield getEpisodes();
            let seasons = yield getSeasons();
            seasons.forEach((season) => {
                const seasonNav = `
            <li class="accordion-item">
            <div class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne${season}" aria-expanded="false" aria-controls="flush-collapseOne">
                Season ${season}
                </button>
                </div>
                <ul id="flush-collapseOne${season}" class="overflow-y-scroll accordion-collapse collapse" data-bs-parent="#sidebarMenu">
                </ul>
            </li>
            `;
                navUl.insertAdjacentHTML('beforeend', seasonNav);
                episodes.forEach((episode) => {
                    var _a, _b;
                    if (episode.episode.split('S')[1].startsWith(season)) {
                        const episodeItem = ` 
                    <li><a id="${episode.id}_a_episode" class="accordion-body">${episode.episode}: ${episode.name}</a></li>
                    `;
                        (_a = document.getElementById(`flush-collapseOne${season}`)) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('beforeend', episodeItem);
                        (_b = document.getElementById(`${episode.id}_a_episode`)) === null || _b === void 0 ? void 0 : _b.addEventListener('click', showEpisodeInfo);
                    }
                });
            });
        }
        catch (error) {
            throw new Error(`Something is wrong ${error}`);
        }
    });
}
function showSeasons() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { mainSection } = elements;
            cleanSection(mainSection);
            const seasons = yield getSeasons();
            seasons.forEach((season) => {
                var _a;
                const seasonBtn = `<button id="main__btn${season}" class="episode__btn" season="${season}">Season ${season}</button>`;
                mainSection.insertAdjacentHTML('beforeend', seasonBtn);
                (_a = document.getElementById(`main__btn${season}`)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showEpisodes);
            });
        }
        catch (error) {
            throw new Error(`Something is wrong ${error}`);
        }
    });
}
function createCard(title, body, button, img) {
    const card = document.createElement('article');
    card.classList.add('myCard');
    if (typeof img !== 'undefined') {
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
function showEpisodes(e) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const target = e.target;
            const season = target.getAttribute('season');
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
                const episodeCard = createCard(`${episode.episode}: ${episode.name}`, `${episode.air_date}`, `${episode.id}_btn_episode`);
                mainSection.children[mainSection.children.length - 1].insertAdjacentElement('beforeend', episodeCard);
                (_a = document.getElementById(`${episode.id}_btn_episode`)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showEpisodeInfo);
            });
        }
        catch (error) {
            throw new Error(`Something is wrong ${error}`);
        }
    });
}
function showEpisodeInfo(e) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { mainSection } = elements;
            cleanSection(mainSection);
            const target = e.target;
            const episodeId = target.id.split('_')[0];
            const episode = (yield getEpisodes()).find((e) => e.id.toString() === episodeId);
            const season = episode === null || episode === void 0 ? void 0 : episode.episode.split('S')[1].split('E')[0];
            const header = `
            <button id="to__btn${season}" class="toHomePage__btn" season="${season}">Back season</button>
            <h2>${episode === null || episode === void 0 ? void 0 : episode.episode}: ${episode === null || episode === void 0 ? void 0 : episode.name} </h2>
            <p class="header__info">${episode === null || episode === void 0 ? void 0 : episode.air_date}</p>
            <section class="card__container"></section>
        `;
            const characters = episode === null || episode === void 0 ? void 0 : episode.characters;
            characters === null || characters === void 0 ? void 0 : characters.forEach((character) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                const characterData = yield APIFetch(character);
                characterData.status = characterData.status === 'unknown' ? characterData.status = type.Unknown.Status : characterData.status;
                const characterCard = createCard(`${characterData.name}`, `${characterData.status} | ${characterData.species}`, `${characterData.id}_btn_character`, [`${characterData.image}`, `${characterData.name} image`]);
                mainSection.children[mainSection.children.length - 1].insertAdjacentElement('beforeend', characterCard);
                (_b = document.getElementById(`${characterData.id}_btn_character`)) === null || _b === void 0 ? void 0 : _b.addEventListener('click', showCharacterInfo);
            }));
            mainSection.insertAdjacentHTML('beforeend', header);
            (_a = document.getElementById(`to__btn${season}`)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showEpisodes);
        }
        catch (error) {
            throw new Error(`Something is wrong ${error}`);
        }
    });
}
function showCharacterInfo(e) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { mainSection } = elements;
            mainSection.innerHTML = '';
            const target = e.target;
            const characterId = target.id.split('_')[0];
            const character = yield APIFetch(`https://rickandmortyapi.com/api/character/${characterId}`);
            character.origin.name = character.origin.name === 'unknown' ? type.Unknown.Origin : character.origin.name;
            character.status = character.status === 'unknown' ? type.Unknown.Status : character.status;
            character.gender = character.gender === 'unknown' ? type.Unknown.Gender : character.gender;
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
            (_a = document.getElementById('toHomePage__btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showSeasons);
            if (character.origin.name != type.Unknown.Origin) {
                (_b = document.getElementById(`${character.origin.name}_a`)) === null || _b === void 0 ? void 0 : _b.setAttribute('href', '#');
                (_c = document.getElementById(`${character.origin.name}_a`)) === null || _c === void 0 ? void 0 : _c.addEventListener('click', showOriginInfo);
            }
            const episodesSection = `<h2> Episodes where ${character.name} appears: ${character.episode.length} </h2>
        <section class="card__container">
        </section>`;
            mainSection.insertAdjacentHTML('beforeend', episodesSection);
            character.episode.forEach((episode) => __awaiter(this, void 0, void 0, function* () {
                var _d;
                const tempEpisode = (yield getEpisodes()).find((e) => e.url === episode);
                const episodeCard = createCard(`${tempEpisode === null || tempEpisode === void 0 ? void 0 : tempEpisode.episode}: ${tempEpisode === null || tempEpisode === void 0 ? void 0 : tempEpisode.name}`, `${tempEpisode === null || tempEpisode === void 0 ? void 0 : tempEpisode.air_date}`, `${tempEpisode === null || tempEpisode === void 0 ? void 0 : tempEpisode.id}_btn_episode`);
                mainSection.children[mainSection.children.length - 1].insertAdjacentElement('beforeend', episodeCard);
                (_d = document.getElementById(`${tempEpisode === null || tempEpisode === void 0 ? void 0 : tempEpisode.id}_btn_episode`)) === null || _d === void 0 ? void 0 : _d.addEventListener('click', showEpisodeInfo);
            }));
        }
        catch (error) {
            throw new Error(`Something is wrong ${error}`);
        }
    });
}
function showOriginInfo(e) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { mainSection } = elements;
            mainSection.innerHTML = '';
            const target = e.target;
            const originId = target.id.split('_')[0];
            const originUrl = target.getAttribute('url');
            let location = yield APIFetch(originUrl);
            location.dimension = location.dimension === 'unknown' ? type.Unknown.Dimension : location.dimension;
            const header = `
                <button id="toHomePage__btn" class="toHomePage__btn">Home</button>
                <h2> ${location.name} </h2>
                <p class="header__info"> ${location.type} | ${location.dimension}</p>
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
                const characterData = yield APIFetch(character);
                characterData.status = characterData.status === 'unknown' ? type.Unknown.Status : characterData.status;
                const characterCard = createCard(`${characterData.name}`, `${characterData.status} | ${characterData.species}`, `${characterData.id}_btn_character`, [`${characterData.image}`, `${characterData.name} image`]);
                mainSection.children[mainSection.children.length - 1].insertAdjacentElement('beforeend', characterCard);
                (_b = document.getElementById(`${characterData.id}_btn_character`)) === null || _b === void 0 ? void 0 : _b.addEventListener('click', showCharacterInfo);
            }));
        }
        catch (error) {
            throw new Error('error en showOriginInfo');
        }
    });
}
//# sourceMappingURL=script.js.map