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
 * @Office-email zhuxj4@lenovo.com
 */

'use strict';

let uuid = require('uuid');
let debug = require('debug');
let log = debug('smart.node.common:handlers:monitor:log');
let error = debug('smart.node.common:handlers:monitor:error');
log.log = console.log.bind(console);
error.log = console.error.bind(console);
let PolicyHandler = require('./policy');
let DataHelper = require('../helpers').DataHelper;

/**
 * The logger handler for http request
 * 
 * @class ApiMonitor
 * @extends {PolicyHandler}
 */
class ApiMonitor extends PolicyHandler {
	/**
   * Creates an instance of ApiMonitor.
   * @param {any} platform 
   * @param {any} monitorService 
   * 
   * @memberof ApiMonitor
   */
  constructor(platform, monitorService) {
    super();
    this.platform = platform;
    this.monitorData = monitorService;
  }

  /**
   * Current monitor event
   * 
   * @readonly
   * @static
   * 
   * @memberof ApiMonitor
   */
  static get EventName() {
    return 'HttpEvent';
  }

  /**
   * Set platform info
   * 
   * @static
   * 
   * @memberof ApiMonitor
   */
  static set platform(platform) {
    this._platform = platform;
  }

  /**
   * Get platform info
   * 
   * @static
   * 
   * @memberof ApiMonitor
   */
  static get platform() {
    return this._platform;
  }

  /**
   * Set a service for monitor handler
   * 
   * @static
   * 
   * @memberof ApiMonitor
   */
  static set monitorData(service) {
    if (!(service instanceof DataHelper)) {
      throw new Error('Invalid Monitor data service');
    }
    this._monitorData = service;
  }

  /**
   * Get this monitor handler service
   * 
   * @static
   * 
   * @memberof ApiMonitor
   */
  static get monitorData() {
    return this._monitorData;
  }

  /**
   * 
   * 
   * 
   * @memberof ApiMonitor
   */
  set platform(platform) {
    ApiMonitor.platform = platform;
  }

  /**
   * 
   * 
   * @readonly
   * 
   * @memberof ApiMonitor
   */
  get platform() {
    return ApiMonitor.platform;
  }

  /**
   * 
   * 
   * 
   * @memberof ApiMonitor
   */
  set monitorData(service) {
    ApiMonitor.monitorData = service;
  }

  /**
   * 
   * 
   * @readonly
   * 
   * @memberof ApiMonitor
   */
  get monitorData() {
    return ApiMonitor.monitorData;
  }

  /**
	 * Restful HTTP begin event
	 * @param {object} context, the context data structure is as below:
	 *   {
	 *      req: req,
	 *      res: res
	 *   }
	 *
	 * @param {function} done(error), if error is given, stop the call chain
	 * return the error immediately
	 *
	 */
  begin(context, done) {
    let method = 'begin';
    var req = context.req;
    let protocol = req.protocol;
    if (req.headers && req.headers['x-forwarded-protocol']) {
      protocol = req.headers['x-forwarded-protocol'];
    }
    let hostname = req.ip;
    if (req.headers['x-forwarded-for']) {
      hostname = req.headers['x-forwarded-for'];
    }
    let traceEvent = {
      system: ApiMonitor.platform,
      eventId: uuid.v4(),
      eventType: ApiMonitor.EventName,
      enterTime: new Date(),
      exitTime: null,
      duration: null,
      user: {},
      data: {
        sessionId: (req.session) ? req.session.id : null,
        method: req.method,
        pathname: req._parsedUrl.pathname,
        url: req.url,
        protocol: protocol,
        hostname: hostname,
        headers: req.headers,
        httpVersion: req.httpVersion,
        params: JSON.stringify(req.params),
        query: JSON.stringify(req.query),
        body: req.body,
        statusCode: null,
        statusMessage: null
      },
      callStack: []
    }
    var user = req.session.user;
    if (user) {
      traceEvent.user = {
        id: user._id,
        username: user.username
      }
    }
    context.res._monitor_context = traceEvent;
    done();
  }


	/**
	 * Restful HTTP end event
	 * @param {object} context, the context data structure is as below:
	 *   {
	 *      req: req,
	 *      res: res
	 *   }
	 *
	 * @param {function} done(error), if error is given, stop the call chain
	 * return the error immediately
	 *
	 */
  end(context, done) {
    var method = 'end';
    var req = context.req;
    var res = context.res;

    var traceEvent = res._monitor_context;
    if (!traceEvent) {
      done();
    }
    var exitTime = new Date();

    traceEvent.exitTime = exitTime;
    traceEvent.duration = exitTime - traceEvent.enterTime;
    if (traceEvent.data) {
      traceEvent.data.statusCode = res.statusCode;
      traceEvent.data.statusMessage = res.statusMessage;
    }

    ApiMonitor.monitorData.post(traceEvent).then(data => {
      log(method, 'data', data);
      return data;
    }).fail(err => {
      error(method, 'error', err);
      return;
    });
    delete res._monitor_context;
    done();
  }

  /**
   * 
   * 
   * @param {any} context 
   * @param {function} cont 
   * 
   * @memberOf ApiMonitor
   */
  preInvoke(context, cont) {
    let method = 'preInvoke';
    var req = context.req;
    var res = context.res;

    var entryCall = {
      type: method,
      middleware: context.bindings.name,
      time: new Date()
    };

    if (res._monitor_context && Array.isArray(res._monitor_context.callStack)) {
      res._monitor_context.callStack.push(entryCall);
    }
    cont();
  }

  /**
   * 
   * 
   * @param {any} context 
   * @param {function} cont 
   * 
   * @memberOf ApiMonitor
   */
  postInvoke(context, cont) {
    let method = 'postInvoke';
    var req = context.req;
    var res = context.res;

    var entryCall = {
      type: method,
      middleware: context.bindings.name,
      time: new Date()
    };

    if (res._monitor_context && Array.isArray(res._monitor_context.callStack)) {
      res._monitor_context.callStack.push(entryCall);
    }
    cont();
  }

  /**
   * 
   * 
   * @returns {String}
   * 
   * @memberOf ApiMonitor
   */
  getName() {
    return 'ApiMonitor';
  }
}

module.exports = exports = ApiMonitor;