class Mind{
    constructor(client){
        this.client = client;
    }

    async create({name, replace = false, datasources = []}) {
        const response = await this.client.post('/minds', {name, replace,datasources});
        return response.data;
    }

}