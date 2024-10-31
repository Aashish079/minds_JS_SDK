# MindsDB JavaScript SDK

This SDK provides an interface to interact with the MindsDB API. It allows you to create and manage "minds" (AI models) and data sources.

## Installation

```bash
npm install mindsdb_js_sdk
```

## Configuration

The SDK uses environment variables for configuration. Create a `.env` file in your project root:

```env
MINDS_API_KEY=your_api_key_here
```

## Getting Started

### Initialize the Client

```javascript
const { MindsClient } = require("mindsdb_js_sdk");

// Default connection using https://mdb.ai
const client = new MindsClient();

// Or specify custom configuration
MindsClient.configure({
  apiKey: "YOUR_API_KEY",
  baseURL: "https://mdb.ai/api",
});
const client = new MindsClient();
```

## Managing Data Sources

The SDK supports creating and managing data sources for different database engines.

### Creating a Data Source

```javascript
const datasourceConfig = {
  name: "my_postgres_db",
  engine: "postgres",
  description: "My PostgreSQL database",
  connectionData: {
    host: "localhost",
    port: 5432,
    database: "mydb",
    user: "user",
    password: "password",
  },
  tables: ["table1", "table2"],
};

// Create a new data source
client.dataSource
  .create(datasourceConfig)
  .then((datasource) => console.log("Data source created:", datasource))
  .catch((error) => console.error("Error:", error));

// Create or replace existing data source
client.dataSource
  .create(datasourceConfig, true)
  .then((datasource) =>
    console.log("Data source created/replaced:", datasource)
  )
  .catch((error) => console.error("Error:", error));
```

### Listing Data Sources

```javascript
client.dataSource
  .list()
  .then((datasources) => console.log("Available data sources:", datasources))
  .catch((error) => console.error("Error:", error));
```

### Getting a Data Source

```javascript
client.dataSource
  .get("my_postgres_db")
  .then((datasource) => console.log("Data source details:", datasource))
  .catch((error) => console.error("Error:", error));
```

### Deleting a Data Source

```javascript
client.dataSource
  .drop("my_postgres_db")
  .then(() => console.log("Data source deleted"))
  .catch((error) => console.error("Error:", error));
```

## Managing Minds

The SDK allows you to create and manage AI models called "minds".

### Creating a Mind

```javascript
const mindConfig = {
  name: "my_mind",
  modelName: "gpt-4",
  provider: "openai",
  parameters: {
    promptTemplate: "Your prompt template here",
  },
  datasources: ["my_postgres_db"],
};

// Create a new mind
client.minds
  .create(mindConfig.name, mindConfig)
  .then((mind) => console.log("Mind created:", mind))
  .catch((error) => console.error("Error:", error));

// Create or replace existing mind
client.minds
  .create(mindConfig.name, mindConfig, true)
  .then((mind) => console.log("Mind created/replaced:", mind))
  .catch((error) => console.error("Error:", error));
```

### Listing Minds

```javascript
client.minds
  .list()
  .then((minds) => console.log("Available minds:", minds))
  .catch((error) => console.error("Error:", error));
```

### Getting a Mind

```javascript
client.minds
  .get("my_mind")
  .then((mind) => console.log("Mind details:", mind))
  .catch((error) => console.error("Error:", error));
```

### Deleting a Mind

```javascript
client.minds
  .drop("my_mind")
  .then(() => console.log("Mind deleted"))
  .catch((error) => console.error("Error:", error));
```

## Error Handling

The SDK uses standard Promise-based error handling. Known error types include:

- `ObjectNotFound`: Thrown when attempting to access a non-existent resource
- `ObjectNotSupported`: Thrown when attempting to use an unsupported data source type

```javascript
try {
  const mind = await client.minds.get("non_existent_mind");
} catch (error) {
  if (error instanceof ObjectNotFound) {
    console.error("Mind not found");
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## API Reference

### MindsClient

- `constructor(apiKey?: string, baseURL?: string)`: Creates a new client instance
- `configure({ apiKey, baseURL })`: Static method to set global configuration

### DatasourcesService

- `create(dsConfig: Object, replace?: boolean)`: Create a new data source
- `list()`: List all data sources
- `get(name: string)`: Get a data source by name
- `drop(name: string)`: Delete a data source

### MindsService

- `create(name: string, options: Object, replace?: boolean)`: Create a new mind
- `list()`: List all minds
- `get(name: string)`: Get a mind by name
- `drop(name: string)`: Delete a mind

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
