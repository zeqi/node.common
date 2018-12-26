/**
 * Created by zeqi
 * @description The client for http request
 * @module Helpers
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File httpClient
 * @Date 17-5-22
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuxj4@lenovo.com
 */

'use strict';

var debug = require('debug')('smart.node.common:helpers:httpClient');
debug.log = console.log.bind(console);
var Q = require('q');
var agent = require('superagent');

/**
 * The http request handler
 * 
 * @class HttpClient
 */
class HttpClient {
  /**
   * DataService constructor
   * @param options {{basicAuth: string, serverAddress: string}}
   * @param cacheOptions {{cacheType: string, client: Object, seconds: Number}}   cacheType e.g:redis, mongodb;  client e,g: redis client...
   */
  constructor(options, cacheOptions) {
    this.basicAuth = options;
    this.serverAddress = options;
    this.platform_name = options;
    this.platform = options;
    this.cacheType = null;
    this.cacheClient = null;
    this.cacheSeconds = null;
    this.cacheOptions = cacheOptions;
  }

  /**
   * 
   * 
   * @readonly
   * @static
   * 
   * @memberOf HttpClient
   */
  static get DEFAULT_PLATFORM_NAME() {
    return 'platform';
  }

  /**
   * 
   * 
   * @readonly
   * @static
   * 
   * @memberOf HttpClient
   */
  static get GET_NAME() {
    return 'get';
  }

  /**
   * 
   * 
   * @readonly
   * @static
   * 
   * @memberOf HttpClient
   */
  static get POST_NAME() {
    return 'post';
  }

  /**
   * 
   * 
   * @readonly
   * @static
   * 
   * @memberOf HttpClient
   */
  static get PUT_NAME() {
    return 'put';
  }

  /**
   * 
   * 
   * @readonly
   * @static
   * 
   * @memberOf HttpClient
   */
  static get PATCH_NAME() {
    return 'patch';
  }

  /**
   * 
   * 
   * @readonly
   * @static
   * 
   * @memberOf HttpClient
   */
  static get DELETE_NAME() {
    return 'delete';
  }

  /**
   * 
   * 
   * @readonly
   * @static
   * 
   * @memberOf HttpClient
   */
  static get SEARCH_NAME() {
    return 'search';
  }

  /**
   * 
   * @readonly
   * 
   * @memberOf HttpClient
   */
  get basicAuth() {
    return this._basicAuth;
  }

  /**
   * 
   * 
   * 
   * @memberOf HttpClient
   */
  set basicAuth(options) {
    // if (!options || !options.basicAuth) {
    //   throw {
    //     errorCode: 500,
    //     message: 'Invalid options basicAuth:' + JSON.stringify(options)
    //   };
    // }

    if (!options) {
      throw {
        errorCode: 500,
        message: 'Invalid options:' + JSON.stringify(options)
      };
    }

    this._basicAuth = options.basicAuth || null;
  }

  /**
   * 
   * @readonly
   * 
   * @memberOf HttpClient
   */
  get serverAddress() {
    return this._serverAddress;
  }

  /**
   * 
   * 
   * 
   * @memberOf HttpClient
   */
  set serverAddress(options) {
    if (typeof options != 'object') {
      throw {
        errorCode: 500,
        message: 'Invalid options type:' + (typeof options)
      };
    }
    if (options.serverAddress) {
      this._serverAddress = options.serverAddress;
    }
    else if (options.host) {
      this._serverAddress = 'http://' + options.host;
      if (options.port) {
        this._serverAddress += ':' + options.port;
      }
      if (options.version) {
        this._serverAddress += '/' + options.version;
      }
    }
    else {
      throw {
        errorCode: 500,
        message: 'Invalid options object:' + JSON.stringify(options)
      };
    }
  }

  /**
   * 
   * 
   * 
   * @memberOf HttpClient
   */
  set platform_name(options) {
    if (options && options.platform) {
      this._platform_name = options.platform;
    }
    this._platform_name = this._platform_name || 'smart.node.common';
  }

  /**
   * 
   * 
   * @readonly
   * 
   * @memberOf HttpClient
   */
  get platform_name() {
    return this._platform_name || HttpClient.DEFAULT_PLATFORM_NAME;
  }

  set platform(options) {
    if (options && options.platform) {
      this._platform = options.platform;
    }
  }

  /**
   * 
   * @readonly
   * 
   * @memberOf HttpClient
   */
  get platform() {
    return this._platform || null;
  }

  /**
   *
   * 
   * 
   * @memberOf HttpClient
   */
  set cacheOptions(cacheOptions) {
    if (cacheOptions && cacheOptions.cacheType && cacheOptions.client && Number(cacheOptions.seconds)) {
      this._cacheOptions = cacheOptions;
      this.cacheType = cacheOptions.cacheType;
      this.cacheClient = cacheOptions.client;
      this.cacheSeconds = Number(cacheOptions.seconds);
    }
  }

  get cacheOptions() {
    return this._cacheOptions;
  }

