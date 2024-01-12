console.log('Hello world');
const RMUrl = 'https://rickandmortyapi.com/api/episode';
async function APIFetch(url) {
    try {
        const response = await fetch(url);
        const JSONResponse = await response.json().then((r) => r);
        return JSONResponse;
    }
    catch (error) {
        throw new Error(`Something is wrong ${error}`);
    }
}
async function print() {
    const data = await APIFetch(RMUrl);
    console.log("🚀 ~ print ~ data:", data);
    const nextData = await APIFetch(data.info.next);
    console.log("🚀 ~ print ~ nextData:", nextData);
}
print();
export {};
//# sourceMappingURL=index.js.map