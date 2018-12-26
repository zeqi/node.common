/**
 * Created by zeqi
 * @description Array handler
 * @module smart.node.common
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File arrExtend
 * @Date 17-8-4
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuxj4@lenovo.com
 */

'use strict'

/**
 * Array extension class
 * 
 * @class ArrayExtend
 */
class ArrayExtend {
  constructor(arr) {
    this.arr = arr;
  }

  /**
   * Array random ordering
   * 
   * @static
   * @param {Array} arr a array
   * @returns {Array}
   * 
   * @memberOf ArrayExtend
   */
  static randomArr(arr) {
    if (!Array.isArray(arr)) {
      return arr;
    }
    var res = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      var j = Math.floor(Math.random() * arr.length);
      res[i] = arr[j];
      arr.splice(j, 1);
    }
    return res;
  }

  /**
   * Array random ordering
   * 
   * @param {Array} arr a array
   * @returns {Array}
   * 
   * @memberOf ArrayExtend
   */
  randomArr(arr) {
    arr = arr || this.arr;
    return ArrayExtend.randomArr(arr);
  }

  /**
   * Merge the two array and heavy
   * 
   * @static
   * @param {Array} arr1 
   * @param {Array} arr2 
   * @returns {Array}
   * 
   * @memberOf ArrayExtend
   */
  static concat_disRepeat(arr1, arr2) {
    var _arr1 = [], _arr2 = [];
    //不要直接使用var arr = arr1，这样arr只是arr1的一个引用，两者的修改会互相影响  
    if (Array.isArray(arr1)) {
      _arr1 = arr1.concat();
    }
    if (Array.isArray(arr2)) {
      _arr2 = arr2.concat();
    }
    //或者使用slice()复制，var arr = arr1.slice(0)  
    for (var i = 0; i < _arr2.length; i++) {
      _arr1.indexOf(_arr2[i]) === -1 ? _arr1.push(_arr2[i]) : 0;
    }
    return _arr1;
  }

  /**
   * Merge the two array and heavy
   * 
   * @param {Array} arr1 
   * @param {Array} arr2 
   * @returns {Array}
   * 
   * @memberOf ArrayExtend
   */
  concat_disRepeat(arr1, arr2) {
    return ArrayExtend.concat_disRepeat(arr1, arr2);
  }
}

module.exports = ArrayExtend;