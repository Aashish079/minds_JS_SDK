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

client.datasources.create(postgresConfig)
    .then(datasource => client.minds.create({ name: 'my_mind', datasources: [datasource] }))
    .then(mind => console.log('Mind created:', mind))
    .catch(error => console.error('Error creating mind:', error));