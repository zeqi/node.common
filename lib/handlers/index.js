/**
 * Created by zeqi
 * @description Handlers Manager
 * @module Handlers
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File index
 * @Date 17-5-25
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuxj4@lenovo.com
 */

'use strict';

let PolicyHandler = require('./policy');
let BasicAuthHandler = require('./basicauth');
let LoggerHandler = require('./logger');
let MonitorHandler = require('./monitor');

module.exports = {
    PolicyHandler: PolicyHandler,
    BasicAuthHandler: BasicAuthHandler,
    LoggerHandler: LoggerHandler,
    MonitorHandler: MonitorHandler
}