import axios from 'axios';
import { Datasources } from './datasources.js';
import { Minds } from './minds.js';

export default class Client {
  constructor(apiKey, baseUrl = 'https://staging.mdb.ai') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    this.datasources = new Datasources(this);
    this.minds = new Minds(this);
  }
}