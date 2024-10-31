const MindsClient = require('minds_js_sdk');

const client = new MindsClient("APIKEY");

client.mind.all()
    .then(minds => console.log('All minds:', minds))
    .catch(error => console.error('Error listing minds:', error));