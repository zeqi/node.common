/**
* Created by zeqi
* @description Verification code handler
* @module node.common
* @version 1.0.0
* @author Xijun Zhu <zhuzeqi2010@163.com>
* @File verifyCode
* @Date 17-9-26
* @Wechat zhuzeqi2010
* @QQ 304566647
* @Office-email zhuzeqi2013@gmail.com
*/

'use strict';

let debug = require('debug')('node.common:utils:verifyCode');
debug.log = console.log.bind(console);

class VerifyCode {
  /**
   * VerifyCode constructor:timeout 超时时间(Number) default:120000; createTime 创建时间(Date) default: new Date;截取长度(Number) default: 4; attr 验证码属性名 default 'default'
   * @param {Number} timeout 超时时间 default:120000
   * @param {Number} subLen 截取长度 default: 4
   */
  constructor(timeout, subLen) {
    this.default_timeout = 120000;
    this.timeout = timeout || this.default_timeout;
    this.subLen = subLen || subLen === 0 ? subLen : 4;
    this.attr = 'default_verification';
    this.default_error_message = '验证码错误';
    this.default_timeout_message = '验证码超时';
  }

  /*getters & setters start*/
  get timeout() {
    return this._timeout;
  }

  set timeout(timeout) {
    if (!VerifyCode.validateTimeout(timeout)) {
      timeout = this.default_timeout;
    }
    this._timeout = timeout;
  }

  get subLen() {
    return this._subLen;
  }

  set subLen(subLen) {
    if (!(typeof subLen == 'number'))
      subLen = 4;
    this._subLen = subLen;
  }

  get attr() {
    return this._attr;
  }

  set attr(attr) {
    if (!(typeof attr == 'string'))
      attr = String(attr);
    this._attr = attr;
  }

  static validateTimeout(timeout) {
    if (!(typeof timeout == 'number'))
      return false;
    return true;
  }

  validateTimeout(timeout) {
    return VerifyCode.validateTimeout(timeout);
  }

  /*getters & setters end*/

  /**
   * validate attr in session
   * if true will return ''
   * if timeout will return '验证码超时',else if value is not equal will return '验证码错误'
   * so you can judge it by return value's length
   * @param {Object} session
   * @param {string} value validateValue
   * @param {boolean} isRetain
   * @param {String} attr attrName(optional default is 'default')
   */
  checkCode(session, value, isRetain, attr) {
    var method = 'checkCode';
    if (!attr) {
      attr = this.attr;
    }
    if (!session[attr])
      throw { errorCode: 406, message: this.default_error_message };

    let nowTime = new Date().getTime();
    debug(method, 'value', session[attr]);
    var error_message = session[attr]['error_message'] || this.default_error_message;
    var timeout_message = session[attr]['timeout_message'] || this.default_timeout_message;
    if (!(nowTime - session[attr]['attrCreateTime'] <= session[attr]['timeout'])) {
      delete session[attr];
      throw { errorCode: 406, message: timeout_message };
    }
    if (session[attr]['value'] === value) {
      if (!isRetain) {
        delete session[attr];
      }
      return true;
    } else {
      delete session[attr];
      throw { errorCode: 406, message: error_message };
    }
  }

  /**
   * init validateAttr into session
   * session:{
     *  ...
     *  attr:{
     *          value: value,
     *          attrCreateTime: time (timestamp)
     *          timeout: time (ms)
     *      }
     * }
   * @param {Object} session
   * @param {String} value validateValue
   * @param {Number} timeout timeout (ms)
   * @param {String} error_message error message for user
   * @param {String} timeout_message timeout message for user
   * @param {String} attr attrName(optional default is 'default')
   */
  initCode(session, value, timeout, attr, error_message, timeout_message) {
    if (!session)
      throw { errorCode: 500, message: 'Invalid session!' };
    if (!attr)
      attr = this.attr;
    if (!this.validateTimeout(timeout)) {
      timeout = this.default_timeout;
    }
    if (typeof error_message != 'string') {
      error_message = this.default_error_message;
    }
    if (typeof timeout_message != 'string') {
      timeout_message = this.default_timeout_message;
    }

    session[attr] = {};
    session[attr]['value'] = value;
    session[attr]['attrCreateTime'] = (new Date()).getTime();
    session[attr]['timeout'] = timeout;
    session[attr]['error_message'] = error_message;
    session[attr]['timeout_message'] = timeout_message;

    return session;
  }

  /**
   * generate a random code string
   */
  static getRandomCode(subLen) {
    let number = Math.floor(Math.random() * 10000);
    return this.zeroize(number, subLen);
  }

  getRandomCode() {
    return VerifyCode.getRandomCode(this.subLen);
  }

  /**
   * concat random code string
   * @param {Number} value
   * @param {Number} subLen
   */
  static zeroize(value, subLen) {
    let valueString = String(value);

    let zero = '';
    for (let i = 0; i < subLen - valueString.length; i++) {
      zero += '0';
    }
    return zero + valueString;
  }

  zeroize(value, subLen) {
    return VerifyCode.zeroize(value, subLen);
  }

  static get verifyCode() {
    return new VerifyCode();
  }
}

module.exports = VerifyCode;