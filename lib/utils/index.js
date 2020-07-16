/**
 * Created by zeqi
 * @description Utils manager
 * @module node.common
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File index
 * @Date 17-5-22
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuzeqi2013@gmail.com
 */

'use strict';

let CommonResult = require('./commonResult');
let ArrayExtend = require('./arrExtend');
let VerifyCode = require('./verifyCode');
let Task = require('./task');

module.exports = {
    CommonResult: CommonResult,
    ArrayExtend: ArrayExtend,
    VerifyCode: VerifyCode,
    Task: Task
}