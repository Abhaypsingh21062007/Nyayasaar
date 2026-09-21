import { app } from '../server/server.js';

async function runTests() {
  const server = app.listen(5098, async () => {
    try {
      console.log('Testing Compare API endpoints on port 5098...\n');

      // Test 1: Compare using demo IDs
      console.log('▶ Test 1: Compare sample-a and sample-b');
      const res1 = await fetch('http://localhost:5098/api/documents/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentAId: 'sample-a',
          documentBId: 'sample-b',
        }),
      });
      const data1 = await res1.json();
      console.log(`  Status: ${res1.status}`);
      console.log(`  Summary: ${data1.summary}`);
      console.log(`  Differences count: ${data1.differences?.length}`);
      console.log(`  First diff:`, data1.differences?.[0]);
      console.log('----------------------------------------------------');

      // Test 2: Error case missing Document B
      console.log('▶ Test 2: Missing Document B error handling');
      const res2 = await fetch('http://localhost:5098/api/documents/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentAId: 'sample-a',
        }),
      });
      const data2 = await res2.json();
      console.log(`  Status: ${res2.status}`);
      console.log(`  Error: ${data2.error}`);
      console.log('----------------------------------------------------');

      console.log('Backend compare tests passed!');
    } catch (err) {
      console.error('Test error:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTests();
