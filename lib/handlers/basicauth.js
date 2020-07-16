/**
 * Created by zeqi
 * @description API basic auth 
 * @module Handlers
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File basicauth
 * @Date 17-5-25
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuzeqi2013@gmail.com
 */

'use strict';

let debug = require('debug')('node.common:handlers:basicauth');
debug.log = console.log.bind(console);
let auth = require('basic-auth');
let PolicyHandler = require('./policy');

/**
 * The basic auth handler for http request
 * 
 * @class BasicAuth
 * @extends {PolicyHandler}
 */
class BasicAuth extends PolicyHandler {
    /**
     * Creates an instance of BasicAuth.
     * @param {any} username user name
     * @param {any} password password for user
     * 
     * @memberOf BasicAuth
     */
    constructor(username, password) {
        super();
        this.username = username;
        this.password = password;
    }

    /**
     * 
     * 
     * @returns {String}
     * 
     * @memberOf BasicAuth
     */
    getName() {
        return 'BasicAuth';
    }

    /**
     * 
     * 
     * @param {any} context 
     * @param {any} cont 
     * @returns {any}
     * 
     * @memberOf BasicAuth
     */
    preInvoke(context, cont) {
        let self = this;
        if (!context.bindings || !context.bindings.security ||
            context.bindings.security.auth !== 'BasicAuth') {
            debug('Middleware "' + context.bindings.name + '" does not enable basic-auth');
            return cont();
        }

        let req = context.req;
        let credential = auth(req);
        if (credential && self.username === credential.name && self.password === credential.pass) {
            return cont();
        }

        let err = {
            errorCode: 'E_SECAUTH_0001',
            reason: 'Unauthenticated user',
            httpStatus: 401
        };
        context.res.status(401).json(err);
        cont(err);
    }

    /**
     * 
     * 
     * @param {any} context 
     * @param {any} cont 
     * 
     * @memberOf BasicAuth
     */
    postInvoke(context, cont) {
        cont();
    }
}

module.exports = BasicAuth;
