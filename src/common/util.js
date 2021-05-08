function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

module.exports = {
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
		isEmpty: function (value) {
			return this.isUndefined(value) || value === "" || value === null;
		},
		isUndefined: function (value) {
			return typeof value === "undefined";
		},
		isDefined: function (value) {
			return typeof value !== "undefined";
		},
		isObject: function (value) {
			return value !== null && typeof value === "object";
		},
		isString: function (value) {
			return typeof value === "string";
		},
		isNumber: function (val) {
			var patrn = /^(-)?\d+(\.\d+)?$/;
			if (patrn.exec(val) == null || val === "") {
				return false;
			} else {
				return true;
			}
		},
		isDate: function (value) {
			return toString.call(value) === "[object Date]";
		},
		isArray: function (value) {
			return toString.call(value) == "[object Array]";
		},
		isFunction: function (value) {
			return typeof value === "function";
		},
		isBoolean: function (value) {
			return value === true || value === false;
		},
		isRegExp: function (value) {
			return value instanceof RegExp;
		},
		//正则
		REGEX: {
			PHONE: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
		},
		/**
		 * 缓存
		 * @type {Object}
		 */
		Cache: {
			isString: function (v) {
				return Object.prototype.toString.call(v) == "[object String]";
			},
			get: function (key) {
				var val = localStorage.getItem(key),
					res;
				if (val) {
					try {
						res = JSON.parse(val);
					} catch (e) {
						res = val;
					}
				}
				if (res && res.__TYPE == "SUNSET_CACHE") {
					if (res.type == "OBJECT") {
						try {
							res = JSON.parse(res.value);
						} catch (e) {
							res = res.value;
						}
					} else {
						res = res.value;
					}
				}
				return res;
			},
			put: function (key, value) {
				key += "";
				var cacheItem;
				if (!this.isString(value)) {
					try {
						cacheItem = {
							__TYPE: "SUNSET_CACHE",
							type: "OBJECT",
							value: JSON.stringify(value)
						};
					} catch (e) {
						cacheItem = {
							__TYPE: "SUNSET_CACHE",
							type: "OBJECT",
							value: (value = value ? value.toString() : "")
						};
					}
				} else {
					cacheItem = {
						__TYPE: "SUNSET_CACHE",
						type: "STRING",
						value: value
					};
				}
				return localStorage.setItem(key, JSON.stringify(cacheItem));
			},
			remove: function (key) {
				var res = this.get(key);
				localStorage.removeItem(key);
				return res;
			},
			clear: function () {
				localStorage.clear();
			}
		},
		/**
		 * 日期处理
		 * @type {Object}
		 */
		Dates: {
			reg: {
				yyyy: "getFullYear",
				MM: "getMonth",
				dd: "getDate",
				HH: "getHours",
				hh: "getHours",
				mm: "getMinutes",
				ss: "getSeconds"
			},
			format: function format(date, fmt) {
				fmt = fmt || "yyyy-MM-dd HH:mm:ss";
				if (!isNaN(date)) {
					var d = new Date(date),
						reg = this.reg;
					for (var k in reg) {
						var v;
						if (reg.hasOwnProperty(k)) {
							v = d[reg[k]]();
							if (k == "MM") {
								v++;
							}
							if (k != "yyyy" && v < 10) {
								v = "0" + v;
							}
							fmt = fmt.replace(k, v);
						}
					}
					return fmt;
				} else {
					return "";
				}
			},
			parse: function (str) {
				//根据日期字符串转换成日期
				var regEx = new RegExp("\\-", "gi");
				str = str.replace(regEx, "/");
				var milliseconds = Date.parse(str);
				var dependedDate = new Date();
				dependedDate.setTime(milliseconds);
				return dependedDate;
			},
			fromNow: function (date) {
				if (!(date instanceof Date)) {
					date = new Date(date);
				}
				var now = new Date(),
					pass = now - date;
				if (pass <= 5 * 60 * 1000) {
					return "刚刚";
				} else if (pass <= 30 * 60 * 1000) {
					return Math.round(pass * 1.0 / 60000) + "分钟前";
				} else {
					return this.format(date, "yyyy-MM-dd HH:mm:ss");
				}
			}
		},
		Numbers: {
			fixed: function (value, digits) {
				digits = digits || 0;
				var v, res;
				try {
					v = +value;
					if (!isNaN(v)) {
						if (digits == 0) {
							res = Math.round(v);
						} else {
							res = v.toFixed(digits);
						}
					} else {
						if (digits == 0) {
							res = 0;
						} else {
							res = (0).toFixed(digits);
						}
					}
				} catch (e) {
					if (digits == 0) {
						res = 0;
					} else {
						res = (0).toFixed(digits);
					}
				}
				return res;
			}
		},
		/**
		 * 字符串操作工具
		 */
		Strings: {
			toCamelCase(str) {
				return Sunset.isString(str) ?
					str.replace(new RegExp("\\-(\\w)", "g"), function (all, letter) {
						return letter.toUpperCase();
					}) :
					str;
			},
			toHyphenate(str) {
				return Sunset.isString(str) ? str.replace(new RegExp("([A-Z])", "g"), "-$1").toLowerCase() : str;
			},
			removeAsSpliter: function (str, obj, spliter) {
				var spliter = spliter === void 0 ? "," : spliter;
				var list = str.split(spliter);
				list.splice(list.indexOf(obj), 1);
				return list.join(spliter);
			},
			serialize: function (data) {
				return Object.keys(data)
					.map(function (keyName) {
						return encodeURIComponent(keyName) + "=" + encodeURIComponent(data[keyName]);
					})
					.join("&");
			}
		},
		//数组操作工具
		Arrays: {
			/**
			 * 添加全部
			 * @param {[type]} arr1 [description]
			 * @param {[type]} arr2 [description]
			 */
			addAll: function (arr1, arr2) {
				if (arr2 && arr2.length) {
					[].push.apply(arr1, arr2);
				}
				return arr1;
			},
			/**
			 * 去重
			 * @param  {[type]} arr [description]
			 * @param  {[type]} key [description]
			 * @return {[type]}     [description]
			 */
			uniq: function (arr, key) {
				if (arr && arr.length) {
					var hash = {},
						res = [],
						temp,
						id;
					for (var i = 0, l = arr.length; i < l; i++) {
						temp = arr[i];
						id = key ? utils.getAttribute(temp, key) : temp;
						if (!hash[id]) {
							hash[id] = true;
							res.push(temp);
						}
					}
					return res;
				} else {
					return arr;
				}
			},
			remove: function (arr, obj) {
				if (arr && arr.length && obj) {
					for (var i = 0, l = arr.length; i < l; i++) {
						if (arr[i] == obj) {
							arr.splice(i, 1);
							break;
						}
					}
				}
			},
			filter: function (items, cb) {
				if (!items || items.length == 0) {
					return null;
				}
				if (typeof cb != "function") {
					throw new Error("filter arguments[1] is not a function");
				}
				var res = [];
				for (var i = 0, l = items.length; i < l; i++) {
					if (cb(items[i])) {
						res.push(items[i]);
					}
				}
				return res;
			},
			filterOne: function (items, cb) {
				if (!items || items.length == 0) {
					return null;
				}
				if (typeof cb != "function") {
					throw new Error("filter arguments[1] is not a function");
				}
				for (var i = 0, l = items.length; i < l; i++) {
					if (cb(items[i])) {
						return items[i];
					}
				}
			},
			forEach: function (items, cb) {
				if (!items || items.length == 0) {
					return null;
				}
				if (typeof cb != "function") {
					throw new Error("filter arguments[1] is not a function");
				}
				for (var i = 0, l = items.length; i < l; i++) {
					cb(items[i], i);
				}
				return items;
			},
			some: function (items, cb) {
				if (!items || items.length == 0) {
					return null;
				}
				if (typeof cb != "function") {
					throw new Error("filter arguments[1] is not a function");
				}
				for (var i = 0, l = items.length; i < l; i++) {
					if (cb(items[i], i)) {
						return true;
					}
				}
				return false;
			},
			map: function (arr, cb) {
				var res = [];
				if (arr && arr.length) {
					for (var i = 0, l = arr.length; i < l; i++) {
						res.push(cb(arr[i]));
					}
				}
				return res;
			},
			merge: function (mergeTo, mergeFrom, compare) {
				var item,
					jitem,
					isNew = true;
				compare =
					compare ||
					function (obj1, obj2) {
						return obj1 === obj2;
					};
				if (mergeTo && mergeFrom && compare) {
					for (var i = 0, l = mergeFrom.length; i < l; i++) {
						item = mergeFrom[i];
						isNew = true;
						for (var j = 0, jl = mergeTo.length; j < jl; j++) {
							jitem = mergeTo[j];
							if (compare(item, jitem)) {
								isNew = false;
								mergeTo.splice(j, 1, item);
							}
						}
						isNew && mergeTo.push(item);
					}
				}
				return mergeTo;
			},
			findIndex(items, find) {
				if (!items || items.length == 0) {
					return -1;
				}
				if (typeof find != "function") {
					throw new Error("filter arguments[1] is not a function");
				}
				for (var i = 0, l = items.length; i < l; i++) {
					if (find(items[i])) {
						return i;
					}
				}
				return -1;
			}
		},
		Objects: {
			each: function (obj, cb) {
				if (obj) {
					var key;
					for (key in obj) {
						if (obj.hasOwnProperty(key)) {
							cb(obj[key], key, obj);
						}
					}
				}
			}
		},
		clone: function (obj) {
			if (typeof obj != "object" || Sunset.isDate(obj) || obj === null || obj === void 0) return obj;
			var re;
			if (obj.constructor == Array) {
				re = [];
			} else {
				re = {};
			}
			for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
					re[i] = Sunset.clone(obj[i]);
				}
			}
			return re;
		},
		//获取命名空间下属性
		getAttribute: function (parent, namespace, defaultResult) {
			if (parent && namespace) {
				var ns = namespace.split(".");
				var obj = parent;
				for (var i = 0, l = ns.length; i < l; i++) {
					obj = obj[ns[i]];
					if (obj == null || obj == void 0) {
						return defaultResult;
					}
				}
				return obj;
			}
			return defaultResult;
		},
		//设置命名空间下的属性
		setAttribute: function (parent, namespace, value) {
			var lio,
				obj = parent;
			if ((lio = namespace.lastIndexOf("."))) {
				var ns = namespace.split("."),
					obj = parent,
					attrName = namespace.substring(lio + 1);
				for (var i = 0, l = ns.length - 1; i < l; i++) {
					if (obj[ns[i]] == null || obj[ns[i]] === void 0) {
						obj[ns[i]] = {};
					}
					obj = obj[ns[i]];
				}
				obj[attrName] = value;
			} else {
				obj[namespace] = value;
			}
		},
		getCookie: function (name) {
			var arr,
				reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
			if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
			else return null;
		},
		/**
		 * 获取URL参数
		 * @param  {[type]} name [description]
		 * @return {[type]}      [description]
		 */
		getQueryString: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		wait: function (promiseFactory, cacheHolder, cacheKey) {
			var lock = false,
				resolveStack = [],
				cacheKey = cacheKey || "cache";
			cacheHolder = cacheHolder || {};
			return function (force) {
				var self = this,
					args = [].slice.call(arguments);
				return new Promise((resolve, reject) => {
					if (!force && cacheHolder[cacheKey]) {
						resolve(cacheHolder[cacheKey]);
					} else {
						resolveStack.push({
							resolve: resolve,
							reject: reject
						});
						if (!lock) {
							lock = true;
							promiseFactory
								.apply(self, args)
								.then(res => {
									cacheHolder[cacheKey] = res;
									lock = false;
									while (resolveStack.length) {
										resolveStack.shift().resolve(res);
									}
								})
								.catch(err => {
									lock = false;
									while (resolveStack.length) {
										resolveStack.shift().reject(err);
									}
								});
						}
					}
				});
			};
		},
		debounce: function (fn, delay) {
			let timer = null;
			return function () {
				let context = this;
				let args = arguments;
				clearTimeout(timer);
				timer = setTimeout(function () {
					fn.apply(context, args);
				}, delay);
			};
		},
		debounce: function debouce(func, delay, immediate) {
			var timer = null;
			return function () {
				var context = this;
				var args = arguments;
				if (timer) clearTimeout(timer);
				if (immediate) {
					var doNow = !timer;
					timer = setTimeout(function () {
						timer = null;
					}, delay);
					if (doNow) {
						func.apply(context, args);
					}
				} else {
					timer = setTimeout(function () {
						func.apply(context, args);
					}, delay);
				}
			};
		},
		throttle: function (func, delay) {
			var timer = null;
			var startTime = Date.now();
	
			return function () {
				var curTime = Date.now();
				var remaining = delay - (curTime - startTime);
				var context = this;
				var args = arguments;
	
				clearTimeout(timer);
				if (remaining <= 0) {
					func.apply(context, args);
					startTime = Date.now();
				} else {
					timer = setTimeout(func, remaining);
				}
			};
		}
	};
