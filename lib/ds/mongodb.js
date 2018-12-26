/**
 * Created by zeqi
 * @description Mongodb connection factory
 * @module DS
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File mongodb
 * @Date 17-5-22
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuxj4@lenovo.com
 */

'use strict';

var debug = require('debug')('smart.node.common:ds:mongodb');
debug.log = console.log.bind(console);
var error = require('debug')('smart.node.common:ds:mongodb:error');
error.log = console.error.bind(console);
let BaseDS = require('./base');

/**
 * The connection pool for mongodb
 * 
 * @class MongoDS
 * @extends {BaseDS}
 */
class MongoDS extends BaseDS {
  /**
   * Creates an instance of MongoDS.
   * 
   * @memberOf MongoDS
   */
  constructor() {
    super();
  }

  /**
   * 
   * 
   * @static
   * @param {any} conf 
   * @returns {Boolean}
   * 
   * @memberOf MongoDS
   */
  static checkConf(conf) {
    if (!conf) {
      throw new this.ErrorResult(406, 'mongodb conf invalid');
    }
    return true;
  }

  /**
   * Create mongodb connection and add to db factory
   * 
   * @static
   * @param {any} attr 
   * @param {any} options 
   * 
   * @memberOf MongoDS
   */
  static setDSOptions(attr, options) {
    var method = 'setDSOptions';
    try {
      let mongoose = require('mongoose');
      if (typeof options.uri == 'string')
        this.dsMgrt.set(attr, new this.DSOptions(options, mongoose.createConnection(options.uri, options)));
      else
        this.dsMgrt.set(attr, new this.DSOptions(options, mongoose.createConnection(options.host, options.dbname, options.port, options)));
      debug(method, attr, 'Mongodb connection pool initialization completed!');
    }
    catch (err) {
      error(method, err);
      process.exit();
    }
  }

  /**
   * Init mongodb config
   * 
   * @static
   * @param {any} conf 
   * 
   * @memberOf MongoDS
   */
  static init(conf) {
    conf = this.getDSConfByType(this.dsType.mongodb, conf);
    this.checkConf(conf);
    for (var attr in conf) {
      var options = conf[attr];
      if (options && options.isDs) {
        var connection = this.getConnection(attr);
        if (connection && connection.readyState === 1) {
          continue;
        }
        this.setDSOptions(attr, options);
      }
    }
  }
}

module.exports = MongoDS;