const axios = require('axios');
const DataSource = require('../../src/resources/dataSource');

jest.mock('axios');

describe('DataSource', () => {
  let dataSource;
  let mockClient;

  beforeEach(() => {
    mockClient = {
      post: jest.fn(),
      get: jest.fn(),
      delete: jest.fn()
    };
    dataSource = new DataSource(mockClient);
  });

  test('create calls client.post with correct arguments', async () => {
    const config = { name: 'test-source' };
    await dataSource.create(config);
    expect(mockClient.post).toHaveBeenCalledWith('/datasources', config);
  });

  test('all calls client.get with correct arguments', async () => {
    await dataSource.all();
    expect(mockClient.get).toHaveBeenCalledWith('/datasources');
  });

  test('find calls client.get with correct arguments', async () => {
    const name = 'test-source';
    await dataSource.find(name);
    expect(mockClient.get).toHaveBeenCalledWith(`/datasources/${name}`);
  });

  test('destroy calls client.delete with correct arguments', async () => {
    const name = 'test-source';
    await dataSource.destroy(name);
    expect(mockClient.delete).toHaveBeenCalledWith(`/datasources/${name}`);
  });
});