var typeCheckUtil = {
    isString: function(value) {
        return typeof value === 'string';
    },
    isBoolean: function(value) {
        return typeof value === 'boolean';
    },
    isNumber: function(value) {
        return typeof value === 'number';
    },
    isUndefined: function(value) {
        return typeof value === undefined;
    },
    isNull: function(value) {
        return value === null;
    },
    isObject: function(value) {
        if (value === null) {
            return false;
        } else if (typeof value === 'function' || typeof value === 'object') {
            return true;
        }
    },
    isPlainObject: function(value) {
        if (!typeCheckUtil.isObject(value)) {
            return false;
        }

        var constructor;
        var prototype;

        try {
            constructor = obj.constructor;
            prototype = constructor.prototype;

            return constructor && prototype && prototype.hasOwnProperty('isPrototypeOf');
        } catch (e) {
            return false;
        }
    },
    isArray: function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    },
    isFunction: function(value) {
        return Object.prototype.toString.call(value) === '[object Function]';
    },
    isRegExp: function(value) {
        return Object.prototype.toString.call(value) === '[object RegExp]';
    },
    // 检测 JSON 对象是否使用的是原生的（有些框架提供了自己的 JSON 对象）
    isNativeJSON: function() {
        return window.JSON && Object.prototype.toString.call(JSON) === '[object JSON]';
    }
};
var stringUtil = {
    trim: function(str) {
        if (typeCheckUtil.isString(str)) {
            str = str.trim ? str.trim() : str.replace(/(^\s*)/g,"").replace(/(\s*$)/g,"");
        }
        return str;
    },
    trimLeft: function(str) {
        if (typeCheckUtil.isString(str)) {
            str = str.trimLeft ? str.trimLeft() : str.replace(/(^\s*)/g,"");
        }
        return str;
    },
    trimRight: function(str) {
        if (typeCheckUtil.isString(str)) {
            str = str.trimRight ? str.trimRight() : str.replace(/(^\s*)/g,"").replace(/(\s*$)/g,"");
        }
        return str;
    },
    hyphenate: function (str) {
        // 将字母的大写与小写数字之间以连字符隔开，并全部小写化
        var REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;
        return str.replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
    }
};

