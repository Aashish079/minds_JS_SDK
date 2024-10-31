import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Client from './client';
import { Datasources } from './datasources';
import { Minds } from './minds';

describe('Client', () => {
  let client;
  let mock;

  beforeEach(() => {
    // Create a new instance of axios-mock-adapter
    mock = new MockAdapter(axios);
    
    // Create a new client instance before each test
    client = new Client('test-api-key', 'https://staging.mdb.ai');
  });

  afterEach(() => {
    // Reset mock after each test
    mock.reset();
  });

  test('should initialize with default values', () => {
    process.env.MINDS_API_KEY = 'default-api-key';
    const defaultClient = new Client();
    
    expect(defaultClient.apiKey).toBe('default-api-key');
    expect(defaultClient.baseUrl).toBe('https://staging.mdb.ai');
  });

  test('should initialize with custom values', () => {
    expect(client.apiKey).toBe('test-api-key');
    expect(client.baseUrl).toBe('https://staging.mdb.ai');
  });

  test('should create axios instance with correct config', () => {
    expect(client.api.defaults.baseURL).toBe('https://staging.mdb.ai');
    expect(client.api.defaults.headers.Authorization).toBe('Bearer test-api-key');
  });

  test('should initialize datasources instance', () => {
    expect(client.datasources).toBeInstanceOf(Datasources);
  });

  test('should initialize minds instance', () => {
    expect(client.minds).toBeInstanceOf(Minds);
  });
});