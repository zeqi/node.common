/**
 * Created by zeqi
 * @description Generator code
 * @module Task
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File generator
 * @Date 18-2-24
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuzeqi2013@gmail.com
 */
var fs = require('fs');
var path = require('path');

class Task {
  constructor() {

  }

  static Generator(opts) {
    var self = this;
    var template = null;
    if (opts && opts.template) {
      template = path.join(process.cwd(), opts.template);
    }
    var through = require('through2');
    return through.obj(function (file, enc, cb) {
      if (file.isNull()) {
        this.push(file);
        return cb();
      }

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
        return cb();
      }

      if (template) {
        var definition = require(file.history[0].toString());
        var _template = fs.readFileSync(template, 'utf-8');
        var mustache = require('mustache');
        var source = mustache.render(_template, definition);
        var beautify = require('js-beautify').js_beautify;
        source = beautify(source, { indent_size: 4, max_preserve_newlines: 2 });
        file.contents = new Buffer(source);
      }

      this.push(file);
      cb()
    });
  }
}

module.exports = Task;