var client = (function() {
    var engine = {};

    var browser = {};

    var system = {
        win: false,
        max: false,
        x11: false,
        ios: false,
        android: false,

        iphone: false,
        ipod: false,
        ipad: false,
        nokiaN: false,
        winMobile: false,

        wii: false,
        ps: false
    };

    var ua = navigator.userAgent;
    if (window.opera) {
        engine.ver = browser.ver = window.opera.version();
        engine.type = browser.type = "Opera";
    } else if (/AppleWebKit\/(\S+)/.test(ua)) {
        engine.ver = RegExp['$1'];
        engine.type = "webkit";

        // 确定是 Chrome 还是 Safari 还是 Edge
        if (/Edge\/(\S+)/.test(ua)) {
            engine.ver = browser.ver = 'Edge';
            engine.type = browser.type = 'Edge';
        } else if (/Chrome\/(\S+)/.test(ua)) {
            browser.ver = RegExp['$1'];
            browser.type = "Chorme";
        } else if (/Version\/(\S+)/.test(ua)) {
            browser.ver = RegExp['$1'];
            browser.type = "Safari";
        } else {
            // 近似地确定版本号
            var safariVersion = 1;
            if (engine.webkit < 100) {
                safariVersion = 1;
            } else if (engine.webkit < 312) {
                safariVersion = 1.2;
            } else if (engine.webkit < 412) {
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }

            browser.ver = safariVersion;
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/(\S+)/.test(ua)) {
        engine.ver = browser.ver = RegExp['$1'];
        engine.type = browser.type = "Khtml";
    } else if (/rv:(\S+)+\) Gecko\/\d{8}/.test(ua)) {
        engine.ver = RegExp['$1'];
        engine.type = "gecko";

        // 确定是不是 Firefox
        if (/Firefox\/(\S+)/.test(ua)) {
            browser.ver = RegExp['$1'];
            browser.type = "Firefox";
        }
    } else if (/MSIE ([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp['$1'];
        engine.type = browser.type = "IE";
    } else if (/rv:(\S+)+\) like Gecko/) {
        engine.ver = browser.ver = RegExp['$1'];
        engine.type = browser.type = "IE";
    }

    // 检测平台
    var p = navigator.platform;
    system.win = p.indexOf('Win') == 0;
    system.mac = p.indexOf('Mac') == 0;
    system.x11 = (p == 'X11') || (p.indexOf('Linux') == 0);

    // 检测 windows 操作系统
    if (system.win) {
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
            if (RegExp['$1'] == 'NT') {
                switch (RegExp['$2']) {
                    case '5.0':
                        system.win = '2000';
                        break;
                    case '5.1':
                        system.win = 'XP';
                        break;
                    case '6.0':
                        system.win = 'Vista';
                        break;
                    case '6.1':
                        system.win = '7';
                        break;
                    case '6.2':
                        system.win = '8';
                        break;
                    case '10.0':
                        system.win = '10';
                        break;
                    default:
                        system.win = 'NT';
                        break;
                }
            } else if (RegExp['$1'] == '9x') {
                system.win = 'ME';
            } else {
                system.win = RegExp['$1'];
            }
        }
    }

    // 检测 macOS 版本号
    if (system.mac && ua.indexOf('Mobile') == -1) {
        if (/Mac (?:OS )?X (\d+_\d+_\d+)/.test(ua)) {
            system.mac = RegExp.$1.replace(/\_/g, '.');
        } else {
            system.mac = true; // 在无法获取版本号的情况下至少确定平台
        }
    }

    // 移动设备
    system.iphone = ua.indexOf('iPhone') > -1;
    system.ipad = ua.indexOf('iPad') > -1;
    system.ipod = ua.indexOf('iPod') > -1;
    system.nokiaN = ua.indexOf('NokiaN') > -1;

    // windows mobile
    if (system.win == 'CE') {
        system.winMobile = system.win;
    } else if (system.win == 'Ph') {
        if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
            system.win = 'Phone';
            system.winMobile = parseFloat(RegExp['$1']);
        }
    }

    // 检测 iOS 版本
    if (system.mac && ua.indexOf('Mobile') > -1) {
        if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
            system.ios = parseFloat(RegExp.$1.replace('_', '.'));
            system.mac = false;
        } else {
            system.ios = true; // 在无法获取版本号的情况下至少确定平台
            system.mac = false;
        }
    }

    // 检测安卓版本
    if (/Android (\d+\.\d+)/.test(ua)) {
        system.android = parseFloat(RegExp.$1);
    }

    // 游戏系统
    system.wii = ua.indexOf('Wii') > -1;
    system.ps = /playstation/i.test(ua);

    var temp = {};
    for (var prop in system) {
        if (!!system[prop]) {
            temp.type = prop;
            if (typeof system[prop] == "string" || typeof system[prop] == "number") {
                temp.ver = system[prop];
            } else {
                temp.ver = "can't define the version the system";
            }
        }
    }

    // return
    return {
        engine: engine,
        browser: browser,
        system: temp
    };
})();

var otherUtil = {
    each: function (obj, fn) {
        // fn 函数能接受三个参数：obj[i]/prop, i, obj
        if (obj && typeCheckUtil.isFunction(fn)) {
            if (typeCheckUtil.isArray(obj) || typeCheckUtil.isNumber(obj.length)) {
                for (var index = 0, len = obj.length; index < len; index++ ) {
                    fn.call(obj, obj[index], index, obj);
                }
            } else if (typeCheckUtil.isObject(obj)) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        fn.call(obj, obj[prop], prop, obj);
                    }
                }
            }
        }
        return obj;
    },
    proxy: function (fn, context) {
        var args = arrayUtil.toArray(arguments, 2);

        return function () {
            // 这里的 arguments 不是上面的 args 哦，而是 ↖️ 返回函数调用时传入的参数
            return fn.apply(context, args.concat(arrayUtil.toArray(arguments)));
        };
    }
};

