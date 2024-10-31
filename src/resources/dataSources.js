import { ObjectNotFound, ObjectNotSupported } from './exception.js';

class Datasources {
  constructor(client) {
    this.api = client.api;
  }

  /**
   * Creates a new datasource and returns it
   *
   * @param ds_config - Datasource configuration
   * @param ds_config.name - Name of the datasource
   * @param ds_config.engine - Type of database handler, e.g., 'postgres', 'mysql'
   * @param ds_config.description - Description of the database. Used by mind to know what data can be got from it.
   * @param ds_config.connection_data - dict, optional, credentials to connect to database
   * @param ds_config.tables - Optional, List of allowed tables
   * @param replace - Whether to replace existing datasource
   * @returns A promise that resolves to the created Datasource object
   * @throws {ObjectNotSupported} If the datasource type is not supported
   * @throws {Error} If there's an error during the API call
   */
  async create(ds_config, replace = false) {
    const name = ds_config.name;
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

    await this.api.post("/api/datasources", ds_config);
    return this.get(name);
  }

  async update(ds_config, datasource_name) {
    const resp = await this.api.patch(`/api/datasources/${datasource_name}`, ds_config);
    return resp.data;
  }

  async get(name) {
    const { data } = await this.api.get(`/api/datasources/${name}?check_connection=true`);
    if (data.engine == null) {
      throw new ObjectNotSupported(`Wrong type of datasource: ${name}`);
    }
    return data;
  }

  async list() {
    const { data } = await this.api.get("/api/datasources");
    return data
      .filter(item => item.engine != null);
  }

  async drop(name) {
    const resp = await this.api.delete(`/api/datasources/${name}`);
    return resp.data;
  }
}

export { Datasources };