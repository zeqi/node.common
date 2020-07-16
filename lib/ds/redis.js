/**
 * Created by zeqi
 * @description Redis connection factory
 * @module DS
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File redis
 * @Date 17-5-22
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuzeqi2013@gmail.com
 */

'use strict';

var debug = require('debug')('node.common:ds:redis');
debug.log = console.log.bind(console);
var error = require('debug')('node.common:ds:redis:error');
error.log = console.error.bind(console);
let BaseDS = require('./base');

/**
 * The connection pool for redis
 * 
 * @class RedisDS
 * @extends {BaseDS}
 */
class RedisDS extends BaseDS {
    /**
     * Creates an instance of RedisDS.
     * 
     * @memberOf RedisDS
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
     * @memberOf RedisDS
     */
    static checkConf(conf) {
        if (!conf) {
            throw new this.ErrorResult(406, 'redis conf invalid');
        }
        return true;
    }

    /**
     * Create redis connection and add to db factory
     * 
     * @static
     * @param {any} attr 
     * @param {any} options 
     * 
     * @memberOf RedisDS
     */
    static setDSOptions(attr, options) {
        var method = 'setDSOptions';
        try {
            let redis = require('redis');
            this.dsMgrt.set(attr, new this.DSOptions(options, redis.createClient(options)));
            debug(method, attr, 'Redis connection pool initialization completed!');
        }
        catch (err) {
            error(method, err);
            process.exit();
        }

    }

    /**
     * Init redis config
     * 
     * @static
     * @param {any} conf 
     * 
     * @memberOf RedisDS
     */
    static init(conf) {
        conf = this.getDSConfByType(this.dsType.redis, conf);
        this.checkConf(conf);
        for (var attr in conf) {
            var options = conf[attr];
            if (options && options.isDs) {
                if (this.getConnection(attr)) {
                    continue;
                }
                this.setDSOptions(attr, options);
            }
        }
    }
}

module.exports = RedisDS;