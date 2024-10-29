const axios = require('axios');
const config = require('./config');
const DataSource = require('./resources/dataSources');
const Mind = require('./resources/mind');

class MindsClient{
    constructor(apiKey = config.apiKey, baseURL = config.baseURL){
        this.apiKey = apiKey;
        this.baseURL = baseURL;
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {'Authorization': `Bearer ${this.apiKey}`}
        });

        this.dataSource = new DataSource(this.client);
        this.minds = new Mind(this.client);
}

static configure({apiKey, baseURL}){
    config.apiKey = apiKey;
    config.baseURL = baseURL || config.baseURL;
}
}

module.exports = MindsClient;