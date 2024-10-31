class Datasource {
    /**
     * @param {Object} params - The parameters for the Datasource.
     * @param {string} params.name - The name of the datasource.
     * @param {string} params.engine - The database engine type (e.g., 'postgres', 'mysql').
     * @param {string} params.description - A description of the datasource.
     * @param {Object} params.connectionData - The connection data for the datasource.
     * @param {Array} params.tables - A list of tables available in the datasource.
     */
    constructor({ name, engine, description, connectionData = {}, tables = [] }) {
        this.name = name;
        this.engine = engine;
        this.description = description;
        this.connectionData = connectionData;
        this.tables = tables;
    }
}

module.exports = Datasource;