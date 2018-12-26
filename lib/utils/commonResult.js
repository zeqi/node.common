/**
 * Created by zeqi
 * @description Result handler
 * @module smart.node.common
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File commonResult
 * @Date 17-5-22
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuxj4@lenovo.com
 */

'use strict';

/**
 * Normal result class
 * 
 * @class NormalResult
 */
class NormalResult {
    /**
     * Creates an instance of NormalResult.
     * @param {any} result 
     * @param {any} code 
     * @param {any} message 
     * @param {any} status 
     * 
     * @memberOf NormalResult
     */
    constructor(result, code, message, status) {
        this.result = result;
        this.code = code;
        this.message = message;
        this.status = status;
    }

    /**
     * 
     * 
     * @static
     * 
     * @memberOf NormalResult
     */
    static get status() {
        return {
            ok: 'ok',
            warning: 'warning',
            error: 'error'
        }
    }

    /**
     * 
     * 
     * 
     * @memberOf NormalResult
     */
    set status(status) {
        this._status = status;
        if (!status || !Result.status[status.toString()]) {
            this._status = Result.status.ok;
        }
    }

    /**
     * 
     * 
     * @readonly
     * 
     * @memberOf NormalResult
     */
    get status() {
        return this._status;
    }
}

/**
 * Error result class
 * 
 * @class ErrorResult
 */
class ErrorResult {
    /**
     * Creates an instance of ErrorResult.
     * @param {any} errorCode 
     * @param {any} message 
     * 
     * @memberOf ErrorResult
     */
    constructor(errorCode, message) {
        this.errorCode = errorCode;
        this.message = message;
    }

    /**
     * 
     * 
     * @static
     * 
     * @memberOf ErrorResult
     */
    static get errorCode() {
        return {
            error_406: 406,
            error_500: 500
        }
    }

    /**
     * 
     * 
     * 
     * @memberOf ErrorResult
     */
    set errorCode(errorCode) {
        this._errorCode = errorCode;
        if (!errorCode || !ErrorResult.errorCode[errorCode.toString()]) {
            this._errorCode = ErrorResult.errorCode.error_406;
        }
    }

    /**
     * 
     * 
     * @readonly
     * 
     * @memberOf ErrorResult
     */
    get errorCode() {
        return this._errorCode;
    }
}

/**
 * Common result class manager for every result class
 * 
 * @class CommonResult
 */
class CommonResult {
    /**
     * Creates an instance of CommonResult.
     * @param {any} errorCode 
     * @param {any} message 
     * 
     * @memberOf CommonResult
     */
    constructor(errorCode, message) {
        this.errorCode = errorCode;
        this.message = message;
    }

    /**
     * 
     * 
     * @readonly
     * @static
     * 
     * @memberOf CommonResult
     */
    static get NormalResult() {
        return NormalResult;
    }

    /**
     * 
     * 
     * @readonly
     * 
     * @memberOf CommonResult
     */
    get NormalResult() {
        return CommonResult.NormalResult;
    }

    /**
     * 
     * 
     * @readonly
     * @static
     * 
     * @memberOf CommonResult
     */
    static get ErrorResult() {
        return ErrorResult;
    }

    /**
     * 
     * 
     * @static
     * @param {any} errorCode 
     * @param {any} message 
     * @returns {ErrorResult}
     * 
     * @memberOf CommonResult
     */
    static errorResult(errorCode, message) {
        return new this.ErrorResult(errorCode, message);
    }

    /**
     * 
     * 
     * @readonly
     * 
     * @memberOf CommonResult
     */
    get ErrorResult() {
        return CommonResult.ErrorResult;
    }

    /**
     * 
     * 
     * @param {any} errorCode 
     * @param {any} message 
     * @returns {ErrorResult}
     * 
     * @memberOf CommonResult
     */
    errorResult(errorCode, message) {
        return new this.ErrorResult(errorCode, message);
    }
}

module.exports = CommonResult;