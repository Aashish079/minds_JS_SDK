class DataSource {
    constructor(client){
        this.client = client;
    }

    async create(config){
        const response = await this.client.post('/datasources', config);
        return response.data;
    }

    async all(){
        const response = await this.client.get('/datasources');
        return response.data;
    }

    async find(name){
        const response = await this.client.get(`/datasources/${name}`);
        return response.data;
    }

    async destory(name){
        const response = await this.client.delete(`/datasources/${name}`);
        return response.data;
    }
}

module.exports = DataSource;