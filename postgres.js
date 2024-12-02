const endpoint = 'postgres';
const concurrency = 200;

// const api = 'https://shark-app-edhvp.ondigitalocean.app/'; // DigitalOcean professional-xs
const api = 'https://dolphin-app-hmkn4.ondigitalocean.app/'; // DigitalOcean professional-m
// const api = 'http://157.90.19.212:8080/'; // hetzner CX21
// const api = 'http://localhost:8080/'; // localhost if you run node-server/index.js

async function job () {
    const start = performance.now();
    const response = await fetch(api + endpoint + '?concurrency=' + concurrency);
    const data = response.text();
    console.info(`Request took ${performance.now() - start}ms`);
}

job().then(() => {
  console.info('Done');
}).catch((err) => {
  console.error(err)
});
