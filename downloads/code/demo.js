var var DOMUtil = {
    trim: function(str, leftTrimBoolean, rightTrimBoolean) {
        if (str.trim && str.trimLeft && str.trimLRight) {
            switch (true) {
                case leftTrimBoolean:
                    str = str.trimLeft();
                case rightTrimBoolean:
                    str = str.trimRight();
            }
        } else {
            switch (true) {
                case leftTrimBoolean:
                    str = str.replace(/(^\s*)/g,"");
                case rightTrimBoolean:
                    str = str.replace(/(\s*$)/g,"");
                    break;
            }
        }
        return str;
    },

    getElement: function(ele, selector) {
        var isId = (this.trim(selector, true, true).indexOf('#') === 0),
            isClass = (this.trim(selector, true, true).indexOf('.') === 0);

        switch (true) {
            case isId:
                return ele.querySelector ? ele.querySelector(selector) : ele.getElementById(selector);
            case isClass:
                return ele.querySelectorAll ? ele.querySelectorAll(selector) : ele.getElementsByClassName(selector);
            default:
                return ele.querySelectorAll ? ele.querySelectorAll(selector) : ele.getElementsByTagName(selector);
        }
    },

    getFirstElementChild: function(element){
        for (var nodes = element.chileNodes, node, i = 0, len = nodes.length; i < l; ++i) {
            if (node = nodes[i], 1 === node.nodeType) {
                return node;
            }
        }
        return null;
    },

    getLastElementChild: function(){
        for(var nodes = this.chileNodes, node, i = nodes.length - 1; i >= 0; --i) {
            if(node = nodes[i], 1 === node.nodeType) {
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

    toggleClass: function(element, toToggleClass) {
        if (!!element.classList) {
            element.classList.toggle(toToggleClass);
        } else {
            var classNames = element.className.split(/\s+/);
            
            var pos = -1,
                i,
                len = classNames.length;
            
            for (i = 0; i < len; i++ ) {
                if (classNames[i] == toToggleClass) {
                    pos = i;
                    break;
                }
            }
            
            if (pos == -1) {
                classNames.push(toToggleClass);
            } else {
                classNames.splice(i, 1);
            }
            
            element.className = classNames.join(' ');
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
    }
};