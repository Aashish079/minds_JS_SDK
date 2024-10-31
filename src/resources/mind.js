/**
 * Represents a Mind object in MindsDB.
 */
class Mind {
  /**
   * @param {Object} params - The parameters for the Mind.
   * @param {string} params.name - The name of the mind.
   * @param {string} params.modelName - The name of the model used by the mind.
   * @param {string} params.provider - The provider of the model.
   * @param {Object} params.parameters - Additional parameters for the mind.
   * @param {Array} params.datasources - List of datasources used by the mind.
   */
  constructor({ name, modelName, provider, parameters, datasources }) {
    this.name = name;
    this.modelName = modelName;
    this.provider = provider;
    this.parameters = parameters;
    this.datasources = datasources;
  }
}

module.exports = Mind;
