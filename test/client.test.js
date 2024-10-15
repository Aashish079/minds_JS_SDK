const MindsClient = require('../src/client');

describe('MindsClient', () => {
    test('constructor sets apiKey and baseURL', () => {
      const client = new MindsClient('test-api-key', 'https://test.mdb.ai');
      expect(client.apiKey).toBe('test-api-key');
      expect(client.baseURL).toBe('https://test.mdb.ai');
    });
  
    test('configure sets global config', () => {
      MindsClient.configure({ apiKey: 'global-api-key', baseURL: 'https://global.mdb.ai' });
      const client = new MindsClient();
      expect(client.apiKey).toBe('global-api-key');
      expect(client.baseURL).toBe('https://global.mdb.ai');
    });
  });
  