  /**
   * Request handler, If the cache has data and read cache, Else request service
   * 
   * @param {any} verb {string} request method
   * @param {any} path {string} e.x--> /applications | /orders
   * @param {any} payload {object} body
   * @param {any} defer Q defer
   * @param {any} key redis key
   * @returns {promise}
   * 
   * @memberOf HttpClient
   */
  requestHandler(verb, path, payload, defer, key) {
    var self = this;
    var method = 'requestHandler';
    var request = self.init(verb, path, payload);
    return request.end((err, res) => {
      if (err) {
        debug(method + ' Failed to execute the data service.');
        return defer.reject(err);
      } else {
        if ((verb == HttpClient.GET_NAME || verb == HttpClient.SEARCH_NAME) && this.cacheClient) {
          if (this.cacheType == 'redis') {
            var data = { body: res.body };
            this.cacheClient.setex(key, this.cacheSeconds, JSON.stringify(data), (err, reply) => {
              if (err) {
                debug(method, 'setex error', err);
              }
              return;
            });
          }
        }
        return defer.resolve(res);
      }
    });
  }

  /**
   * Send a request and return the result by agent
   * @param verb {string} request method
   * @param path {string} e.x--> /applications | /orders
   * @param payload {object} body
   * @returns {promise}
   * @public
   */
  execute(verb, path, payload) {
    var self = this;
    var method = 'execute';
    var defer = Q.defer();
    var key = 'cache:httpclient:' + verb + ':path:' + path;
    if (this.platform_name) {
      key = this.platform_name + ':' + key;
    }
    if ((verb == HttpClient.GET_NAME || verb == HttpClient.SEARCH_NAME) && this.cacheClient) {
      if (this.cacheType == 'redis') {
        this.cacheClient.get(key, (err, reply) => {
          if (err || !reply) {
            return this.requestHandler(verb, path, payload, defer, key);
          }
          return defer.resolve(JSON.parse(reply));
        });
      }
    }
    else {
      this.requestHandler(verb, path, payload, defer, key);
    }
    return defer.promise;
  }

  /**
   * Init a request object when send a request
   * @param verb {string} request method
   * @param path {string} e.x--> /applications | /orders
   * @param payload {object} body
   * @returns {promise}
   * @private
   */
  init(verb, path, payload) {
    var url = this.serverAddress + path;

    if (!verb) verb = HttpClient.GET_NAME;
    verb = verb.trim().toLowerCase();

    var request;
    switch (verb) {
      case HttpClient.GET_NAME:
        request = agent.get(url);
        break;
      case HttpClient.POST_NAME:
        request = agent.post(url);
        break;
      case HttpClient.PUT_NAME:
        request = agent.put(url);
        break;
      case HttpClient.DELETE_NAME:
        request = agent.del(url);
        break;
      case HttpClient.PATCH_NAME:
        request = agent.patch(url);
        break;
      case HttpClient.SEARCH_NAME:
        request = agent.search(url);
        break;
      default:
        request = agent.get(url);
        break;
    }

    request.set('Content-Type', 'application/json');
    if (this.basicAuth) {
      request.set('Authorization', this.basicAuth);
    }
    if (this.platform) {
      request.set(this.platform_name, this.platform);
    }

    if (verb === HttpClient.POST_NAME || verb === HttpClient.PUT_NAME || verb === HttpClient.PATCH_NAME || verb === HttpClient.SEARCH_NAME) {
      request.send(JSON.stringify(payload));
    }

    return request;
  }

  /**
   * Send a post request by agent
   * @param path {string} e.x--> /applications | /orders
   * @param payload {object} body
   * @param userId {string} user id
   * @returns {promise}
   * @public
   */
  post(path, payload) {
    return this.execute(HttpClient.POST_NAME, path, payload);
  }

  /**
   * Send a get request by agent
   * @param path {string} e.x--> /applications | /orders
   * @param payload {object} body
   * @returns {promise}
   * @public
   */
  get(path, payload) {
    return this.execute(HttpClient.GET_NAME, path, payload);
  }

  /**
   * Send a put request by agent
   * @param path {string} e.x--> /applications | /orders
   * @param payload {object} body
   * @returns {promise}
   */
  put(path, payload) {
    return this.execute(HttpClient.PUT_NAME, path, payload);
  }

  /**
   * Send a patch request by agent
   * @param path {string} e.x--> /applications | /orders
   * @param payload {object} body
   * @returns {promise}
   * @public
   */
  patch(path, payload) {
    return this.execute(HttpClient.PATCH_NAME, path, payload);
  }

  /**
   * Send a delete request by agent
   * @param path {string} e.x--> /applications | /orders
   * @param payload {object} body
   * @returns {promise}
   * @public
   */
  delete(path, payload) {
    return this.execute(HttpClient.DELETE_NAME, path, payload);
  }

  /**
   * Send a search request by agent
   * @param path {string} e.x--> /applications | /orders
   * @param payload {object} body
   * @returns {promise}
   * @public
   */
  search(path, payload) {
    return this.execute(HttpClient.SEARCH_NAME, path, payload);
  }
}

module.exports = HttpClient;