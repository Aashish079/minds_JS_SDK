const MindsClient = require('minds_js_sdk');

const client = new MindsClient("YOUR_API_KEY");

const postgresConfig = {
    name: 'my_datasource',
    description: 'Description of your data',
    engine: 'postgres',
    connectionData: {
        user: 'demo_user',
        password: 'demo_password',
        host: 'samples.mindsdb.com',
        port: 5432,
        database: 'demo',
        schema: 'demo_data'
    },
    tables: ['TABLE-1', 'TABLE-2']
};

client.dataSource.create(postgresConfig)
    .then(datasource => console.log('Data source created:', datasource))
    .catch(error => console.error('Error creating data source:', error));