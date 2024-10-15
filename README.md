# Minds JavaScript SDK

This SDK provides an interface to interact with the Minds AI system API. It allows you to create and manage "minds" (artificial intelligences), create chat completions, and manage data sources.

## Installation

To install the SDK, use npm:

```bash
npm install minds-js-sdk
```

## Getting Started

### Initialize the Client

To get started, you'll need to initialize the Client with your API key. If you're using a different server, you can also specify a custom base URL.

```javascript
const MindsClient = require('minds-js-sdk');

// Default connection to Minds Cloud that uses 'https://mdb.ai' as the base URL
const client = new MindsClient("YOUR_API_KEY");

// If you have a self-hosted Minds Cloud instance, use your custom base URL
const baseUrl = 'https://<custom_cloud>.mdb.ai/';
const customClient = new MindsClient("YOUR_API_KEY", baseUrl);
```

### Creating a Data Source

You can connect to various databases, such as PostgreSQL, by configuring your data source. Use the `DatabaseConfig` to define the connection details for your data source.

```javascript
const { DatabaseConfig } = require('minds-js-sdk');

const postgresConfig = new DatabaseConfig({
    name: 'my_datasource',
    description: '<DESCRIPTION-OF-YOUR-DATA>',
    engine: 'postgres',
    connectionData: {
        user: 'demo_user',
        password: 'demo_password',
        host: 'samples.mindsdb.com',
        port: 5432,
        database: 'demo',
        schema: 'demo_data'
    },
    tables: ['<TABLE-1>', '<TABLE-2>']
});
```

### Creating a Mind

You can create a `mind` and associate it with a data source.

```javascript
// Create a mind with a data source
client.minds.create({ name: 'mind_name', datasources: [postgresConfig] })
    .then(mind => console.log('Mind created:', mind))
    .catch(error => console.error('Error creating mind:', error));

// Alternatively, create a data source separately and add it to a mind later
client.datasources.create(postgresConfig)
    .then(datasource => client.minds.create({ name: 'mind_name', datasources: [datasource] }))
    .then(mind => console.log('Mind created:', mind))
    .catch(error => console.error('Error:', error));
```

You can also add a data source to an existing mind:

```javascript
// Create a mind without a data source
client.minds.create({ name: 'mind_name' })
    .then(mind => {
        // Add a data source to the mind
        return mind.addDatasource(postgresConfig);  // Using the config
        // or
        // return mind.addDatasource(datasource);  // Using the data source object
    })
    .then(updatedMind => console.log('Updated mind:', updatedMind))
    .catch(error => console.error('Error:', error));
```

## Managing Minds

You can create a mind or replace an existing one with the same name.

```javascript
client.minds.create({ name: 'mind_name', replace: true, datasources: [postgresConfig] })
    .then(mind => console.log('Mind created or replaced:', mind))
    .catch(error => console.error('Error:', error));
```

To update a mind, specify the new name and data sources. The provided data sources will replace the existing ones.

```javascript
client.minds.update('mind_name', {
    name: 'new_mind_name',
    datasources: [postgresConfig]
})
.then(mind => console.log('Mind updated:', mind))
.catch(error => console.error('Error updating mind:', error));
```

### List Minds

You can list all the minds you've created.

```javascript
client.minds.list()
    .then(minds => console.log('All minds:', minds))
    .catch(error => console.error('Error listing minds:', error));
```

### Get a Mind by Name

You can fetch details of a mind by its name.

```javascript
client.minds.get('mind_name')
    .then(mind => console.log('Mind details:', mind))
    .catch(error => console.error('Error getting mind:', error));
```

### Remove a Mind

To delete a mind, use the following command:

```javascript
client.minds.drop('mind_name')
    .then(() => console.log('Mind deleted successfully'))
    .catch(error => console.error('Error deleting mind:', error));
```

## Managing Data Sources

To view all data sources:

```javascript
client.datasources.list()
    .then(datasources => console.log('All data sources:', datasources))
    .catch(error => console.error('Error listing data sources:', error));
```

### Get a Data Source by Name

You can fetch details of a specific data source by its name.

```javascript
client.datasources.get('my_datasource')
    .then(datasource => console.log('Data source details:', datasource))
    .catch(error => console.error('Error getting data source:', error));
```

### Remove a Data Source

To delete a data source, use the following command:

```javascript
client.datasources.drop('my_datasource')
    .then(() => console.log('Data source deleted successfully'))
    .catch(error => console.error('Error deleting data source:', error));
```

> Note: The SDK currently does not support automatically removing a data source if it is no longer connected to any mind.

## Chat Completion

You can use a mind to generate chat completions:

```javascript
client.minds.get('mind_name')
    .then(mind => mind.completion({ message: "Hello, how are you?" }))
    .then(response => console.log('Chat response:', response))
    .catch(error => console.error('Error in chat completion:', error));

// For streaming responses
client.minds.get('mind_name')
    .then(mind => mind.completion({ message: "Tell me a story", stream: true }))
    .then(stream => {
        stream.on('data', (chunk) => console.log(chunk.toString()));
        stream.on('end', () => console.log('Stream ended'));
    })
    .catch(error => console.error('Error in streaming chat completion:', error));
```

## Error Handling

The SDK uses Promise-based error handling. You can catch errors using `.catch()` blocks or try/catch with async/await syntax.

```javascript
try {
    const mind = await client.minds.create({ name: 'mind_name', datasources: [postgresConfig] });
    console.log('Mind created:', mind);
} catch (error) {
    console.error('Error creating mind:', error.message);
}
```

## Contributing

We welcome contributions to the Minds JavaScript SDK! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.