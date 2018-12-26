/**
 * Created by zeqi
 * @description The base class for db connection pool manager
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

var debug = require('debug')('smart.node.common:ds:base');
debug.log = console.log.bind(console);
let Utils = require('../utils');
let CommonResult = Utils.CommonResult;
let Mgrt = require('../mgrt');
let MapMgrt = Mgrt.MapMgrt;

/**
 * The ds options class for every db connection
 * 
 * @class DSOptions
 */
class DSOptions {
    /**
     * Creates an instance of DSOptions.
     * @param {Object} options DataSource conf
     * @param {any} connection 
     * 
     * @memberOf DSOptions
     */
    constructor(options, connection) {
        this.options = options;
        this.connection = connection;
    }
}

/**
 * The base db handler for every db connection logic
 * 
 * @class BaseDS
 * @extends {CommonResult}
 */
class BaseDS extends CommonResult {
    /**
     * Creates an instance of BaseDS.
     * 
     * @memberOf BaseDS
     */
    constructor() {

    }

    /**
     * 
     * 
     * @readonly
     * @static
     * 
     * @memberOf BaseDS
     */
    static get DSOptions() {
        return DSOptions;
    }

    /**
     * 
     * 
     * @readonly
     * @static
     * 
     * @memberOf BaseDS
     */
    static get dsType() {
        return {
            mongodb: 'mongodb',
            redis: 'redis',
            orm: 'orm'
        }
    }

    /**
     * 
     * 
     * @readonly
     * @static
     * 
     * @memberOf BaseDS
     */
    static get ds_mgrt_name() {
        return 'DataSource';
    }

    /**
     * 
     * 
     * @static
     * 
     * @memberOf BaseDS
     */
    static set dsMgrt(dsMgrt) {
        this._dsMgrt = dsMgrt;
    }

    /**
     * 
     * 
     * @readonly
     * @static
     * 
     * @memberOf BaseDS
     */
    static get dsMgrt() {
        return this._dsMgrt;
    }

    /**
     * 
     * 
     * @static
     * 
     * @memberOf BaseDS
     */
    static set dsConf(dsConf) {
        this._dsConf = dsConf;
    }

    /**
     * 
     * 
     * @readonly
     * @static
     * 
     * @memberOf BaseDS
     */
    static get dsConf() {
        return this._dsConf;
    }

    /**
     * 
     * 
     * @static
     * @param {any} conf 
     * 
     * @memberOf BaseDS
     */
    static initDSMgrt(conf) {
        this.dsConf = conf;
        this.dsMgrt = MapMgrt.CREATE_MAP(this.ds_mgrt_name);
    }

    /**
     * 
     * 
     * @static
     * @param {string} name Data source name
     * @returns {Object}
     * 
     * @memberOf BaseDS
     */
    static getConnection(name) {
        var method = 'getConnection';
        if (!this.dsMgrt) {
            this.initDSMgrt();
        }
        var conn = this.dsMgrt.get(name);
        if (!conn || !(conn instanceof this.DSOptions)) {
            debug(method, 'Not exists connection by name:', name)
            return null;
        }

        return conn.connection;
    }

    /**
     * 
     * 
     * @static
     * @param {any} dsType 
     * @param {any} conf 
     * @returns  {Object}
     * 
     * @memberOf BaseDS
     */
    static getDSConfByType(dsType, conf) {
        if (!this.dsType[dsType]) {
            throw { errorCode: 406, message: 'Not support ' }
        }

        conf = conf || this.dsConf;
        if (typeof conf != 'object') {
            return null;
        }

        var dsConf = {};
        if (conf.dsType) {
            dsConf['default'] = conf;
        }

        for (var attr in conf) {
            if (attr && conf[attr] && conf[attr].dsType && conf[attr].dsType == this.dsType[dsType]) {
                dsConf[attr] = conf[attr];
            }
        }
        return dsConf;
    }

    /**
     * 
     * 
     * @readonly
     * 
     * @memberOf BaseDS
     */
    get dsMgrt() {
        if (!BaseDS.dsMgrt) {
            BaseDS.initDSMgrt();
        }
        return BaseDS.dsMgrt;
    }
}

module.exports = BaseDS;