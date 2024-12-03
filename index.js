const countWarmupRequests = 0;

const countRequests = 5000;
const concurrentRequests = 500;

// const endpoint = '';
let endpoint = '';
let responseTimes = [];

let api = "";
let args = process.argv.slice(2);

if (args.length > 0) {
  api = args[0];
  endpoint = args[1];
}


async function job () {
  const pLimit = await import('p-limit');

  const warmupLimit = pLimit.default(100);
  const warmupPromises = Array(countWarmupRequests).fill(0).map((data, index) => {
    return warmupLimit(async () => {
      const response = await fetch(api + endpoint + '?warmup=' + index);
      return response.text();
    });
  });
  await Promise.all(warmupPromises);

  const limit = pLimit.default(concurrentRequests);

  const promises = Array(countRequests).fill(0).map((data, index) => {
    return limit(async () => {
      const start = performance.now();
      const response = await fetch(api + endpoint + '?index=' + index);
      const data = response.text();
      const len = performance.now() - start;
      console.info(`Request #${index} took ${len}ms`);
      responseTimes.push(len);
      return data;
    });
  });

  const start = performance.now();
  const res = await Promise.allSettled(promises);
  console.info(`All requests took ${performance.now() - start}ms`);
  let totalLen = 0;
  responseTimes.forEach(r => totalLen += r);

  console.info(`totalLen: ${totalLen} / avg: ${totalLen / responseTimes.length} / median: ${median(responseTimes)}`);
}

function median (numbers) {
  const sorted = Array.from(numbers).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

job().then(() => {
  console.info('Done');
}).catch((err) => {
  console.error(err)
});

// const countRequests = 5000;
// const concurrentRequests = 500;

// 4 GB RAM | 2 vCPUs | 250 GB bandwidth
// sleep, CPU < 10 %
// avg: 285 ms / median: 78 ms
// io, CPU < 10 %
// avg: 559 ms / median: 129 ms

//512 MB RAM | 1 vCPU | 50 GB bandwidth
// sleep, CPU < 10 %
// avg: 396 ms / median: 122 ms
// io, CPU < 10 %
// avg: 1033 ms / median: 168 ms
