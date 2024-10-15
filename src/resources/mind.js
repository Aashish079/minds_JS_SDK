class Mind{
    constructor(client){
        this.client = client;
    }

    async create({name, replace = false, datasources = []}) {
        const response = await this.client.post('/minds', {name, replace,datasources});
        return response.data;
    }

    async all(){
        const response = await this.client.get('/minds');
        return response.data;
    }

    async find(name){
        const response = await this.client.get(`/minds/${name}`);
        return response.data;
    }

    async delete(name){
        const response = await this.client.delete(`/minds/${name}`);
        return response.data;
    }

    async update(name, data){
        const response = await this.client.put(`/minds/${name}`, data);
        return response.data;
    }

    async completion({name, message, stream = false}){
        const response = await this.client.post(`/mind/${name}/chat`,{message, stream});
        return response.data;
    }

}

module.exports = Mind;