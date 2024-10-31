# MindsDB JavaScript SDK

This SDK provides an interface to interact with the MindsDB API. It allows you to create and manage "minds" (AI models) and data sources.

## Installation

```bash
npm install mindsdb_js_sdk
```

## Configuration

The SDK uses environment variables or constructor parameters for configuration:

```javascript
import MindsClient from 'mindsdb_js_sdk';

// Default configuration (uses MINDS_API_KEY env variable and staging URL)
const client = new MindsClient();

// Optional: Specify custom API key and base URL
const client = new MindsClient('your_api_key', 'https://mdb.ai');
```

## Managing Data Sources

### Creating a Data Source

```javascript
const datasourceConfig = {
  name: 'my_postgres_db',
  engine: 'postgres',
  description: 'My PostgreSQL database',
  connection_data: {
    host: 'localhost',
    port: 5432,
    database: 'mydb',
    user: 'user',
    password: 'password'
  },
  tables: ['table1', 'table2']
};

// Create a new datasource
try {
  const datasource = await client.datasources.create(datasourceConfig);
  console.log('Datasource created:', datasource);
} catch (error) {
  console.error('Error creating datasource:', error);
}

// Create or replace existing datasource
try {
  const datasource = await client.datasources.create(datasourceConfig, true);
  console.log('Datasource created/replaced:', datasource);
} catch (error) {
  console.error('Error creating/replacing datasource:', error);
}
```

### Listing Data Sources

```javascript
try {
  const datasources = await client.datasources.list();
  console.log('Available datasources:', datasources);
} catch (error) {
  console.error('Error listing datasources:', error);
}
```

### Getting a Data Source

```javascript
try {
  const datasource = await client.datasources.get('my_postgres_db');
  console.log('Datasource details:', datasource);
} catch (error) {
  console.error('Error getting datasource:', error);
}
```

### Deleting a Data Source

```javascript
try {
  await client.datasources.drop('my_postgres_db');
  console.log('Datasource deleted');
} catch (error) {
  console.error('Error deleting datasource:', error);
}
```

## Managing Minds

### Creating a Mind

```javascript
const mindConfig = {
  name: 'my_mind',
  model_name: 'gpt-4',
  provider: 'openai',
  prompt_template: 'Use your database tools to answer the user\'s question: {{question}}',
  datasources: ['my_postgres_db'],
  parameters: {
    // Additional model parameters
  }
};

try {
  const mind = await client.minds.create('my_mind', mindConfig);
  console.log('Mind created:', mind);
} catch (error) {
  console.error('Error creating mind:', error);
}
```

### Listing Minds

```javascript
try {
  const minds = await client.minds.list();
  console.log('Available minds:', minds);
} catch (error) {
  console.error('Error listing minds:', error);
}
```

### Getting a Mind

```javascript
try {
  const mind = await client.minds.get('my_mind');
  console.log('Mind details:', mind);
} catch (error) {
  console.error('Error getting mind:', error);
}
```

### Deleting a Mind

```javascript
try {
  await client.minds.drop('my_mind');
  console.log('Mind deleted');
} catch (error) {
  console.error('Error deleting mind:', error);
}
```

### Using a Mind for Completion

```javascript
try {
  // Synchronous completion
  const result = await mind.completion('Your query here');
  console.log('Completion result:', result);

  // Streaming completion
  await mind.completion('Your query here', true);
  // This will stream the result to stdout
} catch (error) {
  console.error('Error getting completion:', error);
}
```

## Error Handling

The SDK uses custom error classes for specific error scenarios:

- `ObjectNotFound`: Thrown when a requested resource doesn't exist
- `ObjectNotSupported`: Thrown for unsupported datasource types
- `Forbidden`: Thrown for permission-related issues
- `Unauthorized`: Thrown for authentication problems
- `UnknownError`: Thrown for unclassified errors

```javascript
import { ObjectNotFound, ObjectNotSupported } from 'mindsdb_js_sdk/exception';

try {
  const mind = await client.minds.get('non_existent_mind');
} catch (error) {
  if (error instanceof ObjectNotFound) {
    console.error('Mind not found');
  } else if (error instanceof ObjectNotSupported) {
    console.error('Unsupported operation');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Notes

- The default prompt template is: "Use your database tools to answer the user's question: {{question}}"
- The SDK uses OpenAI's client for completions
- The base project is always set to 'mindsdb'

## License

This project is licensed under the MIT License.