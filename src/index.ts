import * as type from './types';

console.log('Hello world');

const RMUrl = 'https://rickandmortyapi.com/api/episode';

async function APIFetch<T>(url : string): Promise<T> {
    try {
        const response = await fetch(url);
        const JSONResponse = await response.json().then((r) => r);
        return JSONResponse;
    } catch (error) {
        throw new Error(`Something is wrong ${error}`);
    }
}

async function print() {
    const data = await APIFetch<type.API>(RMUrl);
    console.log("🚀 ~ print ~ data:", data);
    const nextData = await APIFetch<type.API>(data.info.next);
    console.log("🚀 ~ print ~ nextData:", nextData)
}

print();
