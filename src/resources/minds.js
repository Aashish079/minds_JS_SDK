import OpenAI from 'openai';
import { Stream } from 'openai/streaming';
const DEFAULT_PROMPT_TEMPLATE = "Use your database tools to answer the user's question: {{question}}";

class Mind {
  constructor(
    client,
    name,
    model_name = null,
    provider = null,
    parameters = {},
    datasources = null,
    created_at = null,
    updated_at = null,
  ) {
    this.api = client.api;
    this.client = client;
    this.project = 'mindsdb';

    this.name = name;
    this.model_name = model_name;
    this.provider = provider;
    this.prompt_template = parameters.prompt_template || null;
    delete parameters.prompt_template;
    this.parameters = parameters;
    this.created_at = created_at;
    this.updated_at = updated_at;

    this.datasources = datasources;
  }

  async update(
    name,
    model_name,
    provider,
    prompt_template,
    datasources,
    parameters,
  ) {
    const data = {};

    if (datasources) {
      const ds_names = datasources.map((ds) => this.client.minds._check_datasource(ds));
      data.datasources = ds_names;
    }

    if (name) data.name = name;
    if (model_name) data.model_name = model_name;
    if (provider) data.provider = provider;
    if (parameters) data.parameters = parameters;

    if (prompt_template) {
      if (!data.parameters) data.parameters = {};
      data.parameters.prompt_template = prompt_template;
    }

    await this.api.patch(`/projects/${this.project}/minds/${this.name}`, { data });

    if (name && name !== this.name) {
      this.name = name;
    }
  }

  async add_datasource(datasource) {
    const ds_name = this.client.minds._check_datasource(datasource);

    await this.api.post(`/projects/${this.project}/minds/${this.name}/datasources`, {
      data: { name: ds_name },
    });

    const updated = await this.client.minds.get(this.name);
    this.datasources = updated.datasources;
  }

  async del_datasource(datasource) {
    const ds_name = typeof datasource === 'string' ? datasource : datasource.name;

    await this.api.delete(`/projects/${this.project}/minds/${this.name}/datasources/${ds_name}`);

    const updated = await this.client.minds.get(this.name);
    this.datasources = updated.datasources;
  }

  async completion(message, stream = false) {
    const openai_client = new OpenAI({ apiKey: this.client.apiKey, baseURL: this.client.baseUrl });
    const response = await openai_client.chat.completions.create({
      model: this.name,
      messages: [{ role: 'user', content: message }],
      stream: stream,
    });

    if (response instanceof Stream) {
      for await (const chunk of response) {
        process.stdout.write(chunk.choices[0]?.delta?.content || '');
      }
    } else {
      return response.choices[0]?.message?.content || '';
    }
  }
}

class Minds {
  constructor(client) {
    this.api = client.api;
    this.client = client;
    this.project = 'mindsdb';
  }

  async list() {
    const res = await this.api.get(`/api/projects/${this.project}/minds`);
    const minds = res.data.map(
      (mind) =>
        new Mind(
          this.client,
          mind.name,
          mind.model_name,
          mind.provider,
          mind.parameters,
          mind.datasources,
          mind.created_at,
          mind.updated_at,
        ),
    );
    return minds;
  }

  async create(
    mind_name,
    options = {},
  ) {
    let { 
      model_name, 
      provider, 
      prompt_template, 
      datasources = [], 
      parameters = {}, 
      replace = false 
    } = options;

    if (replace) {
      try {
        this.get(mind_name);
        this.drop(mind_name);
      } catch (err) {
        console.log("Mind doesn't exist, creating new one");
      }
    }

    const ds_names = [];
    for (const datasource of datasources) {
      const ds = this._check_datasource(datasource);
      ds_names.push(ds);
    }

    if (prompt_template) {
      parameters['prompt_template'] = prompt_template;
    }
    if (!('prompt_template' in parameters)) {
      parameters['prompt_template'] = DEFAULT_PROMPT_TEMPLATE;
    }

    await this.api.post(`/api/projects/${this.project}/minds`, {
      name: mind_name,
      model_name: model_name,
      provider: provider,
      parameters: parameters,
      datasources: ds_names,
    });

    const mind = this.get(mind_name);
    return mind;
  }

  async get(name) {
    const resp = await this.api.get(`api/projects/${this.project}/minds/${name}`);
    const mind = resp.data;
    return new Mind(
      this.client,
      mind.name,
      mind.model_name,
      mind.provider,
      mind.parameters,
      mind.datasources,
      mind.created_at,
      mind.updated_at,
    );
  }

  async drop(mind_name) {
    const resp = await this.api.delete(`/api/projects/mindsdb/minds/${mind_name}`);
    return resp.data;
  }

  _check_datasource(ds) {
    if (this.isDatasource(ds)) {
      return ds.name;
    } else if (this.isDatabaseConfig(ds)) {
      // if not exists - create
      try {
        this.client.datasources.get(ds.name);
      } catch (error) {
        if (error instanceof Error && error.name === 'ObjectNotFound') {
          this.client.datasources.create(ds);
        } else {
          throw error;
        }
      }
      return ds.name;
    } else if (typeof ds === 'string') {
      return ds;
    } else {
      throw new Error(`Unknown type of datasource: ${ds}`);
    }
  }

  isDatasource(ds) {
    return ds.name !== undefined;
  }

  isDatabaseConfig(ds) {
    return ds.name !== undefined && ds.engine !== undefined;
  }
}

export { Minds };