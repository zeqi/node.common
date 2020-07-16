/**
 * Created by zeqi
 * @description ORM connection factory
 * @module DS
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File orm
 * @Date 17-12-06
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuzeqi2013@gmail.com
 */

'use strict';

var debug = require('debug')('node.common:ds:orm');
debug.log = console.log.bind(console);
var error = require('debug')('node.common:ds:orm:error');
error.log = console.error.bind(console);
let BaseDS = require('./base');

/**
 * The connection pool for sequelize
 * 
 * @class OrmDS
 * @extends {BaseDS}
 */
class OrmDS extends BaseDS {
    /**
     * Creates an instance of OrmDS.
     * 
     * @memberOf OrmDS
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
     * @memberOf OrmDS
     */
    static checkConf(conf) {
        if (!conf) {
            throw new this.ErrorResult(406, 'sequelize conf invalid');
        }
        return true;
    }

    /**
     * Create sequelize connection and add to db factory
     * 
     * @static
     * @param {any} attr 
     * @param {any} options 
     * 
     * @memberOf OrmDS
     */
    static setDSOptions(attr, options) {
        var method = 'setDSOptions';
        try {
            let Sequelize = require('sequelize');
            var sequelize = new Sequelize(options);
            sequelize.sync({ force: true }).then(data => {
                debug(method, data);
                this.dsMgrt.set(attr, new this.DSOptions(options, sequelize));
                debug(method, attr, 'Orm connection pool initialization completed!');
                return;
            }).catch(err => {
                error(method, 'error:', err);
                throw err;
            });
        }
        catch (err) {
            error(method, err);
            process.exit();
        }
    }

    /**
     * Init sequelize config
     * 
     * @static
     * @param {any} conf 
     * 
     * @memberOf OrmDS
     */
    static init(conf) {
        conf = this.getDSConfByType(this.dsType.orm, conf);
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

module.exports = OrmDS;