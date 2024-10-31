const MindsClient = require("minds_js_sdk");

const client = new MindsClient("YOUR_API_KEY");

const postgresConfig = {
  name: "car_database",
  engine: "postgres",
  description: "Data about Cars",
  connectionData: {
    user: "aashishkarki",
    password: "********",
    host: "0.tcp.in.ngrok.io",
    port: 17026,
    database: "car",
    schema: "car_data",
  },
};

client.dataSource
  .create(postgresConfig)
  .then((datasource) =>
    client.mind.create({ name: "my_mind", datasources: [datasource] })
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
