import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Client from './client';
import { ObjectNotFound, ObjectNotSupported } from './exception';

describe('Datasources', () => {
  let client;
  let mock;

  beforeEach(() => {
    client = new Client('test-api-key', 'https://staging.mdb.ai');
    mock = new MockAdapter(client.api);
  });

  afterEach(() => {
    mock.reset();
  });

  const sampleDatasource = {
    name: 'test-db',
    engine: 'postgres',
    description: 'Test database',
    connection_data: {
      host: 'localhost',
      port: 5432
    }
  };

  describe('create', () => {
    test('should create a new datasource', async () => {
      mock.onPost('/api/datasources').reply(200, sampleDatasource);
      mock.onGet('/api/datasources/test-db?check_connection=true').reply(200, sampleDatasource);

      const result = await client.datasources.create(sampleDatasource);
      expect(result).toEqual(sampleDatasource);
    });

    test('should replace existing datasource when replace=true', async () => {
      mock.onGet('/api/datasources/test-db?check_connection=true').reply(200, sampleDatasource);
      mock.onDelete('/api/datasources/test-db').reply(200, {});
      mock.onPost('/api/datasources').reply(200, sampleDatasource);

      const result = await client.datasources.create(sampleDatasource, true);
      expect(result).toEqual(sampleDatasource);
    });
  });

  describe('get', () => {
    test('should get datasource details', async () => {
      mock.onGet('/api/datasources/test-db?check_connection=true').reply(200, sampleDatasource);

      const result = await client.datasources.get('test-db');
      expect(result).toEqual(sampleDatasource);
    });

    test('should throw ObjectNotSupported for invalid datasource type', async () => {
      mock.onGet('/api/datasources/test-db?check_connection=true').reply(200, { name: 'test-db' });

      await expect(client.datasources.get('test-db')).rejects.toThrow(ObjectNotSupported);
    });
  });

  describe('list', () => {
    test('should list all valid datasources', async () => {
      const datasources = [sampleDatasource, { name: 'invalid-ds' }];
      mock.onGet('/api/datasources').reply(200, datasources);

      const result = await client.datasources.list();
      expect(result).toEqual([sampleDatasource]);
    });
  });

  describe('drop', () => {
    test('should delete a datasource', async () => {
      mock.onDelete('/api/datasources/test-db').reply(200, { success: true });

      const result = await client.datasources.drop('test-db');
      expect(result).toEqual({ success: true });
    });
  });
});