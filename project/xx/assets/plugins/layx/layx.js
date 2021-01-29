"use strict";

!function(over, win, slf) {
    // layx 默认配置参数

    var defaults = {
        id: 'layx', // 唯一id
        icon: '', // 图标，设置false不启用，这里支持html代码
        title: '', // 窗口标题
        bgColor: '#fff', // 背景颜色
        borderColor: '#3baced', // 边框颜色
        opacity: 1, // 透明度
        width: 800, // 初始化宽度
        height: 600, // 初始化高度
        position: 'center', // 初始化位置，支持'center', 'lt', 'rt', 'lb', 'rb'以及 [top,left]数组
        minWidth: 350, // 拖曳大小最小宽度
        minHeight: 350, // 拖曳大小最大宽度
        shadable: false, // 是否启用窗口阻隔
        alwaysOnTop: false, // 是否总是置顶
        pinable: false, // 是否显示图钉按钮，当 alwaysOnTop为true的时候，pinable自动显示
        refresh: undefined, // 刷新函数，如果为false，则为不显示刷新按钮
        minimizable: true, // 是否允许最小化
        maximizable: true, // 是否允许最大化
        closable: true, // 是否允许关闭
        resizable: true, // 是否允许拖曳大小
        // 拖曳方向控制
        resizeLimit: {
            t: true, // 是否允许上边拖曳大小，true允许
            r: true, // 是否允许右边拖曳大小，true允许
            b: true, // 是否允许下边拖曳大小，true允许
            l: true, // 是否允许左边拖曳大小，true允许
            lt: true, // 是否允许左上边拖曳大小，true允许
            rt: true, // 是否允许右上边拖曳大小，true允许
            lb: true, // 是否允许左下边拖曳大小，true允许
            rb: true // 是否允许右下边拖曳大小，true允许
        },
        movable: true, // 是否允许拖动窗口
        // 拖动窗口显示，vertical为true表示禁止水平拖动，horizontal为true表示禁止垂直拖动
        moveLimit: {
            vertical: false, // 是否禁止垂直拖动，false不禁止
            horizontal: false, // 是否禁止水平拖动，false不禁止
            leftOut: true, // 是否允许左边拖出，true允许
            rightOut: true, // 是否允许右边拖出，true允许
            topOut: true, // 是否允许上边拖出，true允许，此设置不管是false还是true，窗口都不能拖出窗体
            bottomOut: true, // 是否允许下边拖出，true允许
        },
        statusBar: false, // 是否显示状态栏
        // scaleAnimatable: false, // 是否启用窗口缩放动画，开发中....
        allowTitleDblclickToRestore: true, // 是否允许标题双击恢复窗体
        // parent: null, // 父窗体id，设置此选项时，窗体将在窗体内部页面打开（MDI模式）并和父窗口共用同一个生命周期；注意：只支持非跨域页面。开发中...
        // menuItems: [], // 自定义顶部下拉菜单，支持无限极，开发中....
        // 拦截器，可以监听窗口各个状态
        intercept: {
            // 最小化监听
            min: {
                // 最小化之前，return false；禁止最小化
                before: function(windowDom, winform) {},
                // 最小化之后
                after: function(windowDom, winform) {}
            },
            // 最大化监听
            max: {
                // 最大化之前，return false；禁止最大化
                before: function(windowDom, winform) {},
                // 最大化之后
                after: function(windowDom, winform) {}
            },
            // 恢复监听
            restore: {
                // 恢复之前，return false；禁止恢复
                before: function(windowDom, winform) {},
                // 恢复之后
                after: function(windowDom, winform) {}
            },
            // 关闭监听
            destroy: {
                // 关闭之前，return false；禁止关闭
                before: function(windowDom, winform) {},
                // 关闭之后
                after: function(windowDom, winform) {}
            },
            // 置顶监听
            pin: {
                // 置顶之前，return false；禁止操作
                before: function(windowDom, winform) {},
                // 置顶之后
                after: function(windowDom, winform) {}
            },
            // 刷新监听
            refresh: {
                // 置顶之前，return false；禁止操作
                before: function(windowDom, winform) {},
                // 置顶之后
                after: function(windowDom, winform) {}
            },
            // 移动窗口监听
            move: {
                // 移动之前
                before: function(windowDom, winform) {},
                // 移动中
                moveing: function(windowDom, winform) {},
                // 移动结束
                after: function(windowDom, winform) {}
            },
            // 拖曳窗口大小监听
            resize: {
                // 拖曳之前
                before: function(windowDom, winform) {},
                // 拖曳中
                resizing: function(windowDom, winform) {},
                // 拖曳结束
                after: function(windowDom, winform) {}
            }
        }
    };

    // 对象深度复制
    (function(global) {
        var extend,
        _extend,
        _isObject;

        _isObject = function(o) {
            return Object.prototype.toString.call(o) === '[object Object]';
        }

        _extend = function self(destination, source) {
            var property;
            for (property in destination) {
                if (destination.hasOwnProperty(property)) {

                    // 若destination[property]和sourc[property]都是对象，则递归
                    if (_isObject(destination[property]) && _isObject(source[property])) {
                        self(destination[property], source[property]);
                    }

                    // 若sourc[property]已存在，则跳过
                    if (source.hasOwnProperty(property)) {
                        continue;
                    } else {
                        source[property] = destination[property];
                    }
                }
            }
        }

        extend = function() {
            var arr = arguments,
            result = {},
            i;

            if (!arr.length) return {};

            for (i = arr.length - 1; i >= 0; i--) {
                if (_isObject(arr[i])) {
                    _extend(arr[i], result);
                }
            }

            arr[0] = result;
            return result;
        }

        global.layxDeepClone = extend;
    })(win);

    // 工具类
    var utils = {
        // 是否数组类型
        isArray: function(o) {
            return Object.prototype.toString.call(o) == '[object Array]';
        },
        // 是否一个方法类型
        isFunction: function(func) {
            return func && Object.prototype.toString.call(func) === '[object Function]';
        },
        // 根据id获取元素对象
        getElementById: function(id) {
            return document.getElementById(id);
        },
        // 根据选择器获取元素对象
        querySelector: function(selector, el) {
            return (el && el.nodeType == 1 ? el : document).querySelector(selector);
        },
        // 在文档最后插入html
        InsertAfter: function(html, el) {
            (el && el.nodeType == 1 ? el : document.body).lastElementChild.insertAdjacentHTML('afterend', html);
        },
        // 获取浏览器可视区域，包含滚动条
        getClientArea: function() {
            return { width: window.innerWidth, height: window.innerHeight };
        },
        // 解析窗口传入的位置参数，并转化为 {left: top: }对象
        compilePositionParams: function(width, height, params) {
            var that = this;
            var posOptions = ['center', 'lt', 'rt', 'lb', 'rb'];
            var clientArea = that.getClientArea();
            var position = { top: 0, left: 0 };
            if (that.isArray(params) && params.length === 2) {
                position.top = params[0];
                position.left = params[1];
            } else {
                params = posOptions.indexOf(params.toString()) > -1 ? params.toString() : 'center';
                switch (params) {
                    case 'center':
                    position.top = Math.floor(Math.floor(clientArea.height - height) / 2);
                    position.left = Math.floor(Math.floor(clientArea.width - width) / 2);
                    break;
                    case 'lt':
                    position.top = 0;
                    position.left = 0;
                    break;
                    case 'rt':
                    position.top = 0;
                    position.left = Math.floor(clientArea.width - width);
                    break;
                    case 'lb':
                    position.top = Math.floor(clientArea.height - height);
                    position.left = 0;
                    break;
                    case 'rb':
                    position.top = Math.floor(clientArea.height - height);
                    position.left = Math.floor(clientArea.width - width);
                    break;
                }
            }
            if (typeof position.top !== 'number') {
                position.top = Math.floor(Math.floor(clientArea.height - height) / 2);
            }
            if (typeof position.left !== 'number') {
                position.left = Math.floor(Math.floor(clientArea.width - width) / 2);
            }

            return position;
        },
        // 获取鼠标点击当前位置
        getMousePosition: function(e) {
            e = event || window.event;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            var x = e.pageX || e.clientX + scrollX;
            var y = e.pageY || e.clientY + scrollY;
            return { 'x': x, 'y': y };
        },
        // 向上递归查找元素
        getNodeByClassName: function(node, className) {
            var that = this;
            if (node === document.body) {
                return null;
            }
            var cls = node.classList;
            if (cls.contains(className)) {
                return node;
            } else {
                return that.getNodeByClassName(node.parentNode, className);
            }
        }
    };

    // 拖动类定义
    var Drag = function(el, moveLimit, moveEvent) {
        var drag = function(e) {
            e = e || window.event;

            var button = e.button || e.which;
            if (button == 1 && e.shiftKey == false) {

                var currentPosition = utils.getMousePosition(e);
                var currentX = currentPosition.x,
                currentY = currentPosition.y,
                distX = currentX - el.startX,
                distY = currentY - el.startY,
                _top = el.windowStartTop + distY,
                _left = el.windowStartLeft + distX;

                if (distX !== 0 || distY !== 0) {
                    Drag.isMove = true;
                    var winform = Layx.windows[el.windowId];
                    // 触发移动之前
                    if (Drag.isTriggerMoveBefore === false) {
                        Drag.isTriggerMoveBefore = true;
                        winform && winform.config && winform.config.intercept["move"] && utils.isFunction(winform.config.intercept["move"].before) && winform.config.intercept["move"].before(winform.windowDom, winform, currentX, currentY);
                    }

                    if (winform.status === "max") {
                        Layx.triggerMethod('restore', el.windowId, winform, e);
                        if (currentPosition.x < el.defaultAreaInfo.width / 2) {
                            _left = 0;
                        } else if (currentPosition.x > el.defaultAreaInfo.width / 2 && currentPosition.x < el.clientArea.width - el.defaultAreaInfo.width) {
                            _left = currentPosition.x - el.defaultAreaInfo.width / 2;
                        } else if (el.clientArea.width - currentPosition.x < el.defaultAreaInfo.width / 2) {
                            _left = el.clientArea.width - el.defaultAreaInfo.width;
                        } else if (el.clientArea.width - currentPosition.x > el.defaultAreaInfo.width / 2 && currentPosition.x >= el.clientArea.width - el.defaultAreaInfo.width) {
                            _left = currentPosition.x - el.defaultAreaInfo.width / 2;
                        }
                        el.startX = currentPosition.x - _left;
                    }
                    // limit
                    moveLimit.horizontal === true && (_left = el.windowStartLeft);
                    moveLimit.vertical === true && (_top = el.windowStartTop);

                    // move out limit
                    moveLimit.leftOut === false && (_left = Math.max(_left, 0));
                    moveLimit.rightOut === false && (_left = Math.min(_left, el.clientArea.width - el.windowStartWidth));
                    moveLimit.bottomOut === false && (_top = Math.min(_top, el.clientArea.height - el.windowStartHeight));

                    _top = Math.max(_top, 0);
                    _top = Math.min(el.clientArea.height - 15, _top);

                    el.windowDom.style.top = _top + 'px';
                    el.windowDom.style.left = _left + 'px';

                    winform && winform.config && winform.config.intercept["move"] && utils.isFunction(winform.config.intercept["move"].moveing) && winform.config.intercept["move"].moveing(winform.windowDom, winform, currentX, currentY);
                }
            }
        };

        var dragend = function(e) {
            e = e || window.event;

            document.onmouseup = null;
            document.onmousemove = null;

            if (Drag.isMove === true) {
                Drag.isMove = false;
                Drag.isTriggerMoveBefore = false;
                var winform = Layx.windows[el.windowId];
                if (el.windowDom.offsetTop === 0 && winform.config.maximizable === true) {
                    Layx.triggerMethod('max', el.windowId, winform, e);
                }
                if (Layx.windows[el.windowId].status !== "max") {
                    winform.defaultAreaInfo.top = el.windowDom.offsetTop;
                    winform.defaultAreaInfo.left = el.windowDom.offsetLeft;
                }

                // 触发移动之后
                winform && winform.config && winform.config.intercept["move"] && utils.isFunction(winform.config.intercept["move"].after) && winform.config.intercept["move"].after(winform.windowDom, winform);
            }
        };

        var dragstart = function(e) {
            e = e || window.event;

            var windowDom = utils.getNodeByClassName(el, 'layx-window'),
            clientArea = utils.getClientArea(),
            windowId = windowDom.id.substr(5),
            winform = Layx.windows[windowId],
            startPosition = utils.getMousePosition(e);
            if (winform.status !== "min") {
                el.windowDom = windowDom;
                el.windowId = windowId;
                el.windowStartLeft = windowDom.offsetLeft;
                el.windowStartTop = windowDom.offsetTop;
                el.windowStartWidth = windowDom.offsetWidth;
                el.windowStartHeight = windowDom.offsetHeight;
                el.defaultAreaInfo = winform.defaultAreaInfo;
                el.startX = startPosition.x;
                el.startY = startPosition.y;
                el.clientArea = clientArea;

                Layx.setZindex(windowDom, winform);

                document.onmouseup = dragend;
                document.onmousemove = drag;
            }

            return false;
        };
        Drag.isTriggerMoveBefore = false;
        Drag.isMove = false;
        el.onmousedown = dragstart;
    };

    // 拖曳类定义
    var Resize = function(el, minWidth, minHeight, isTop, isLeft, lockX, lockY) {
        var drag = function(e) {
            e = e || window.event;

            var button = e.button || e.which;
            if (button == 1 && e.shiftKey == false) {

                var currentPosition = utils.getMousePosition(e);
                var currentX = currentPosition.x,
                currentY = currentPosition.y,
                distX = currentX - el.startX,
                distY = currentY - el.startY,
                _top = el.windowStartTop + distY,
                _left = el.windowStartLeft + distX,
                _height = isTop ? el.windowStartHeight - distY : el.windowStartHeight + distY,
                _width = isLeft ? el.windowStartWidth - distX : el.windowStartWidth + distX;

                if (distX !== 0 || distY !== 0) {
                    Resize.isResize = true;
                    var winform = Layx.windows[el.windowId];
                    // 触发移动之前
                    if (Resize.isTriggerResizeBefore === false) {
                        Resize.isTriggerResizeBefore = true;
                        winform && winform.config && winform.config.intercept["resize"] && utils.isFunction(winform.config.intercept["resize"].before) && winform.config.intercept["resize"].before(winform.windowDom, winform);
                    }

                    _width = Math.max(_width, minWidth);
                    if (isLeft) {
                        _left = Math.min(_left, el.windowStartLeft + el.windowStartWidth - minWidth);
                        _left = Math.max(0, _left);

                        _width = Math.min(_width, el.windowStartLeft + el.windowStartWidth);
                    } else {
                        _left = Math.min(_left, el.windowStartLeft);
                        _left = Math.max(el.windowStartLeft, _left);

                        _width = Math.min(_width, el.clientArea.width - el.windowStartLeft);
                    }

                    _height = Math.max(_height, minHeight);
                    if (isTop) {
                        _top = Math.min(_top, el.windowStartTop + el.windowStartHeight - minHeight);
                        _top = Math.max(0, _top);

                        _height = Math.min(_height, el.windowStartTop + el.windowStartHeight);
                    } else {
                        _top = Math.min(_top, el.windowStartTop);
                        _top = Math.max(el.windowStartTop, _top);

                        _height = Math.min(_height, el.clientArea.height - el.windowStartTop);
                    }

                    if (lockY) {
                        el.windowDom.style.width = _width + 'px';
                        el.windowDom.style.left = _left + 'px';
                    }
                    if (lockX) {
                        el.windowDom.style.top = _top + 'px';
                        el.windowDom.style.height = _height + 'px';
                    }
                    if (lockY === false && lockX === false) {
                        el.windowDom.style.width = _width + 'px';
                        el.windowDom.style.left = _left + 'px';
                        el.windowDom.style.top = _top + 'px';
                        el.windowDom.style.height = _height + 'px';
                    }

                    winform && winform.config && winform.config.intercept["resize"] && utils.isFunction(winform.config.intercept["resize"].resizing) && winform.config.intercept["resize"].resizing(winform.windowDom, winform);
                }
            }
        };

        var dragend = function(e) {
            e = e || window.event;

            document.onmouseup = null;
            document.onmousemove = null;

            if (Resize.isResize === true) {
                Resize.isResize = false;
                Resize.isTriggerResizeBefore = false;
                var winform = Layx.windows[el.windowId];
                winform.defaultAreaInfo.top = el.windowDom.offsetTop;
                winform.defaultAreaInfo.left = el.windowDom.offsetLeft;
                winform.defaultAreaInfo.width = el.windowDom.offsetWidth;
                winform.defaultAreaInfo.height = el.windowDom.offsetHeight;

                winform && winform.config && winform.config.intercept["resize"] && utils.isFunction(winform.config.intercept["resize"].after) && winform.config.intercept["resize"].after(winform.windowDom, winform);
            }
        };

        var dragstart = function(e) {
            e = e || window.event;

            var windowDom = utils.getNodeByClassName(el, 'layx-window'),
            clientArea = utils.getClientArea(),
            windowId = windowDom.id.substr(5),
            winform = Layx.windows[windowId],
            startPosition = utils.getMousePosition(e);
            if (winform.status !== "min") {
                el.windowDom = windowDom;
                el.windowId = windowId;
                el.windowStartLeft = windowDom.offsetLeft;
                el.windowStartTop = windowDom.offsetTop;
                el.windowStartWidth = windowDom.offsetWidth;
                el.windowStartHeight = windowDom.offsetHeight;
                el.defaultAreaInfo = winform.defaultAreaInfo;

                el.startX = startPosition.x;
                el.startY = startPosition.y;
                el.clientArea = clientArea;

                Layx.setZindex(windowDom, winform);

                document.onmouseup = dragend;
                document.onmousemove = drag;
            }
            return false;
        };
        Resize.isTriggerResizeBefore = false;
        Resize.isResize = false;
        el.onmousedown = dragstart;
    };

    // 内部Layx类定义
    var Layx = {
        // 版本号
        v: '1.0.0',
        // 窗口默认起始zIndex
        zIndex: 200,
        // 当前所有窗口信息
        windows: {},
        // 窗口置顶起始zIndex
        pinZindex: 300, // 置顶起始索引
        // 创建窗口对象
        create: function(options) {
            var config = layxDeepClone({}, defaults, options || {});
            if (!Layx.windows.hasOwnProperty(config.id)) {
                if (config.alwaysOnTop === true && config.pinable !== false) {
                    config.pinable = true;
                }

                var winform = {};
                winform.id = config.id;
                winform.title = config.title;
                winform.config = config;
                winform.status = 'normal';
                winform.alwaysOnTop = config.alwaysOnTop;
                winform.createDate = new Date();
                winform.parentWindow = win.parent;

                var clientArea = utils.getClientArea();
                var position = utils.compilePositionParams(config.width, config.height, config.position);
                if (config.width > clientArea.width) {
                    position.left = 0;
                }
                if (config.height > clientArea.height) {
                    position.top = 0;
                }
                config.width = Math.min(config.width, clientArea.width);
                config.height = Math.min(config.height, clientArea.height);

                winform.defaultAreaInfo = {
                    width: config.width,
                    height: config.height,
                    top: position.top,
                    left: position.left
                };

                // 构建窗口骨架
                var winTemplate = "" + (config.shadable === true ? '<div class="layx-shade" id="layx-' + config.id + '-shade" style="z-index:' + (config.alwaysOnTop === true ? (++Layx.pinZindex) : (++Layx.zIndex)) + '"></div>' : "") + '<div class="layx-window" id="layx-' + config.id + '" style="width:' + (typeof config.width === 'string' ? 'auto' : config.width + 'px') + ";height:" + (typeof config.height === 'string' ? 'auto' : config.height + 'px') + ";top:" + position.top + "px;left:" + position.left + "px;z-index: " + (config.alwaysOnTop === true ? (++Layx.pinZindex) : (++Layx.zIndex)) + ";background-color:" + (config.bgColor ? config.bgColor : "transparent") + ";border-color:" + config.borderColor + ";opacity:" + config.opacity + '"><div class="layx-control-bar"><div class="layx-icons">' + (config.icon === false ? "" : config.icon ? config.icon.toString() : '<div class="layx-icon"><svg class="layx-iconfont" aria-hidden="true"><use xlink:href="#layx-icon-windows"></use></svg></div>') + '</div><div class="layx-title" title="' + config.title + '">' + config.title + '</div><div class="layx-menus">' + (config.pinable === true ? '<div class="layx-operator layx-pin-menu" ' + (config.alwaysOnTop === true ? ' data-topable="1" ' : '') + '><svg class="layx-iconfont" aria-hidden="true"><use xlink:href="#layx-icon-pin"></use></svg></div>' : "") + (!!config.refresh ? '<div class="layx-operator layx-refresh-menu"><svg class="layx-iconfont" aria-hidden="true"><use xlink:href="#layx-icon-refresh"></use></svg></div>' : "") + "" + (config.minimizable === true ? '<div class="layx-operator layx-min-menu"><svg class="layx-iconfont" aria-hidden="true"><use xlink:href="#layx-icon-min"></use></svg></div>' : "") + "" + (config.maximizable === true ? '<div class="layx-operator layx-max-menu"><svg class="layx-iconfont" aria-hidden="true"><use xlink:href="#layx-icon-max"></use></svg></div>' : "") + "" + (config.closable === true ? '<div class="layx-operator layx-destroy-menu"><svg class="layx-iconfont" aria-hidden="true"><use xlink:href="#layx-icon-destroy"></use></svg></div>' : "") + '</div></div><div class="layx-body"></div>' + (config.resizable === true ? '<div class="layx-resizes">' + (config.resizeLimit.t === true ? '<div class="layx-resize-top"></div>' : "") + "" + (config.resizeLimit.r === true ? '<div class="layx-resize-right"></div>' : "") + "" + (config.resizeLimit.b === true ? '<div class="layx-resize-bottom"></div>' : "") + "" + (config.resizeLimit.l === true ? '<div class="layx-resize-left"></div>' : "") + "" + (config.resizeLimit.lt === true ? '<div class="layx-resize-left-top"></div>' : "") + "" + (config.resizeLimit.rt === true ? '<div class="layx-resize-right-top"></div>' : "") + "" + (config.resizeLimit.lb === true ? '<div class="layx-resize-left-bottom"></div>' : "") + "" + (config.resizeLimit.rb === true ? '<div class="layx-resize-right-bottom"></div>' : "") + "</div>" : "") + "" + (config.statusBar === false ? "" : '<div class="layx-status-bar">' + config.statusBar + '</div>') + "</div>";

                utils.InsertAfter(winTemplate);
                var windowDom = utils.getElementById('layx-' + config.id);

                if (over !== slf && slf.frameElement && self.frameElement.tagName == "IFRAME") {
                    var _windowDom = self.frameElement.parentNode.parentElement,
                    _layxid = _windowDom.getAttribute("data-layx-id"),
                    _windowId = _windowDom.id.substr(5);
                    windowDom.setAttribute("data-layx-id", (_layxid ? _layxid + '.' : '') + _windowId);
                } else {
                    windowDom.setAttribute("data-layx-id", config.id);
                }
                winform.windowDom = windowDom;

                winform.zIndex = (config.alwaysOnTop === true ? Layx.pinZindex : Layx.zIndex);
                Layx.windows[config.id] = winform;

                // 构建内容对象
                var layxBody = utils.querySelector('.layx-body', windowDom);
                options.render && options.render(layxBody);

                // 绑定事件
                var destroyMenu = utils.querySelector('.layx-destroy-menu', windowDom);
                if (destroyMenu) destroyMenu.onclick = function(e) {
                    Layx.triggerMethod('destroy', config.id, winform, e);
                };

                var maxMenu = utils.querySelector('.layx-max-menu', windowDom);
                if (maxMenu) maxMenu.onclick = function(e) {
                    Layx.triggerMethod('max', config.id, winform, e);
                };

                var minMenu = utils.querySelector('.layx-min-menu', windowDom);
                if (minMenu) minMenu.onclick = function(e) {
                    Layx.triggerMethod('min', config.id, winform, e);
                };

                var pinMenu = utils.querySelector('.layx-pin-menu', windowDom);
                if (pinMenu) {
                    if (pinMenu) pinMenu.onclick = function(e) {
                        Layx.triggerMethod('pin', config.id, winform, e);
                    };
                }

                var refreshMenu = utils.querySelector('.layx-refresh-menu', windowDom);
                if (refreshMenu) {
                    if (refreshMenu) refreshMenu.onclick = function(e) {
                        Layx.triggerMethod('refresh', config.id, winform, e);
                    };
                }

                var title = utils.querySelector('.layx-title', windowDom);
                if (title) {
                    if (config.movable) {
                        new Drag(title, config.moveLimit, config.intercept.move);
                    }
                    if (config.allowTitleDblclickToRestore === true && config.maximizable === true) {
                        title.ondblclick = function(e) {
                            if (winform.status === "normal") {
                                Layx.triggerMethod('max', config.id, winform, e);
                            } else {
                                Layx.triggerMethod('restore', config.id, winform, e);
                            }
                        };
                    }
                }

                var shade = utils.querySelector('.layx-shade');
                if (shade) {
                    shade.onclick = function(e) {
                        var that = this,
                        id = this.id,
                        windowId = id.substr(0, id.length - '-shade'.length);
                        Layx.setFlicker(windowId.substr(5));
                    };
                }
                if (config.resizable) {
                    var resize = utils.querySelector('.layx-resizes', windowDom);
                    if (resize) {
                        var leftResize = utils.querySelector('.layx-resize-left', windowDom);
                        if (config.resizeLimit && config.resizeLimit["l"] === true && leftResize) {
                            new Resize(leftResize, config.minWidth, config.minHeight, false, true, false, true);
                        }

                        var rightResize = utils.querySelector('.layx-resize-right', windowDom);
                        if (config.resizeLimit && config.resizeLimit["r"] === true && rightResize) {
                            new Resize(rightResize, config.minWidth, config.minHeight, false, false, false, true);
                        }

                        var topResize = utils.querySelector('.layx-resize-top', windowDom);
                        if (config.resizeLimit && config.resizeLimit["t"] === true && topResize) {
                            new Resize(topResize, config.minWidth, config.minHeight, true, false, true, false);
                        }

                        var bottomResize = utils.querySelector('.layx-resize-bottom', windowDom);
                        if (config.resizeLimit && config.resizeLimit["b"] === true && bottomResize) {
                            new Resize(bottomResize, config.minWidth, config.minHeight, false, false, true, false);
                        }

                        var leftTopResize = utils.querySelector('.layx-resize-left-top', windowDom);
                        if (config.resizeLimit && config.resizeLimit["lt"] === true && leftTopResize) {
                            new Resize(leftTopResize, config.minWidth, config.minHeight, true, true, false, false);
                        }

                        var rightTopResize = utils.querySelector('.layx-resize-right-top', windowDom);
                        if (config.resizeLimit && config.resizeLimit["rt"] === true && rightTopResize) {
                            new Resize(rightTopResize, config.minWidth, config.minHeight, true, false, false, false);
                        }

                        var leftBottomResize = utils.querySelector('.layx-resize-left-bottom', windowDom);
                        if (config.resizeLimit && config.resizeLimit["lb"] === true && leftBottomResize) {
                            new Resize(leftBottomResize, config.minWidth, config.minHeight, false, true, false, false);
                        }

                        var rightBottomResize = utils.querySelector('.layx-resize-right-bottom', windowDom);
                        if (config.resizeLimit && config.resizeLimit["rb"] === true && rightBottomResize) {
                            new Resize(rightBottomResize, config.minWidth, config.minHeight, false, false, false, false);
                        }
                    }
                }

                if (over !== slf && slf.frameElement && self.frameElement.tagName == "IFRAME") {
                    var _windowDom = self.frameElement.parentNode.parentElement,
                    _layxid = _windowDom.getAttribute("data-layx-id"),
                    _windowId = _windowDom.id.substr(5);
                    if (!over.layx.Windows.hasOwnProperty((_layxid ? _layxid + '.' : '') + _windowId)) {
                        over.layx.Windows[(_layxid ? _layxid + '.' : '') + _windowId] = winform;
                    }
                }
                return winform;
            } else {
                Layx.ExistShow(config.id);
                return Layx.windows[config.id];
            }
        },
        // 销毁窗口
        destroy: function(id) {
            var windowDom = utils.getElementById("layx-" + id),
            winform = Layx.windows[id];

            var shade = utils.getElementById('layx-' + id + '-shade');
            if (windowDom) {
                windowDom.parentNode.removeChild(windowDom);
                if (shade) {
                    shade.parentNode.removeChild(shade);
                }
            }
            if (Layx.windows.hasOwnProperty(id)) {
                delete Layx.windows[id];
                var reg = new RegExp("^" + id + '\.');
                for (var childId in over.layx.Windows) {
                    if (reg.test(childId)) {
                        delete over.layx.Windows[childId];
                    }
                }
            }
        },
        // 最大化窗口
        max: function(id) {
            var windowDom = utils.getElementById("layx-" + id),
            winform = Layx.windows[id];

            if (windowDom) {
                var maxMenu = utils.querySelector('.layx-max-menu', windowDom);
                if (maxMenu) {
                    maxMenu.innerHTML = "<svg class=\"layx-iconfont\" aria-hidden=\"true\"><use xlink:href=\"#layx-icon-restore\"></use></svg>";
                    maxMenu.classList.remove('layx-max-menu');
                    maxMenu.classList.add('layx-restore-menu');
                    maxMenu.setAttribute('data-ref', 'max');

                    var restoreMenu = utils.querySelector('.layx-restore-menu[data-ref="max"]', windowDom);
                    if (restoreMenu) restoreMenu.onclick = function(e) {
                        Layx.triggerMethod('restore', id, winform, e);
                    };
                }

                var minMenu = utils.querySelector('.layx-restore-menu[data-ref="min"]', windowDom);
                if (minMenu) {
                    minMenu.innerHTML = "<svg class=\"layx-iconfont\" aria-hidden=\"true\"><use xlink:href=\"#layx-icon-min\"></use></svg>";
                    minMenu.classList.remove('layx-restore-menu');
                    minMenu.classList.add('layx-min-menu');
                    minMenu.removeAttribute('data-ref');
                    minMenu.removeAttribute('data-restore-statu');

                    minMenu.onclick = function(e) {
                        Layx.triggerMethod('min', id, winform, e);
                    };
                }

                var resizePanel = utils.querySelector('.layx-resizes', windowDom);
                if (resizePanel) {
                    resizePanel.setAttribute('data-enable', '0');
                }

                var clientArea = utils.getClientArea();
                windowDom.style.width = clientArea.width + 'px';
                windowDom.style.height = clientArea.height + 'px';
                windowDom.style.top = '0px';
                windowDom.style.left = '0px';

                Layx.windows[id].status = 'max';
            }
        },
        // 恢复窗口
        restore: function(id) {
            var windowDom = utils.getElementById("layx-" + id),
            winform = Layx.windows[id];

            if (windowDom) {

                var maxMenu = utils.querySelector('.layx-restore-menu[data-ref="max"]', windowDom);
                if (maxMenu) {
                    maxMenu.innerHTML = "<svg class=\"layx-iconfont\" aria-hidden=\"true\"><use xlink:href=\"#layx-icon-max\"></use></svg>";
                    maxMenu.classList.remove('layx-restore-menu');
                    maxMenu.classList.add('layx-max-menu');
                    maxMenu.removeAttribute('data-ref');

                    maxMenu.onclick = function(e) {
                        Layx.triggerMethod('max', id, winform, e);
                    };

                    var defaultAreaInfo = winform.defaultAreaInfo;
                    windowDom.style.width = defaultAreaInfo.width + 'px';
                    windowDom.style.height = defaultAreaInfo.height + 'px';
                    windowDom.style.top = defaultAreaInfo.top + 'px';
                    windowDom.style.left = defaultAreaInfo.left + 'px';

                    Layx.windows[id].status = 'normal';
                }

                var minMenu = utils.querySelector('.layx-restore-menu[data-ref="min"]', windowDom);
                if (minMenu) {
                    minMenu.innerHTML = "<svg class=\"layx-iconfont\" aria-hidden=\"true\"><use xlink:href=\"#layx-icon-min\"></use></svg>";
                    minMenu.classList.remove('layx-restore-menu');
                    minMenu.classList.add('layx-min-menu');
                    minMenu.removeAttribute('data-ref');

                    minMenu.onclick = function(e) {
                        Layx.triggerMethod('min', id, winform, e);
                    };

                    var resizePanel = utils.querySelector('.layx-resizes', windowDom);
                    if (resizePanel) {
                        resizePanel.removeAttribute('data-enable');
                    }

                    var restoreStatu = minMenu.getAttribute("data-restore-statu");
                    if (restoreStatu === "normal") {
                        var defaultAreaInfo = winform.defaultAreaInfo;
                        windowDom.style.width = defaultAreaInfo.width + 'px';
                        windowDom.style.height = defaultAreaInfo.height + 'px';
                        windowDom.style.top = defaultAreaInfo.top + 'px';
                        windowDom.style.left = defaultAreaInfo.left + 'px';

                        Layx.windows[id].status = 'normal';
                    } else if (restoreStatu === "max") {
                        Layx.triggerMethod(restoreStatu, id, winform);
                    }
                }

                var resizePanel = utils.querySelector('.layx-resizes', windowDom);
                if (resizePanel) {
                    resizePanel.removeAttribute('data-enable');
                }
            }
        },
        // 最小化窗口
        min: function(id) {
            var windowDom = utils.getElementById("layx-" + id),
            winform = Layx.windows[id];
            if (windowDom) {
                var minMenu = utils.querySelector('.layx-min-menu', windowDom);
                if (minMenu) {
                    minMenu.innerHTML = "<svg class=\"layx-iconfont\" aria-hidden=\"true\"><use xlink:href=\"#layx-icon-restore\"></use></svg>";
                    minMenu.classList.remove('layx-min-menu');
                    minMenu.classList.add('layx-restore-menu');
                    minMenu.setAttribute('data-ref', 'min');
                    minMenu.setAttribute('data-restore-statu', winform.status);

                    var restoreMenu = utils.querySelector('.layx-restore-menu[data-ref="min"]', windowDom);
                    if (restoreMenu) restoreMenu.onclick = function(e) {
                        Layx.triggerMethod('restore', id, winform, e);
                    };
                }

                var maxMenu = utils.querySelector('.layx-restore-menu[data-ref="max"]', windowDom);
                if (maxMenu) {
                    maxMenu.innerHTML = "<svg class=\"layx-iconfont\" aria-hidden=\"true\"><use xlink:href=\"#layx-icon-max\"></use></svg>";
                    maxMenu.classList.remove('layx-restore-menu');
                    maxMenu.classList.add('layx-max-menu');
                    maxMenu.removeAttribute('data-ref');

                    maxMenu.onclick = function(e) {
                        Layx.triggerMethod('max', id, winform, e);
                    };
                }

                var resizePanel = utils.querySelector('.layx-resizes', windowDom);
                if (resizePanel) {
                    resizePanel.setAttribute('data-enable', '0');
                }

                Layx.windows[id].status = 'min';
                Layx.minManager();
            }
        },
        pin: function(id) {
            var windowDom = utils.getElementById("layx-" + id),
            winform = Layx.windows[id];
            if (windowDom) {
                var pinMenu = utils.querySelector('.layx-pin-menu', windowDom);
                if (winform.alwaysOnTop == true) {
                    winform.alwaysOnTop = false;
                    Layx.setZindex(windowDom, winform);
                    if (pinMenu) {
                        pinMenu.removeAttribute("data-topable");
                    }
                    return;
                }
                if (winform.alwaysOnTop == false) {
                    winform.alwaysOnTop = true;
                    Layx.setZindex(windowDom, winform);
                    if (pinMenu) {
                        pinMenu.setAttribute("data-topable", "1");
                    }
                    return;
                }
            }
        },
        refresh: function(id) {
            var winform = Layx.windows[id];
            if (winform) {
                winform.config.refresh.call && winform.config.refresh.call();
            }
        },
        // 内部统一触发方法机制
        triggerMethod: function(methodName, id, winform, e) {
            e = e || window.event;
            var beforeReval = true;
            if (winform && winform.config && winform.config.intercept[methodName] && utils.isFunction(winform.config.intercept[methodName].before) && winform.config.intercept[methodName].before(winform.windowDom, winform) === false) {
                beforeReval = false;
            }
            if (beforeReval) {
                Layx[methodName] && Layx[methodName](id);
            }
            if (winform && winform.config && winform.config.intercept[methodName] && utils.isFunction(winform.config.intercept[methodName].after)) {
                winform.config.intercept[methodName].after(winform.windowDom, winform);
            }
            e.stopPropagation();
        },
        // 最小化管理
        minManager: function() {
            var clientArea = utils.getClientArea(),
            paddingLeft = 10,
            paddingBottom = 10,
            minStatuWidth = 220,
            minStatuHeight = 30,
            lineMaxCount = Math.floor(clientArea.width / (minStatuWidth + paddingLeft)),
            stepIndex = 0;
            var windows = Layx.windows;
            if (windows) {
                for (var id in windows) {
                    if (windows[id].status === 'min') {
                        windows[id].windowDom.style.width = minStatuWidth + 'px';
                        windows[id].windowDom.style.height = minStatuHeight + 'px';
                        windows[id].windowDom.style.top = clientArea.height - (Math.floor(stepIndex / lineMaxCount) + 1) * (minStatuHeight + paddingBottom) + 'px';
                        windows[id].windowDom.style.left = stepIndex % lineMaxCount * (minStatuWidth + paddingLeft) + paddingLeft + 'px';
                        stepIndex++;
                    }
                }
            }
        },
        // 如果窗口已经打开，则显示并置顶
        ExistShow: function(id) {
            var windowDom = utils.getElementById("layx-" + id),
            winform = Layx.windows[id];
            Layx.setZindex(windowDom, winform);
            if (windowDom) {
                if (winform.status === "min") {
                    Layx.triggerMethod('restore', id, winform);
                }
            }
        },
        // 设置窗口zIndex
        setZindex: function(windowDom, winform) {
            if (windowDom && winform) {
                if (winform.alwaysOnTop === true) {
                    windowDom.style.zIndex = ++Layx.pinZindex;
                    winform.zIndex = Layx.pinZindex;
                } else {
                    windowDom.style.zIndex = ++Layx.zIndex;
                    winform.zIndex = Layx.zIndex;
                }
            }
        },
        // 设置窗口标题
        setTitle: function(id, txt) {
            var windowDom = utils.getElementById("layx-" + id),
            winform = Layx.windows[id];
            if (windowDom) {
                var title = utils.querySelector('.layx-title', windowDom);
                title.innerHTML = txt;
                title.setAttribute("title", txt);
                winform.title = txt;
            }
        },
        // 设置窗口闪烁并显示到顶层
        setFlicker: function(id) {
            var filcker = null;
            var windowDom = utils.getElementById("layx-" + id),
            winform = Layx.windows[id];
            if (windowDom) {
                if (windowDom.classList.contains('shadowFlicker')) windowDom.classList.remove('shadowFlicker');
                windowDom.classList.add('shadowFlicker');
                Layx.setZindex(windowDom, winform);
                filcker = setTimeout(function() {
                    windowDom.classList.remove('shadowFlicker');
                    clearTimeout(filcker);
                }, 120 * 8);
            }
        },
        // 设置置顶
        setOnTop: function(id) {
            var windowDom = utils.getElementById("layx-" + id),
            winform = Layx.windows[id];
            if (winform) {
                winform.alwaysOnTop = false;
                Layx.triggerMethod('pin', id, winform);
            }

        },
        // 取消置顶
        cancelOnTop: function(id) {
            var windowDom = utils.getElementById("layx-" + id),
            winform = Layx.windows[id];
            if (winform) {
                winform.alwaysOnTop = true;
                Layx.triggerMethod('pin', id, winform);
            }

        },
        // 设置位置
        setPosition: function(id, position) {
            var windowDom = utils.getElementById("layx-" + id),
            winform = Layx.windows[id];

            if (windowDom && winform) {
                var pos = utils.compilePositionParams(winform.defaultAreaInfo.width, width.defaultAreaInfo.height, position);
                windowDom.style.left = pos.left + 'px';
                windowDom.style.top = pos.top + 'px';
                winform.defaultAreaInfo.left = pos.left;
                winform.defaultAreaInfo.top = pos.top;
            }
        },
    };

    win.layx = {
        // 打开窗口
        open: function(options) {
            return Layx.create(options);
        },
        // 关闭窗口
        destroy: function(id) {
            Layx.destroy(id);
        },
        // 关闭所有窗口，调用此接口将不能执行 intercept定义的拦截器
        destroyAll: function() {},
        // 最小化窗口
        min: function(id) {
            Layx.min(id);
        },
        // 最大化窗口
        max: function(id) {
            Layx.max(id);
        },
        // 恢复窗口
        restore: function(id) {
            Layx.restore(id);
        },
        // 获取窗口信息
        getWindow: function(id) {
            return Layx.windows[id];
        },
        // 获取所有窗口信息
        Windows: Layx.windows,
        // 设置窗口标题
        setTitle: function(id, title) {
            Layx.setTitle(id, title);
        },
        // 设置窗口位置
        setPosition: function(id, position) {
            Layx.setPosition(id, position);
        },
        // 设置置顶
        setOnTop: function(id) {
            Layx.setOnTop(id);
        },
        // 取消置顶
        cancelOnTop: function(id) {
            Layx.cancelOnTop(id);
        },
    };

    if (over === slf) {
        over.layx = win.layx;
    }
}(top, window, self);