var arrayUtil = {
    each: otherUtil.each,
    inArray: function (value, arr) {
        var index = -1;
        if (arr.indexOf) {
            return arr.indexOf(value);
        } else {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] === value) {
                    index = i;
                    break;
                }
            }
            return index;
        }
    },
    toArray: function (obj, offset) {
        offset = offset >= 0 ? offset : 0;
        if (Array.from) {
            // Array.from: convert an obj or an array-like obj to an array
            return Array.from(obj).slice(offset);
        }

        return slice.call(obj, offset);
    },
    deduplication: function (arr1) {
        if (Array.from && !!(new Set())) {
            return Array.from(new Set(arr1));
        } else if (Array.prototype.filter) {
            return arr1.filter(function(item, pos, self) {
                return self.indexOf(item) == pos;
            });
        } else {
            var seen = {};
            var out = [];
            var len = a.length;
            var j = 0;
            for(var i = 0; i < len; i++) {
                var item = a[i];
                if(seen[item] !== 1) {
                    seen[item] = 1;
                    out[j++] = item;
                }
            }
            return out;
        }
    }
};

var DOMUtil = {
    getElement: function(selector, parentElement) {
        if (!parentElement) {
            parentElement = document;
        }
        var isId = (stringUtil.trim(selector).indexOf('#') === 0),
            isClass = (stringUtil.trim(selector).indexOf('.') === 0);
        switch (true) {
            case isId:
                return parentElement.querySelector ? parentElement.querySelector(selector) : parentElement.getElementById(selector);
            case isClass:
                return parentElement.querySelectorAll ? parentElement.querySelectorAll(selector) : parentElement.getElementsByClassName(selector);
            default:
                return parentElement.querySelectorAll ? parentElement.querySelectorAll(selector) : parentElement.getElementsByTagName(selector);
        }
    },

    getFirstElementChild: function(element){
        for (var nodes = element.childNodes, node, i = 0, len = nodes.length; i < len; i++) {
            node = nodes[i];
            if (node.nodeType === 1) {
                return node;
            }
        }
        return null;
    },

    getLastElementChild: function(){
        for(var nodes = this.childNodes, node, i = nodes.length - 1; i >= 0; --i) {
            node = nodes[i];
            if(1 === node.nodeType) {
                return node;
            }
        }
        return null;
    },

    getNextElementSibling: function(element) {
        if (document.body.nextElementSibling) {
            return element.nextElementSibling;
        } else {
            do { element = element.nextSibling } while ( element && element.nodeType !== 1 );
            return element;
        }
    },

    getPrevElementSibling: function(element) {
        if (document.body.previousElementSibling) {
            return element.previousElementSibling;
        } else {
            do { element = element.previousSibling } while ( element && element.nodeType !== 1 );
            return element;
        }
    },

    traverseElement: function(element, process) {
        var i,
            len,
            child;

        if (!!element.firstElementChild) {
            child = element.firstElementChild;

            while (child != element.lastElementChild) {
                process(child);
                child = child.nextElementSibling;
            }

            process(child);
        } else {
            child = element.firstChild;
            while (child != element.lastChild) {
                if (child.nodeType == 1) {
                    process(child);
                }
                child = child.nextSibling;
            }
        }
    },
    serializeForm: function (form) {
        if (!form || form.nodeName.toLowerCase() !== "FORM".toLowerCase()) {
            throw new Error('serialize(): The only arg must be form element!')
        }

        var parts = [],
            field = null,
            i,
            len,
            j,
            optLen,
            option,
            optValue;

        for (i = 0, len = form.elements.length; i < len; i++) {
            field = form.elements[i];

            if (field.name === '') {
                continue;
            }

            switch(field.type) {
                case 'select-one':
                case 'select-multiple':
                    for (j = 0, optLen = field.options.length; j < optLen; j++) {
                        option = field.options[j];
                        if (option.selected) {
                            optValue = '';
                            if (option.hasAttribute) {
                                optValue = (option.hasAttribute('value') ? option.value : option.text);
                            } else {
                                optValue = (option.attributes['value'].specified ? option.value : option.text);
                            }

                            parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(optValue));
                        }
                    }
                    break;
                case undefined:
                case 'file':
                case 'submit':
                case 'reset':
                case 'button':
                    break;
                case 'radio':
                case 'checkbox':
                    if (!field.checked) {
                        break;
                    }
                default:
                    parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
            }
        }

        return parts.join('&');
    },

    toggleClass: function(element, toToggleClass) {
        // 此方法支持同时为一系列 node 集合中的每个 node toggle class
        if (!toToggleClass) {
            return ;
        }
        if (typeCheckUtil.isNumber(element.length)) {
            for (var i in element) {
                if (element.hasOwnProperty(i)) {
                    if (!typeCheckUtil.isNumber(i)) {
                        return;
                    } else if (!!element[i].classList) {
                        element[i].classList.toggle(toToggleClass);
                    } else {
                        var classNames = element[i].className.split(/\s+/);

                        var pos = -1,
                            k,
                            len = classNames.length;
                        for (k = 0; k < len; k++) {
                            if (classNames[k] == toToggleClass) {
                                pos = k;
                                break;
                            }
                        }
                        if (pos == -1) {
                            classNames.push(toToggleClass);
                        } else {
                            classNames.splice(k, 1);
                        }

                        element[i].className = stringUtil.trim(classNames.join(' '));
                    }
                }
            }
        } else {
            if (!!element.classList) {
                element.classList.toggle(toToggleClass);
            } else {
                var classNames2 = element.className.split(/\s+/);

                var pos2 = -1,
                    x,
                    len2 = classNames2.length;

                for (x = 0; x < len2; x++ ) {
                    if (classNames2[x] == toToggleClass) {
                        pos2 = x;
                        break;
                    }
                }

                if (pos2 == -1) {
                    classNames2.push(toToggleClass);
                } else {
                    classNames2.splice(pos2, 1);
                }
                element.className = stringUtil.trim(classNames2.join(' '));
            }
        }
    },

    getStyle: function(element, prop) {
        if (arguments[1]) {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                return document.defaultView.getComputedStyle(element, null)[prop];
            } else if (element.currentStyle) {
                return element.currentStyle[prop];
            } else {
                return element.style[prop];
            }
        } else {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                return document.defaultView.getComputedStyle(element, null);
            } else if (element.currentStyle) {
                return element.currentStyle;
            } else {
                return element.style;
            }
        }
    },
    setStyle: function (element, toAddStyleObj) {
        var style = element.style;
        if (Object.assign) {
            Object.assign(style, toAddStyleObj);
        }
        otherUtil.each(toAddStyleObj, function (value, prop) {
            style[prop] = value;
        })

    },
    hasClass: function (element, toCheckClassName) {
        return element.classList ? element.classList.contains(value) : element.className.indexOf(toCheckClassName) > -1;
    },
    isContain: function (nodeA, nodeB) {
        if (document.body.contains) {
            return nodeA.contains(nodeB);
        } else if (document.body.compareDocumentPosition) {
            return !!(nodeA.compareDocumentPosition(nodeB) & 16);
        } else {
            var node = nodeB.parentNode;
            do {
                if (node === nodeA) {
                    return true;
                } else {
                    node = node.parentNode;
                }
            } while (node !== null);

            return false;
        }
    },
    getElementPos: function (element) {
        if (element.getBoundingClientRect) {
            return {
                // element.getBoundingClientRect() 获取元素的在当前视口的左边
                x: element.getBoundingClientRect().left + document.body.scrollLeft,
                y: element.getBoundingClientRect().top + document.body.scrollTop
            };
        }
        var actualLeft = element.offsetLeft;
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null){
            // 逐层遍历 offsetParent 和 offsetLeft, offsetTop
            actualLeft += current.offsetLeft;
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return {
            x: actualLeft,
            y: actualTop
        }
    },
    scrollIntoView: function (element) {
        if (element.scrollIntoView) {
            element.scrollIntoView();
        } else {
            var pos = DOMUtil.getElementPos(element);
            document.body.scrollTop = pos.y;
        }
    },
    empty: function (element) {
        // 清空某个元素
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },
    getImageSize: function (image, callback) {
        // pass a image node, and a callback function
        var newImage;

        // Modern browsers
        if (image.naturalWidth) {
            // callback(number, number)
            return callback(image.naturalWidth, image.naturalHeight);
        }

        // IE8: Don't use `new Image()` here
        newImage = document.createElement('img');

        newImage.onload = function () {
            callback(this.width, this.height);
        };

        newImage.src = image.src;
    },
    getImageName: function (url) {
        // get a url, parse and return the image name
        return isString(url) ? url.replace(/^.*\//, '').replace(/[\?&#].*$/, '') : '';
    },
    setText: function (element, text) {
        if (!typeCheckUtil.isUndefined(element.textContent)) {
            element.textContent = text;
        } else {
            element.innerText = text;
        }
    },
    getData: function (element, name) {
        if (!!name) {
            if (element.dataset) {
                return element.dataset[name];
            } else {
                return element.getAttribute(name);
            }
        } else {
            if (element.dataset) {
                return element.dataset;
            } else {
                var temp = {};
                for (var i = 0, len = element.attributes.length; i < len; i++) {
                    if (element.attributes[i].nodeName.indexOf("data-") > -1) {
                        temp[element.attributes[i].nodeName.slice(5)] = element.attributes[i].nodeValue;
                    }
                }
                return temp;
            }
        }
    },
    setData: function(element, name, data) {
        if (typeCheckUtil.isObject(data)) {
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    element.dataset[prop] = data[prop];
                }
            }
        } else if (element.dataset) {
            element.dataset[name] = data;
        } else {
            element.setAttribute('data-' + hyphenate(name), data);
        }
    },
    removeData: function (element, name) {
        if (typeCheckUtil.isObject(element[name])) {
            delete element[name];
        } else if (element.dataset) {
            delete element.dataset[name];
        } else {
            element.removeAttribute('data-' + stringUtil.hyphenate(name));
        }
    }
};

