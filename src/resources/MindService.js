const Mind = require('./mind'); // Adjust the path as necessary

class MindsService {
    constructor(client) {
        this.client = client;
    }

    /**
     * Lists all minds.
     * @returns {Promise<Array<Mind>>}
     */
    async list() {
        const response = await this.client.get('/projects/mindsdb/minds');
        return response.data.map(item => new Mind(item));
    }

    /**
     * Retrieves a mind by name.
     * @param {string} name - The name of the mind.
     * @returns {Promise<Mind>}
     */
    async get(name) {
        const response = await this.client.get(`/projects/mindsdb/minds/${name}`);
        return new Mind(response.data);
    }

    /**
     * Creates a new mind.
     * @param {string} name - The name of the mind.
     * @param {Object} options - Configuration options for the mind.
     * @param {boolean} replace - Whether to replace an existing mind with the same name.
     * @returns {Promise<Mind>}
     */
    async create(name, options = {}, replace = false) {
        if (replace) {
            try {
                await this.get(name);
                await this.drop(name);
            } catch (error) {
                if (error.response && error.response.status !== 404) throw error;
            }
        }

        const { modelName, provider, promptTemplate, datasources, parameters } = options;
        const data = {
            name,
            modelName,
            provider,
            parameters: { ...parameters, promptTemplate },
            datasources
        };

        await this.client.post('/projects/mindsdb/minds', data);
        return this.get(name);
    }

    /**
     * Deletes a mind by name.
     * @param {string} name - The name of the mind.
     */
    async drop(name) {
        await this.client.delete(`/projects/mindsdb/minds/${name}`);
    }
}

module.exports = MindsService;