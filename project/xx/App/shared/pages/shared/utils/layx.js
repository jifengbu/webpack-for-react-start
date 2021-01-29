/*
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
*/
export function showDialog (component, options = {}) {
    let full = options.full === undefined ? true : options.full;
    if (options.width || options.height) {
        full = false;
    }
    if (full) {
        options.width = window.innerWidth;
        options.height = window.innerHeight;
    }
    if (options.shadable == false) {
        options.shadable = false;
    } else {
        options.shadable = true;
    }
    if (options.resize === false) {
        options.minimizable = false;
        options.maximizable = false;
        options.resizable = false;
    }
    const dialog = window.layx.open({
        id: 'layx-' + Date.now() + '-' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
        ...{ width: 800, height: 600, alwaysOnTop: true, shadable: false, ...options },
        render: (div) => window.__renderStore(component, div),
    });
    return {
        id: dialog.id,
        close: () => window.layx.destroy(dialog.id),
    };
}
