/**
 * Created by zeqi
 * @description The helper for every client request api
 * @module Helpers
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File dataHelper
 * @Date 17-5-22
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuxj4@lenovo.com
 */

'use strict';

let debug = require('debug');
let log = debug('smart.node.common:helpers:DataHelper:log');
let err = debug('smart.node.common:helpers:DataHelper:error');
log.log = console.log.bind(console);
err.log = console.error.bind(console);
var Q = require('q');
var qs = require('qs');

var HttpClient = require('./httpClient');

/**
 * Responsible for data exchange
 *
 * @class DataHelper
 */
class DataHelper {
  /**
   * Creates an instance of DataHelper.
   *
   * @param baseUrl {string} logic base url
   * @param httpClient {HttpClient} http service instance
   *
   * @memberOf DataHelper
   * @constructor
   */
  constructor(baseUrl, httpClient) {
    this.baseUrl = baseUrl;
    this.httpClient = httpClient;
  }

  /**
   * Check item data service is DataHelper object
   * @param dataService {object} {tenant: new DataHelper(), portal: new DataHelper()}
   * @param services {Array|string} ex:['tenant', 'portal', 'organization', 'tnews', 'partner']
   * @returns {boolean}
   */
  static checkDataService(dataService, services) {
    var self = this;
    var method = 'checkDataService';
    if (typeof dataService != 'object') {
      return false;
    }
    if (typeof services == 'string') {
      services = [services];
    }

    if (Array.isArray(services)) {
      for (var i = 0; i < services.length; i++) {
        var item = dataService[services[i]];
        if (!item || !(item instanceof DataHelper)) {
          error(method, services[i] + ' data service invalid');
          return false;
        }
      }
    }
    else {
      for (var i in dataService) {
        var item = dataService[i];
        if (!item || !(item instanceof DataHelper)) {
          error(method, i + ' data service invalid');
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Get logic base url
   *
   * @readonly
   * @memberOf DataHelper
   */
  get baseUrl() {
    return this._baseUrl;
  }

  /**
   * Set logic base url
   *
   *
   * @memberOf DataHelper
   */
  set baseUrl(baseUrl) {
    // if (!baseUrl) {
    //   throw {
    //     errorCode: 500,
    //     reason: 'Invalid dataHelper baseUrl:' + JSON.stringify(baseUrl)
    //   };
    // }
    this._baseUrl = DataHelper.baseUrlHandler(baseUrl);
  }

  /**
   * Get http service instance
   *
   * @readonly
   * @memberOf DataHelper
   */
  get httpClient() {
    return this._httpClient;
  }

  /**
   * Set http service instance
   *
   *
   * @memberOf DataHelper
   */
  set httpClient(httpClient) {
    if (DataHelper.validationHttpClient(httpClient))
      this._httpClient = httpClient;
  }

  /**
   * The handler for logic base url
   *
   * @static
   * @param baseUrl {string}
   * @returns {string}
   *
   * @memberOf DataHelper
   */
  static baseUrlHandler(baseUrl) {
    if (typeof baseUrl != 'string') {
      return "";
    }

    if (baseUrl.length > 0) {
      if (baseUrl.substr(0, 1) != '/') {
        baseUrl = '/' + baseUrl;
      }

      if (baseUrl.substr(baseUrl.length - 1, 1) == '/') {
        baseUrl = baseUrl.substr(0, baseUrl.length - 2);
      }
    }
    return baseUrl;
  }

  /**
   * Error handler
   *
   * @static
   * @param {any} error
   * @param {number} errorCode
   * @returns {Object}
   *
   * @memberOf DataHelper
   */
  static resError(error, errorCode) {
    var self = this;
    var method = 'resError';
    errorCode = errorCode || 400;
    try {
      if (typeof error == 'string') {
        return { errorCode: errorCode, message: error };
      }
      else if (typeof error == 'object') {
        if (error.response) {
          var response = error.response;
          if (response.body) {
            if (typeof response.body == 'string') {
              return { errorCode: response.status, message: response.body };
            }
            else if (typeof response.body == 'object' && response.body.reason) {
              return { errorCode: response.status, message: response.body.reason };
            }
            else if (typeof response.body == 'object' && response.body.message) {
              return { errorCode: response.status, message: response.body.message };
            }
            else if (response.text) {
              return { errorCode: response.status, message: response.text };
            }
          }
        }
        else if (error.body) {
          if (typeof error.body == 'string') {
            return { errorCode: error.status, message: error.body };
          }
          else if (typeof error.body == 'object' && error.body.reason) {
            return { errorCode: error.status, message: error.body.reason };
          }
          else if (typeof error.body == 'object' && error.body.message) {
            return { errorCode: error.status, message: error.body.message };
          }
        }
        else if (error.message) {
          return { errorCode: errorCode, message: error.message };
        }
      }
    }
    catch (e) {
      if (error.text) {
        return { errorCode: error.status || 500, message: error.text };
      }
      return { errorCode: 500, message: error };
    }
    if (error.text) {
      return { errorCode: error.status || 500, message: error.text };
    }
    return { errorCode: 500, message: error };
  };

  /**
   * Validation http service instance
   *
   * @static
   * @param {HttpClient} httpClient
   * @returns {Boolean}
   *
   * @memberOf DataHelper
   */
  static validationHttpClient(httpClient) {
    if (!(httpClient instanceof HttpClient)) {
      throw {
        errorCode: 500,
        reason: 'Invalid httpClient:' + JSON.stringify(httpClient)
      };
    }
    return true;
  }

  /**
   * Get http service instance
   *
   * @static
   *
   * @memberOf DataHelper
   */
  static get httpClient() {
    return this._httpClient;
  }

  /**
   * Validation http service instance
   *
   * @static
   *
   * @memberOf DataHelper
   */
  static set httpClient(httpClient) {
    if (DataHelper.validationHttpClient(httpClient))
      this._httpClient = httpClient;
  }

  /**
   * Get data by url api and condtion.
   *
   * @static
   * @param {string} url
   * @param {Object} condition
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  static get(url, condition, callback) {
    var self = this;
    var method = 'get';
    url = this.baseUrlHandler(url);
    if (!url) {
      return Q.reject('请提供完整的url').nodeify(callback);
    }
    var path = url;

    if (condition && Object.keys(condition).length > 0) {
      path += '?' + qs.stringify(condition);
    }
    return self.httpClient.get(path).then(data => {
      var result = data.body;
      log(method, '[path]:', path, '[condition]:', condition, '[data]:', result);
      return result;
    }).fail(error => {
      err(method, '[path]:', path, '[condition]:', condition, '[error]:', error);
      throw self.resError(error);
    }).nodeify(callback);
  }

  /**
   * Put doc by url api.
   *
   * @static
   * @param {string} url
   * @param {Object} body
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  static put(url, body, condition, callback) {
    var self = this;
    var method = 'put';
    url = this.baseUrlHandler(url);
    if (!url) {
      return Q.reject('请提供完整的url').nodeify(callback);
    }
    var path = url;
    if (condition && Object.keys(condition).length > 0) {
      path += '?' + qs.stringify(condition);
    }

    return self.httpClient.put(path, body).then(data => {
      var result = data.body;
      log(method, '[path]:', path, '[condition]:', condition, '[body]:', body, '[data]:', result);
      return result;
    }).fail(error => {
      err(method, '[path]:', path, '[condition]:', condition, '[body]:', body, '[error]:', error);
      throw self.resError(error);
    }).nodeify(callback);
  }

  /**
   * Patch doc by url api.
   *
   * @static
   * @param {string} url
   * @param {Object} body
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  static patch(url, body, condition, callback) {
    var self = this;
    var method = 'patch';
    url = this.baseUrlHandler(url);
    if (!url) {
      return Q.reject('请提供完整的url').nodeify(callback);
    }
    var path = url;
    if (condition && Object.keys(condition).length > 0) {
      path += '?' + qs.stringify(condition);
    }

    return self.httpClient.patch(path, body).then(data => {
      var result = data.body;
      log(method, '[path]:', path, '[condition]:', condition, '[body]:', body, '[data]:', result);
      return result;
    }).fail(error => {
      err(method, '[path]:', path, '[condition]:', condition, '[body]:', body, '[error]:', error);
      throw self.resError(error);
    }).nodeify(callback);
  }

  /**
   * Post doc by url api.
   *
   * @static
   * @param {string} url
   * @param {Object} body
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  static post(url, body, condition, callback) {
    var self = this;
    var method = 'post';
    url = this.baseUrlHandler(url);
    if (!url) {
      return Q.reject('请提供完整的url').nodeify(callback);
    }
    var path = url;
    if (condition && Object.keys(condition).length > 0) {
      path += '?' + qs.stringify(condition);
    }

    return self.httpClient.post(path, body).then(data => {
      var result = data.body;
      log(method, '[path]:', path, '[condition]:', condition, '[body]:', body, '[data]:', result);
      return result;
    }).fail(error => {
      err(method, '[path]:', path, '[condition]:', condition, '[body]:', body, '[error]:', error);
      throw self.resError(error);
    }).nodeify(callback);
  }

  /**
   * Delete doc by url api.
   *
   * @static
   * @param {string} url
   * @param {object} condition
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  static delete(url, condition, callback) {
    var self = this;
    var method = 'delete';
    url = this.baseUrlHandler(url);
    if (!url) {
      return Q.reject('请提供完整的url').nodeify(callback);
    }
    var path = url;
    if (condition && Object.keys(condition).length > 0) {
      path += '?' + qs.stringify(condition);
    }
    return self.httpClient.delete(path).then(data => {
      var result = data.body;
      log(method, '[path]:', path, '[condition]:', condition, '[data]:', result);
      return result;
    }).fail(error => {
      err(method, '[path]:', path, '[condition]:', condition, '[error]:', error);
      throw self.resError(error);
    }).nodeify(callback);
  }

  /**
   * Aggregate doc by url api.
   *
   * @static
   * @param {string} url
   * @param {Array} pipeline
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  static search(url, pipeline, condition, callback) {
    var self = this;
    var method = 'search';
    url = this.baseUrlHandler(url);
    if (!url) {
      return Q.reject('请提供完整的url').nodeify(callback);
    }
    var path = url;
    if (condition && Object.keys(condition).length > 0) {
      path += '?' + qs.stringify(condition);
    }
    return self.httpClient.search(path, pipeline).then(data => {
      var result = data.body;
      log(method, '[path]:', path, '[condition]:', condition, '[pipeline]:', pipeline, '[data]:', result);
      return result;
    }).fail(error => {
      err(method, '[path]:', path, '[condition]:', condition, '[pipeline]:', pipeline, '[error]:', error);
      throw self.resError(error);
    }).nodeify(callback);
  }

  /**
   * The handler for logic base url
   *
   * @param {string} baseUrl
   * @returns {string}
   *
   * @memberOf DataHelper
   */
  baseUrlHandler(baseUrl) {
    return DataHelper.baseUrlHandler(baseUrl);
  }

  /**
   * Error handler
   *
   * @param {any} error
   * @param {number} errorCode
   * @returns {Object}
   *
   * @memberOf DataHelper
   */
  resError(error, errorCode) {
    return DataHelper.resError(error, errorCode);
  };

  /**
   * Get data by url.
   *
   * @param {string} url
   * @param {Object} condition
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  getByUrl(url, condition, callback) {
    DataHelper.httpClient = this.httpClient;
    return DataHelper.get(url, condition, callback);
  }

  /**
   * Put a doc by doc id.url.
   * @param {string} url
   * @param {Object} body
   * @param {Object} condition
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  putByUrl(url, body, condition, callback) {
    DataHelper.httpClient = this.httpClient;
    return DataHelper.put(url, body, condition, callback);
  }

  /**
   * Patch a doc by url.
   *
   * @param {string} url
   * @param {Object} body
   * @param {Object} condition
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  patchByUrl(url, body, condition, callback) {
    DataHelper.httpClient = this.httpClient;
    return DataHelper.patch(url, body, condition, callback);
  }

  /**
   * Create docs
   *
   * @param {string} url
   * @param {Object} body
   * @param {Object} condition
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  postByUrl(url, body, condition, callback) {
    DataHelper.httpClient = this.httpClient;
    return DataHelper.post(url, body, condition, callback);
  }

  /**
   * Delete docs by url
   *
   * @param {string} url
   * @param {Object} condition
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  deleteByUrl(url, condition, callback) {
    DataHelper.httpClient = this.httpClient;
    return DataHelper.delete(url, condition, callback);
  }

  /**
   * Get a doc by doc id.
   *
   * @param {string} id
   * @param {Object} condition
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  getById(id, condition, callback) {
    var self = this;
    if (!id) {
      return Q.reject('请提供记录id').nodeify(callback);
    }
    var path = self.baseUrl;
    path += '/' + id;
    return self.getByUrl(path, condition);
  }

  /**
   * Get a data list by condtion.
   *
   * @param {Object} condition
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  query(condition, callback) {
    var self = this;
    var path = self.baseUrl;
    return self.getByUrl(path, condition, callback);
  }

  /**
   * Get one by condition
   * @param condition
   * @param callback
   * @returns {Promise.<TResult>}
   */
  queryOne(condition, callback) {
    return this.query(condition, callback).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
      return null;
    });
  }

  /**
   * Get data count by condition.
   *
   * @param {Object} condition
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  count(condition, callback) {
    var self = this;
    var path = self.baseUrl;
    path += '/count';
    return self.getByUrl(path, condition, callback);
  }

  /**
   * Get a data list and count by condition.
   *
   * @param {Object} condition
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  getDataAndCount(condition, callback) {
    var self = this;
    var path = self.baseUrl + '/findDocsAndCount';
    return self.getByUrl(path, condition, callback);
  }

  /**
   * Put a doc by doc id.
   *
   * @param {string} id
   * @param {Object} body
   * @param {Object} condition
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  putById(id, body, condition, callback) {
    var self = this;
    if (!id) {
      return Q.reject('请提供记录id').nodeify(callback);
    }
    var path = self.baseUrl;
    path += '/' + id;
    return self.putByUrl(path, body, condition, callback);
  }

  /**
   * Put docs by condition
   *
   * @param {Object} condition
   * @param {Object} body
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  put(condition, body, callback) {
    var self = this;
    if (!condition) {
      return Q.reject('请提供更新条件').nodeify(callback);
    }
    var path = self.baseUrl;
    return self.putByUrl(path, body, condition, callback);
  }

  /**
   * Put a doc by condition
   * 
   * @param {any} condition 
   * @param {any} body 
   * @param {any} callback 
   * @returns {Promise}
   * 
   * @memberof DataHelper
   */
  putOne(condition, body, callback) {
    var self = this;
    if (!condition) {
      return Q.reject('请提供更新条件').nodeify(callback);
    }
    var path = self.baseUrl;
    path += '/one';
    return self.putByUrl(path, body, condition, callback);
  }

  /**
   * Patch a doc by doc id.
   *
   * @param {string} id
   * @param {Object} body
   * @param {Object} condition
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  patchById(id, body, condition, callback) {
    var self = this;
    if (!id) {
      return Q.reject('请提供记录id').nodeify(callback);
    }
    var path = self.baseUrl;
    path += '/' + id;
    return self.patchByUrl(path, body, condition, callback);
  }

  /**
   * Patch docs by condition
   *
   * @param {Object} condition
   * @param {Object} body
   * @param {function} callback
   * @returns {Promise}
   *
   * @memberOf DataHelper
   */
  patch(condition, body, callback) {
    var self = this;
    if (!condition) {
      return Q.reject('请提供更新条件').nodeify(callback);
    }
    var path = self.baseUrl;
    return self.patchByUrl(path, body, condition, callback);
  }

  /**
   * patch a doc by condition
   * 
   * @param {any} condition 
   * @param {any} body 
   * @param {any} callback 
   * @returns {Promise}
   * 
   * @memberof DataHelper
   */
  patchOne(condition, body, callback) {
    var self = this;
    if (!condition) {
      return Q.reject('请提供更新条件').nodeify(callback);
    }
    var path = self.baseUrl;
    path += '/one';
    return self.patchByUrl(path, body, condition, callback);
  }

  /**
   * Create docs by body
   * @param body {Object}
   * @param callback {function}
   * @returns {Promise}
   */
  post(body, condition, callback) {
    var self = this;
    var path = self.baseUrl;
    return self.postByUrl(path, body, condition, callback);
  }

  /**
   * 
   * 
   * @param {String} id 
   * @param {Object} condition 
   * @param {function} callback 
   * @returns {Promise}
   * 
   * @memberof DataHelper
   */
  deleteById(id, condition, callback) {
    var self = this;
    if (!id) {
      return Q.reject('请提供记录id').nodeify(callback);
    }
    var path = self.baseUrl;
    path += '/' + id;
    return self.deleteByUrl(path, condition, callback);
  }

  /**
   * 
   * 
   * @param {string} url 
   * @param {Object} pipeline 
   * @param {Object} condition 
   * @param {any} callback 
   * @returns {Promise}
   * 
   * @memberof DataHelper
   */
  searchByUrl(url, pipeline, condition, callback) {
    DataHelper.httpClient = this.httpClient;
    return DataHelper.search(url, pipeline, condition, callback);
  }

  /**
   * 
   * 
   * @param {Object} condition 
   * @param {Object} pipeline 
   * @param {any} callback 
   * @returns {Promise}
   * 
   * @memberof DataHelper
   */
  search(pipeline, condition, callback) {
    var self = this;
    if (!pipeline) {
      return Q.reject('请提供聚合管道').nodeify(callback);
    }
    var path = self.baseUrl;
    return self.searchByUrl(path, pipeline, condition, callback);
  }
}

module.exports = DataHelper;