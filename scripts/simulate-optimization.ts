const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockGetDoc = async (id: string) => {
  await delay(100); // simulate 100ms network latency
  return { id, data: () => ({ title: `Card ${id}` }), exists: () => true };
};

const sequentialFetch = async (ids: string[]) => {
  const start = Date.now();
  const results = [];
  for (const id of ids) {
    const doc = await mockGetDoc(id);
    if (doc.exists()) {
      results.push({ id: doc.id, ...doc.data() });
    }
  }
  const end = Date.now();
  return end - start;
};

const parallelFetch = async (ids: string[]) => {
  const start = Date.now();
  const results = await Promise.all(
    ids.map(async (id) => {
      const doc = await mockGetDoc(id);
      if (doc.exists()) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    })
  );
  const filteredResults = results.filter(r => r !== null);
  const end = Date.now();
  return end - start;
};

const runSimulation = async () => {
  const ids = Array.from({ length: 10 }, (_, i) => i.toString());
  console.log(`Simulating fetching ${ids.length} cards...`);

  const sequentialTime = await sequentialFetch(ids);
  console.log(`Sequential Fetch Time: ${sequentialTime}ms`);

  const parallelTime = await parallelFetch(ids);
  console.log(`Parallel Fetch Time: ${parallelTime}ms`);

  const improvement = ((sequentialTime - parallelTime) / sequentialTime) * 100;
  console.log(`Improvement: ${improvement.toFixed(2)}%`);
};

runSimulation();
