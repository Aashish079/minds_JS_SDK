const MindsClient = require('minds_js_sdk');

const client = new MindsClient("YOUR_API_KEY");

client.minds.list()
    .then(minds => console.log('All minds:', minds))
    .catch(error => console.error('Error listing minds:', error));