var eventUtil = {
    addEventHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },

    getEvent: function(event) {
        return event ? event : window.event;
    },

    // For mouseover, mouseout events
    getRelatedTarget: function(event) {
        if (event.relatedTarget) {
            return event.relatedTarget;
        } else if (event.toElement) {
            return event.toElement;
        } else if (event.fromElement) {
            return event.fromElement;
        } else {
            return null;
        }
    },

    // For mousedown, mouseup events
    getButton: function(event) {
        if (document.implementation.hasFeature('MouseEvents', '2.0')) {
            return event.button;
        } else {
            switch (event.button) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        }
    },

    // For mouseWheel event
    getWheelDelta: function(event) {
        if (event.wheelDelta) {
            return event.wheelDelta;
        } else {
            return -event.detail * 40;
        }
    },

    // For keyboard event
    getCharCode: function(event) {
        if (typeof event.charCode) {
            return event.charCode;
        } else {
            return event.keycode;
        }
    },

    getTarget: function(event) {
        return event.target || event.srcElement;
    },

    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },

    removeEventHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent('on' + type, handler);
        } else {
            element['on' + type] = null;
        }
    },

    // For copy, cut and paste event
    getClipboardText: function(event) {
        var clipboardData = (event.clipboardData || window.clipboardData);
        return clipboardData.getData('text');
    },

    setClipboardDataText: function(event, value) {
        if (event.clipboardData) {
            return event.clipboardData.setData('text/plain', value);
        } else if(window.clipboardData) {
            return window.clipboardData.setData('text', value);
        }
    },


};

