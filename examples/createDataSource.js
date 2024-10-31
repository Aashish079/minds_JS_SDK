const MindsClient = require('../src/client.js');

const client = new MindsClient("mdb_24cLWXfmr1S4e7r0pqkKt3mRqNfHFK6Fn3Em6qJwNIim");

const postgresConfig = {
    name: "house_sales",
    engine: "postgres",
    description: "Data about Housing",
    connectionData: {
      user: "demo_user",
      password: "demo_password",
      host: "samples.minddb.com",
      port: 5432,
      database: "demo",
      schema: "demo_data",
    },
  
    tables: ['house_sales'],
  };

client.dataSource.create(postgresConfig)
    .then(datasource => console.log('Data source created:', datasource))
    .catch(error => console.error('Error creating data source:', error));