const MindsClient = require("../src/client");

const client = new MindsClient("mdb_24cLWXfmr1S4e7r0pqkKt3mRqNfHFK6Fn3Em6qJwNIim");

const postgresConfig = {
  name: "datasource_name",
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

client.dataSource
  .create(postgresConfig)
  .then((datasource) =>
    client.minds.create({ name: "my_mind", datasources: [datasource] })
  )
  .then((mind) => console.log("Mind created:", mind))
  .catch((error) => {
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    } else {
      console.error("Error message:", error.message);
    }
  });