// symbol 字体图标
;
!(function(window) {
    var svgSprite = '<svg><symbol id="layx-icon-restore" viewBox="0 0 1157 1024"><path d="M1016.52185234 724.44050175L833.87364805 724.44050175 833.87364805 898.52098643 833.87364805 960.05279112 833.87364805 961.2211168 772.34184336 961.2211168 772.34184336 960.05279112 124.31068789 960.05279112 124.31068789 961.2211168 62.7788832 961.2211168 62.7788832 960.05279112 62.7788832 898.52098643 62.7788832 360.31241885 62.7788832 298.78061416 124.31068789 298.78061416 298.78061416 298.78061416 298.78061416 62.7788832 303.06447442 62.7788832 360.31241885 62.7788832 1016.52185234 62.7788832 1074.15923838 62.7788832 1078.05365615 62.7788832 1078.05365615 662.90869795 1078.05365615 724.44050175 1016.52185234 724.44050175ZM124.31068789 898.52098643L772.34184336 898.52098643 772.34184336 724.44050175 772.34184336 662.90869795 772.34184336 360.31241885 124.31068789 360.31241885 124.31068789 898.52098643ZM1016.52185234 124.31068789L360.31241885 124.31068789 360.31241885 298.78061416 772.34184336 298.78061416 833.87364805 298.78061416 833.87364805 360.31241885 833.87364805 662.90869795 1016.52185234 662.90869795 1016.52185234 124.31068789Z"  ></path></symbol><symbol id="layx-icon-windows" viewBox="0 0 1024 1024"><path d="M128 512 128 288 384 231.68 384 508.16 128 512M853.333333 128 853.333333 501.333333 426.666667 507.733333 426.666667 222.293333 853.333333 128M128 554.666667 384 558.506667 384 849.066667 128 800 128 554.666667M853.333333 565.333333 853.333333 938.666667 426.666667 857.173333 426.666667 558.933333 853.333333 565.333333Z"  ></path></symbol><symbol id="layx-icon-min" viewBox="0 0 1024 1024"><path d="M65.23884 456.152041 958.760137 456.152041l0 111.695918L65.23884 567.847959 65.23884 456.152041z"  ></path></symbol><symbol id="layx-icon-max" viewBox="0 0 1024 1024"><path d="M75.74912227 948.24738475L75.74912227 75.75145131l872.50059037 0 0 872.49593344L75.74912227 948.24738475zM839.18786674 184.81446115L184.81213326 184.81446115l0 654.37573462 654.37573461 0L839.18786674 184.81446115z"  ></path></symbol><symbol id="layx-icon-destroy" viewBox="0 0 1024 1024"><path d="M933.89254819 139.71606348L884.23129279 90.08990363 511.96490363 462.39138834 140.40044113 90.82692583 90.84447403 140.34779656 462.40893653 511.91225907 90.10745181 884.2137446 139.73361166 933.875 512.03509637 561.53841892 883.59955887 933.10288141 933.15552597 883.58201068 561.59106347 512.01754819Z"  ></path></symbol><symbol id="layx-icon-pin" viewBox="0 0 1024 1024"><path d="M326.4 5.65333333l7.89333333 174.72-224.74666666 376.64 168.32 117.86666667L77.22666667 1012.26666667l8.74666666 6.08 248.42666667-304 168.32 117.86666666L779.73333333 492.37333333l166.93333334-52.37333333L326.4 5.65333333z m-144.96 536.53333334l184.74666667-312.10666667L722.13333333 479.36 492.16 759.78666667l-310.72-217.6z m582.4-100.69333334l-1.92 0.64-374.4-262.18666666-0.10666667-2.02666667-2.98666666-66.56 442.88 310.18666667-63.46666667 19.94666666z" fill="" ></path></symbol><symbol id="layx-icon-refresh" viewBox="0 0 1024 1024"><path d="M1021.72444445 402.77333333V147.91111111l-83.12149334 83.12149334a509.39676445 509.39676445 0 0 0-425.07377778-228.79345778C232.01564445 2.23914667 3.76832 230.45006222 3.76832 512S232.01564445 1021.76085333 513.52917333 1021.76085333a509.79726222 509.79726222 0 0 0 472.44174222-317.99523555 43.65425778 43.65425778 0 1 0-80.93696-32.87722667 422.52515555 422.52515555 0 0 1-391.50478222 263.49112889C280.25742222 934.37952 91.14965333 745.27175111 91.14965333 512S280.25742222 89.62048 513.52917333 89.62048c150.69639111 0 286.64718222 79.73546667 361.83153778 204.61795555L766.86222222 402.77333333h254.86222223z" fill="" ></path></symbol></svg>';
    var script = function() { var scripts = document.getElementsByTagName("script"); return scripts[scripts.length - 1] }();
    var shouldInjectCss = script.getAttribute("data-injectcss");
    var ready = function(fn) {
        if (document.addEventListener) {
            if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) { setTimeout(fn, 0) } else {
                var loadFn = function() {
                    document.removeEventListener("DOMContentLoaded", loadFn, false);
                    fn()
                };
                document.addEventListener("DOMContentLoaded", loadFn, false)
            }
        } else if (document.attachEvent) { IEContentLoaded(window, fn) }

        function IEContentLoaded(w, fn) {
            var d = w.document,
            done = false,
            init = function() {
                if (!done) {
                    done = true;
                    fn()
                }
            };
            var polling = function() {
                try { d.documentElement.doScroll("left") } catch (e) { setTimeout(polling, 50); return }
                init()
            };
            polling();
            d.onreadystatechange = function() {
                if (d.readyState == "complete") {
                    d.onreadystatechange = null;
                    init()
                }
            }
        }
    };
    var before = function(el, target) { target.parentNode.insertBefore(el, target) };
    var prepend = function(el, target) { if (target.firstChild) { before(el, target.firstChild) } else { target.appendChild(el) } };

    function appendSvg() {
        var div, svg;
        div = document.createElement("div");
        div.innerHTML = svgSprite;
        svgSprite = null;
        svg = div.getElementsByTagName("svg")[0];
        if (svg) {
            svg.setAttribute("aria-hidden", "true");
            svg.style.position = "absolute";
            svg.style.width = 0;
            svg.style.height = 0;
            svg.style.overflow = "hidden";
            prepend(svg, document.body)
        }
    }
    if (shouldInjectCss && !window.__iconfont__svg__cssinject__) { window.__iconfont__svg__cssinject__ = true; try { document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>") } catch (e) { console && console.log(e) } }
    ready(appendSvg)
})(window);
