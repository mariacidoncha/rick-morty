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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { mainSection, sidebarMenu } = elements;
        let page = (yield APIFetch(RMUrl));
        let episodes = page.results;
        let seasons = [page.results[0].episode.split('E')[0]];
        while (page.info.next) {
            page = yield APIFetch(page.info.next);
            for (let i = 0; i < page.results.length; i++) {
                const episode = page.results[i];
                const thisSeason = episode.episode.split('E')[0];
                if (!seasons.includes(thisSeason)) {
                    seasons.push(thisSeason);
                }
            }
            episodes.push(...page.results);
        }
        seasons.forEach((season) => {
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
            episodes.forEach((episode) => {
                var _a;
                if (episode.episode.startsWith(season)) {
                    const episodeItem = ` 
                <a class="accordion-body">${episode.name}</a>
                `;
                    (_a = document.getElementById(`flush-collapseOne${season}`)) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('beforeend', episodeItem);
                }
            });
        });
    });
}
main();
function print() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (yield APIFetch(RMUrl)).results;
        console.log("🚀 ~ print ~ data:", data);
        let characters = [];
        for (let i = 0; i < data[0].characters.length; i++) {
            characters[i] = yield APIFetch(data[0].characters[i]);
        }
        console.log("🚀 ~ print ~ characters:", characters);
    });
}
//# sourceMappingURL=index.js.map