/**
 * Created by zeqi
 * @description Http request logger
 * @module Handlers
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File logger
 * @Date 17-6-15
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuzeqi2013@gmail.com
 */

'use strict';

let logger = require('debug')('node.common:handlers:logger');
logger.log = console.log.bind(console);
let PolicyHandler = require('./policy');

/**
 * The logger handler for http request
 * 
 * @class SimpleLogger
 * @extends {PolicyHandler}
 */
class SimpleLogger extends PolicyHandler {
	/**
	 * Creates an instance of SimpleLogger.
	 * 
	 * @memberOf SimpleLogger
	 */
	constructor() {
		super();
	}

	/**
	 * 
	 * 
	 * @param {any} context 
	 * @param {any} cont 
	 * 
	 * @memberOf SimpleLogger
	 */
	preInvoke(context, cont) {
		let now = new Date();

		let protocol = context.req.protocol;
		if (context.req.headers && context.req.headers['x-forwarded-protocol']) {
			protocol = context.req.headers['x-forwarded-protocol'];
		}

		logger('[Entry] resource-path: <'
			+ context.req.originalUrl
			+ '>; protocol: <'
			+ protocol
			+ '>; method: <'
			+ context.req.method
			+ '>; sessionId: <'
			+ ((context.req.session) ? context.req.session.id : '-')
			+ '>; middleware-fn: <'
			+ context.bindings.name
			+ '> @' + now.toISOString());
		cont();
	}

	/**
	 * 
	 * 
	 * @param {any} context 
	 * @param {any} cont 
	 * 
	 * @memberOf SimpleLogger
	 */
	postInvoke(context, cont) {
		let now = new Date();
		let protocol = context.req.protocol;
		if (context.req.headers && context.req.headers['x-forwarded-protocol']) {
			protocol = context.req.headers['x-forwarded-protocol'];
		}
		logger('[Exit] resource-path: <'
			+ context.req.originalUrl
			+ '>; protocol: <'
			+ protocol
			+ '>; method: <'
			+ context.req.method
			+ '>; statusCode: <'
			+ ((context.res.statusCode) ? context.res.statusCode : '-')
			+ '>; sessionId: <'
			+ ((context.req.session) ? context.req.session.id : '-')
			+ '>; middleware-fn: <'
			+ context.bindings.name
			+ '> @' + now.toISOString());
		cont();
	}

	/**
	 * 
	 * 
	 * @returns {String}
	 * 
	 * @memberOf SimpleLogger
	 */
	getName() {
		return 'SimpleLogger';
	}
}

module.exports = exports = SimpleLogger;