import { app } from '../server/server.js';

async function runTests() {
  const server = app.listen(5099, async () => {
    try {
      console.log('Testing Chat API endpoints on port 5099...\n');

      const testCases = [
        {
          name: 'Suggested Question 1: Termination condition',
          question: 'What is the termination condition?',
        },
        {
          name: 'Suggested Question 2: Payment obligations',
          question: 'What are my payment obligations?',
        },
        {
          name: 'Suggested Question 3: How long is this agreement?',
          question: 'How long is this agreement?',
        },
        {
          name: 'Suggested Question 4: Maintenance responsibilities',
          question: 'Who is responsible for maintenance?',
        },
        {
          name: 'Suggested Question 5: Penalties mentioned',
          question: 'Are there penalties mentioned?',
        },
        {
          name: 'Chat Example: Early termination',
          question: 'What happens if I terminate early?',
        },
        {
          name: 'Missing Information in Document',
          question: 'What is the pet policy for extraterrestrial animals?',
        },
      ];

      for (const tc of testCases) {
        console.log(`▶ Test: ${tc.name}`);
        console.log(`  Question: "${tc.question}"`);
        const res = await fetch('http://localhost:5099/api/documents/demo/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: tc.question }),
        });

        const data = await res.json();
        console.log(`  Status: ${res.status}`);
        console.log(`  Answer: "${data.answer}"`);
        console.log(`  Sources: ${JSON.stringify(data.sources, null, 2)}`);
        console.log('----------------------------------------------------');
      }

      console.log('All backend chat tests executed successfully!');
    } catch (err) {
      console.error('Test error:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTests();
