import { MindsClient } from 'minds_js_sdk';
import readline from 'readline';

const client = new MindsClient('mdb_24cLWXfmr1S4e7r0pqkKt3mRqNfHFK6Fn3Em6qJwNIim');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chatWithAgent() {
  const postgres_config = {
    name: 'my_datasource',
    description: 'Sample data for Generic queries',
    engine: 'postgres',
    connection_data: {
      user: 'demo_user',
      password: 'demo_password',
      host: 'samples.mindsdb.com',
      port: 5432,
      database: 'demo',
      schema: 'demo_data',
    },
  };

  try {
    const mind = await client.minds.get('test_mind');
    
    const askQuestion = () => {
      rl.question('You: ', async (question) => {
        try {
          const response = await mind.completion(question, true);
          console.log('Agent:', response);
          askQuestion(); // Ask the next question
        } catch (error) {
          console.error('Error:', error);
          rl.close();
        }
      });
    };

    askQuestion(); // Start the chat
  } catch (error) {
    console.error(error);
  }
}

chatWithAgent();