const axios = require('axios');
const Mind = require('../../src/resources/mind');

jest.mock('axios');

describe('Mind', () => {
  let mind;
  let mockClient;

  beforeEach(() => {
    mockClient = {
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };
    mind = new Mind(mockClient);
  });

  test('create calls client.post with correct arguments', async () => {
    const config = { name: 'test-mind', datasources: [] };
    await mind.create(config);
    expect(mockClient.post).toHaveBeenCalledWith('/minds', config);
  });

  test('all calls client.get with correct arguments', async () => {
    await mind.all();
    expect(mockClient.get).toHaveBeenCalledWith('/minds');
  });

  test('find calls client.get with correct arguments', async () => {
    const name = 'test-mind';
    await mind.find(name);
    expect(mockClient.get).toHaveBeenCalledWith(`/minds/${name}`);
  });

  test('destroy calls client.delete with correct arguments', async () => {
    const name = 'test-mind';
    await mind.destroy(name);
    expect(mockClient.delete).toHaveBeenCalledWith(`/minds/${name}`);
  });

  test('update calls client.put with correct arguments', async () => {
    const name = 'test-mind';
    const data = { description: 'Updated description' };
    await mind.update(name, data);
    expect(mockClient.put).toHaveBeenCalledWith(`/minds/${name}`, data);
  });

  test('completion calls client.post with correct arguments', async () => {
    const config = { name: 'test-mind', message: 'Hello, how are you?', stream: false };
    await mind.completion(config);
    expect(mockClient.post).toHaveBeenCalledWith(`/minds/${config.name}/chat`, { message: config.message, stream: config.stream });
  });
});