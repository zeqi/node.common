/**
 * Created by zeqi
 * @description The main db manager for every db connection handler
 * @module DS
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File index
 * @Date 17-5-22
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuxj4@lenovo.com
 */

'use strict';

var debug = require('debug')('smart.node.common:ds');
debug.log = console.log.bind(console);
let BaseDs = require('./base');
let MongoDS = require('./mongodb');
let RedisDS = require('./redis');
let OrmDS = require('./orm');
/**
 * The db Thread pool factory
 * 
 * @class DS
 * @extends {BaseDs}
 */
class DS extends BaseDs {
    /**
     * Creates an instance of DS.
     * 
     * @memberOf DS
     */
    constructor() {
        super();
    }

    /**
     * Init all ds
     * 
     * @static
     * @param {any} conf 
     * 
     * @memberOf DS
     */
    static initAllDS(conf) {
        var method = 'initAllDS';
        debug(method, 'DataProviders conf', conf);
        MongoDS.init(conf);
        RedisDS.init(conf);
        OrmDS.init(conf);
    }

    /**
     * Init nosql ds
     * 
     * @static
     * @param {any} conf 
     * 
     * @memberOf DS
     */
    static initNosqlDS(conf) {
        var method = 'initNosqlDS';
        debug(method, 'DataProviders conf', conf);
        MongoDS.init(conf);
        RedisDS.init(conf);
    }

    /**
     * Init mongodb DS
     * 
     * @static
     * @param {any} conf 
     * 
     * @memberOf DS
     */
    static initMongodbDS(conf) {
        var method = 'initMongodbDS';
        debug(method, 'DataProviders conf', conf);
        MongoDS.init(conf);
    }

    /**
     * Init redis DS
     * 
     * @static
     * @param {any} conf 
     * 
     * @memberOf DS
     */
    static initRedisDS(conf) {
        var method = 'initRedisDS';
        debug(method, 'DataProviders conf', conf);
        RedisDS.init(conf);
    }

    /**
     * Init ORM DS
     * 
     * @static
     * @param {any} conf 
     * 
     * @memberOf DS
     */
    static initOrmDS(conf) {
        var method = 'initOrmDS';
        debug(method, 'DataProviders conf', conf);
        OrmDS.init(conf);
    }

    /**
     * Get a mongodb connection instance
     * 
     * @readonly
     * @static
     * 
     * @memberOf DS
     */
    static get MongDS() {
        return MongoDS;
    }

    /**
     * Get a redis connection instance
     * 
     * @readonly
     * @static
     * 
     * @memberOf DS
     */
    static get RedisDS() {
        return RedisDS;
    }

    /**
     * Get a orm connection instance
     * 
     * @readonly
     * @static
     * 
     * @memberOf DS
     */
    static get OrmDS() {
        return OrmDS;
    }
}

module.exports = DS;