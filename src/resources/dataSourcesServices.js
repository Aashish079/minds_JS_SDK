const Datasource = require('./dataSources');

/**
 * Service for managing Datasources.
 */
class DatasourcesService {
    /**
     * @param {Object} client - The API client instance.
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Create a new datasource.
     * @param {Object} dsConfig - The configuration for the datasource.
     * @param {boolean} [replace=false] - Whether to replace an existing datasource.
     * @returns {Promise<Datasource>} - The created Datasource.
     * @throws {ObjectNotFound} - If the datasource to replace does not exist.
     */
    async create(dsConfig, replace = false) {
        const name = dsConfig.name;

        if (replace) {
            try {
                await this.get(name);
                await this.drop(name);
            } catch (error) {
                if (!(error instanceof ObjectNotFound)) {
                    throw error;
                }
            }
        }

        await this.client.post('/datasources', dsConfig);
        return this.get(name);
    }

    /**
     * List all datasources.
     * @returns {Promise<Datasource[]>} - An array of Datasources.
     */
    async list() {
        const response = await this.client.get('/datasources');
        const data = response.data;
        const dsList = [];

        for (const item of data) {
            if (!item.engine) continue; // Skip non-SQL datasources
            dsList.push(new Datasource(item));
        }

        return dsList;
    }

    /**
     * Get a datasource by name.
     * @param {string} name - The name of the datasource.
     * @returns {Promise<Datasource>} - The requested Datasource.
     * @throws {ObjectNotSupported} - If the datasource type is not supported.
     */
    async get(name) {
        const response = await this.client.get(`/datasources/${name}`);
        const data = response.data;

        if (!data.engine) {
            throw new ObjectNotSupported(`Wrong type of datasource: ${name}`);
        }

        return new Datasource(data);
    }

    /**
     * Drop (delete) a datasource by name.
     * @param {string} name - The name of the datasource to delete.
     * @returns {Promise<void>}
     */
    async drop(name) {
        await this.client.delete(`/datasources/${name}`);
    }
}

module.exports = DatasourcesService;