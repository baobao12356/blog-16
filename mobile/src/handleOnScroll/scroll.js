const rAF = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) { window.setTimeout(callback, 1000 / 60); };

const cancelRAF = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    clearTimeout;


export function animateToTop(el, cb){
    let { scrollTop } = el
    let interval = null
    interval = setInterval(() => {
        el.scrollTop = scrollTop
        scrollTop -= 8
        if (scrollTop <= 0) {
            clearInterval(interval)
            cb && cb()
        }
    }, 0)
}

export class Scroll {
    constructor(el) {
        let sy = el.scrollY;
        this.el = el        
        this.onScroll = this.onScroll;
        this.onScrollEnd = this.onScrollEnd;
        this.scrollList = [];
        this.scrollEndList = [];
        this.scrollTimer = null;
        this.nowWsy = sy;
        this.lastY = sy;
        this.direction = 0;
        this.rafMark = null;
        this.rafingMark = false;
        this.gap = 0;
        this.exportstatus = {}
        this.bindEvent();
    }
    onScroll(cb) {
        if (typeof cb !== 'function') {
            return;
        }
        this.scrollList.push(cb);
    }
    onScrollEnd(cb) {
        if (typeof cb !== 'function') {
            return;
        }
        this.scrollEndList.push(cb);
    }
    scrollEnd() {
        let winInfo = {
            sy: this.nowWsy,
            gap: Math.abs(this.gap),
            dir: this.direction,
        }
        for (let i = 0, len = this.scrollEndList.length; i < len; i++) {
            try {
                this.scrollEndList[i](winInfo);
            } catch (error) {
                console.warn(error)
            }
        }
    }
    rafing() {
        this.nowWsy = this.el.scrollY || this.el.scrollTop;
        this.gap = this.nowWsy - this.lastY;
        // 1为向上滑动 -1 为向下滑动 --- 页面相对视窗
        !!this.gap && (this.direction = (((this.gap >= 0) | 0) - 0.5) * 2);
        this.lastY = this.nowWsy;
        let winInfo = {
            sy: this.nowWsy, //当前el的scrollY
            gap: Math.abs(this.gap), //上次到这次滑动的距离
            dir: this.direction, //滑动方向
        }
        this.exportstatus = winInfo
        for (let i = 0, len = this.scrollList.length; i < len; i++) {
            try {
                this.scrollList[i](winInfo);
            } catch (error) {
                console.warn(error)
            }
        }

        this.startRaf();
    }
    startRaf() {
        let _this = this;
        this.rafMark = rAF(function () {
            _this.rafing();
        })
    }
    bindEvent() {
        let _this = this;
        _this.el.addEventListener('scroll', function () {        
            clearTimeout(_this.scrollTimer);

            if (!_this.rafingMark) {
                _this.startRaf();
                _this.rafingMark = true;
            }

            _this.scrollTimer = setTimeout(function () {
                cancelRAF(_this.rafMark);
                _this.scrollEnd();
                _this.rafingMark = false;
            }, 500);
        }, 0)
    }
}

