/**
 * Created by zeqi
 * @description Every singleton for Mgrt factory
 * @module Mgrt
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File mapMgrt
 * @Date 17-5-19
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuzeqi2013@gmail.com
 */

'use strict';

// The Map manager
/**
 * The Map manager
 * @constructor
 */
let MapMgrt = (function () {
    var _map = new Map();

    /**
     * Map manager class
     * @class
     * @return {Map}
     */
    class Mgrt {
        /**
         *
         * @param mapName {k} the name map key ex:object|string|number
         * @returns {V}
         * @constructor
         */
        constructor(mapName) {
            this.mapName = mapName;
            if (!_map.has(mapName)) {
                _map.set(mapName, new Map());
            }
            return _map.get(mapName);
        }

        /**
         * Create a Map
         * @param mapName {K}
         * @returns {V}
         * @constructor
         * @static
         * @public
         */
        static CREATE_MAP(mapName) {
            if (!_map.has(mapName)) {
                _map.set(mapName, new Mgrt(mapName));
            }
            return _map.get(mapName);
        }

        /**
         * Get map manager
         * @property {Map}
         * @static
         * @public
         */
        static get GET_MGRT() {
            return _map;
        }

        /**
         * Get all map in this manager
         * @property {Iterator.<V>}
         * @static
         * @public
         */
        static get GET_MAPS() {
            return _map.values();
        }

        /**
         * Get maps size
         * @property {number}
         * @static
         * @public
         */
        static get GET_MAP_SIZE() {
            return _map.size;
        }

        /**
         * Get all names from map manager
         * @property {Iterator.<K>}
         * @static
         * @public
         */
        static get GET_MAP_NAMES() {
            return _map.keys();
        }

        /**
         * Get a map by map name
         * @param mapName {K}
         * @returns {V}
         * @constructor
         * @static
         * @public
         */
        static GET_MAP(mapName) {
            return _map.get(mapName);
        }

        /**
         * Is exists this map ?
         * @param mapName {K}
         * @returns {boolean}
         * @constructor
         * @static
         * @public
         */
        static HAS_MAP(mapName) {
            return _map.has(mapName);
        }

        /**
         * Delete a map by map name
         * @param mapName {K}
         * @returns {boolean}
         * @constructor
         * @static
         * @public
         */
        static DELETE_MAP(mapName) {
            return _map.delete(mapName);
        }

        /**
         * Clear all maps
         * @returns {boolean}
         * @constructor
         * @static
         * @public
         */
        static CLEAR_MAPS() {
            _map.clear();
            return true;
        }
    }
    return Mgrt;
})();

module.exports = MapMgrt;