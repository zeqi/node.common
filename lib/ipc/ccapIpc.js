/**
 * Created by zeqi
 * @description Generate picture verification code using ccap modules
 * @module Helpers
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File ccapIpc
 * @Date 17-9-25
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuzeqi2013@gmail.com
 */

'use strict';

var debug = require('debug')('node.common:ipc:ccap:log');
debug.log = console.log.bind(console);
var error = require('debug')('node.common:ipc:ccap:error');
error.log = console.error.bind(console);
var Q = require('q');

class Ipc {
  constructor() {

  }

  static get DEFAULT_WIDTH() {
    return 256;
  }

  static get DEFAULT_HEIGHT() {
    return 60;
  }

  static get DEFAULT_OFFSET() {
    return 60;
  }

  static get DEFAULT_QUALITY() {
    return 50;
  }

  static randomNum(len) {
    if (!Number(len)) {
      len = 4;
    }
    var randomStr = Math.random().toString();
    return randomStr.substr(randomStr.length - len);
  }

  static optionsHandler(plainText, options) {
    if ((typeof options) != 'object') {
      options = {};
    }

    if (!Number(options.width)) {
      options.width = this.DEFAULT_WIDTH;
    }
    if (!Number(options.height)) {
      options.height = this.DEFAULT_HEIGHT;
    }
    if (!Number(options.offset)) {
      options.offset = this.DEFAULT_OFFSET;
    }
    if (!Number(options.quality)) {
      options.quality = this.DEFAULT_QUALITY;
    }
    if ((typeof options) != 'function') {
      options.generate = () => {
        if ((typeof plainText) == 'string') {
          return plainText;
        }
        return this.randomNum(4);
      }
    }
    return options;
  }

  static getCaptcha(plainText, options, callback) {
    var method = 'getCaptcha';
    return Q.Promise((resolve, reject) => {
      try {
        var ccap = require('ccap');
        options = this.optionsHandler(plainText, options);
        var captcha = ccap(options);
        var ary = captcha.get();
        var verifyText = ary[0];
        var jpegContent = 'data:image/jpg;base64,' + ary[1].toString('base64');
        var result = { content: jpegContent, type: 'jpeg', encoding: 'base64' };
        debug(method, 'generated captcha info:', result);
        return resolve(result);
      }
      catch (err) {
        error(method, err);
        return reject(err);
      }
    }).nodeify(callback);

  }

  getCaptcha(plainText, options, callback) {
    return Ipc.getCaptcha(plainText, options, callback);
  }
}

module.exports = Ipc;