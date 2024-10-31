import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Client from './client';
import { Mind, Minds } from './minds';

describe('Minds', () => {
  let client;
  let mock;

  beforeEach(() => {
    client = new Client('test-api-key', 'https://test.mdb.ai');
    mock = new MockAdapter(client.api);
  });

  afterEach(() => {
    mock.reset();
  });

  const sampleMind = {
    name: 'test-mind',
    model_name: 'gpt-4',
    provider: 'openai',
    parameters: {
      prompt_template: 'Test template: {{question}}'
    },
    datasources: ['test-db'],
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  };

  describe('create', () => {
    test('should create a new mind', async () => {
      mock.onPost('/api/projects/mindsdb/minds').reply(200, sampleMind);
      mock.onGet('api/projects/mindsdb/minds/test-mind').reply(200, sampleMind);

      const result = await client.minds.create('test-mind', {
        model_name: 'gpt-4',
        provider: 'openai',
        prompt_template: 'Test template: {{question}}',
        datasources: ['test-db']
      });

      expect(result).toBeInstanceOf(Mind);
      expect(result.name).toBe('test-mind');
    });

    test('should replace existing mind when replace=true', async () => {
      mock.onGet('api/projects/mindsdb/minds/test-mind').reply(200, sampleMind);
      mock.onDelete('/api/projects/mindsdb/minds/test-mind').reply(200, {});
      mock.onPost('/api/projects/mindsdb/minds').reply(200, sampleMind);

      const result = await client.minds.create('test-mind', {
        model_name: 'gpt-4',
        replace: true
      });

      expect(result).toBeInstanceOf(Mind);
    });
  });

  describe('list', () => {
    test('should list all minds', async () => {
      mock.onGet('/api/projects/mindsdb/minds').reply(200, [sampleMind]);

      const result = await client.minds.list();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Mind);
      expect(result[0].name).toBe('test-mind');
    });
  });

  describe('get', () => {
    test('should get mind details', async () => {
      mock.onGet('api/projects/mindsdb/minds/test-mind').reply(200, sampleMind);

      const result = await client.minds.get('test-mind');
      expect(result).toBeInstanceOf(Mind);
      expect(result.name).toBe('test-mind');
    });
  });

  describe('drop', () => {
    test('should delete a mind', async () => {
      mock.onDelete('/api/projects/mindsdb/minds/test-mind').reply(200, { success: true });

      const result = await client.minds.drop('test-mind');
      expect(result).toEqual({ success: true });
    });
  });
});

describe('Mind', () => {
  let client;
  let mind;
  let mock;

  beforeEach(() => {
    client = new Client('test-api-key', 'https://test.mdb.ai');
    mind = new Mind(
      client,
      'test-mind',
      'gpt-4',
      'openai',
      { prompt_template: 'Test template' },
      ['test-db']
    );
    mock = new MockAdapter(client.api);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('update', () => {
    test('should update mind properties', async () => {
      mock.onPatch('/projects/mindsdb/minds/test-mind').reply(200, {});

      await mind.update(
        'new-name',
        'gpt-4-turbo',
        'openai-new',
        'New template',
        ['new-db'],
        { new_param: 'value' }
      );

      expect(mind.name).toBe('new-name');
    });
  });

  describe('completion', () => {
    test('should get completion response', async () => {
      const response = {
        choices: [{
          message: {
            content: 'Test response'
          }
        }]
      };

      mock.onPost('/chat/completions').reply(200, response);

      const result = await mind.completion('Test question');
      expect(result).toBe('Test response');
    });
  });

  describe('add_datasource', () => {
    test('should add datasource to mind', async () => {
      const updatedMind = { ...mind, datasources: [...mind.datasources, 'new-db'] };
      
      mock.onPost('/projects/mindsdb/minds/test-mind/datasources').reply(200, {});
      mock.onGet('api/projects/mindsdb/minds/test-mind').reply(200, updatedMind);

      await mind.add_datasource('new-db');
      expect(mind.datasources).toContain('new-db');
    });
  });

  describe('del_datasource', () => {
    test('should remove datasource from mind', async () => {
      const updatedMind = { ...mind, datasources: [] };
      
      mock.onDelete('/projects/mindsdb/minds/test-mind/datasources/test-db').reply(200, {});
      mock.onGet('api/projects/mindsdb/minds/test-mind').reply(200, updatedMind);

      await mind.del_datasource('test-db');
      expect(mind.datasources).toHaveLength(0);
    });
  });
});