var cookies = function (data, opt) {
    // defaults 方法的功能是利用另一个对象的属性和方法扩展（extend）一个对象
    function defaults (obj, defs) {
        obj = obj || {};
        for (var key in defs) {
            if (obj[key] === undefined) {
                obj[key] = defs[key];
            }
        }
        return obj;
    }

    // 初始化全局对象 cookies 的默认配置
    // ！！！这里的 cookies 就是外部函数 cookies，这时的 cookies 就是拥有着这些默认属性的一个函数对象
    defaults(cookies, {
        // Basic
        expires: 365 * 24 * 3600,
        path: '/',
        secure: window.location.protocol === 'https:',

        // Advanced
        nulltoremove: true,
        autojson: true,
        autoencode: true,
        encode: function (val) {
            return encodeURIComponent(val);
        },
        decode: function (val) {
            return decodeURIComponent(val);
        },
        test: function(res) {
            console.log(res);
        }
    });

    // 结合库的默认配置与用户传入的自定义配置（第二个参数），整合形成新的配置对象 opt
    opt = defaults(opt, cookies);

    // 设定 expires 时间的工具函数
    // 接收一个 Date 对象或一个数字（毫秒数）
    function expires (time) {
        var expires = time;
        if (!(expires instanceof Date)) {
            expires = new Date();
            expires.setTime(expires.getTime() + (time * 1000));
        }
        return expires.toUTCString();
    }

    // 如果传入的 data 是一个字符串，那么就是在 document 里查询有无这个字段
    if (typeof data === 'string') {
        // 将 document.cookie 值转换为对象，查询里面有无我们传入的字符串参数 "data" 属性
        // value 为查找后的字符串或 undefined
        var value = document.cookie.split(/;\s*/)
            .map(opt.autoencode ? opt.decode : function (d) { return d; })
            .map(function (part) { return part.split('='); })
            .reduce(function (parts, part) {
                // parts 的初始值一个空对象
                // reduce 后将存储 document.cookie 数组 [[key, value], [key, value]...] 恢复而来的对象
                parts[part[0]] = part[1];
                return parts;
            }, {})[data];
        if (!opt.autojson) return value;
        try {
            // 确保返回的是字符串
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }

    // 这段代码就是真正的写入
    for (var key in data) {
        var expired = data[key] === undefined || (opt.nulltoremove && data[key] === null);
        var str = opt.autojson ? JSON.stringify(data[key]) : data[key];
        var encoded = opt.autoencode ? opt.encode(str) : str;
        if (expired) encoded = '';
        var res = opt.encode(key) + '=' + encoded +
            (opt.expires ? (';expires=' + expires(expired ? -10000 : opt.expires)) : '') +
            ';path=' + opt.path +
            (opt.domain ? (';domain=' + opt.domain) : '') +
            (opt.secure ? ';secure' : '');
        if (opt.test) opt.test(res);
        // document.cookie 默认的写入是追加写入，而不是覆盖写入
        document.cookie = res;
    }
    // 最后又返回 cookies 函数对象，实现了链式调用
    return cookies;
};

// 兼容各个模块加载器：this 指向的是全局对象
// (function webpackUniversalModuleDefinition (root) {
//     if (typeof exports === 'object' && typeof module === 'object') {
//         module.exports = cookies;
//     } else if (typeof define === 'function' && define.amd) {
//         define('cookies', [], cookies);
//     } else if (typeof exports === 'object') {
//         exports['cookies'] = cookies;
//     } else {
//         root['cookies'] = cookies;
//     }
// })(this);

//# sourceMappingURL=utils.js.map
