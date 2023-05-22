/**
 * Created by Lreebom on 2016/1/16.
 */
function DragLi(dragArr, callback) {

    this.dragArr = dragArr;
    this.callback = callback;

    this.isEnable = true;

    this.isDraging = false;

    this.dragLi = null;

    this.dragDiv = null;
    this.dragIndex = -1;

    this.coneDiv = null;

    this.offsetX = 0;
    this.offsetY = 0;

    this.rectArr = [];

    this.lastSwapIndex = -1;

    var isFireFox = navigator.userAgent.indexOf("Firefox") > 0;

    var that = this;

    //设置是否可拖拽
    this.setEnable = function (enable) {
        this.isEnable = enable;

        for (var i = 0; i < this.dragArr.length; i++) {

            var isKongwei = this.isKongWei(this.dragArr[i]);

            this.dragArr[i].setAttribute("draggable", isKongwei ? false.toString() : enable);
        }

    };

    //设置Li空位状态
    this.setKongWei = function (element, isKongwei) {

        var inDiv = element.getElementsByTagName("div")[0];
        if (inDiv != null) {
            inDiv.setAttribute("kongwei", isKongwei.toString());
        }
    };

    this.isKongWei = function (element) {

        var isKongWei = false;

        if (element.hasAttribute("kongwei")) {
            isKongWei = (element.getAttribute("kongwei") == "true");
        }

        return isKongWei;
    };

    for (var i = 0; i < this.dragArr.length; i++) {
        DragEventUtil.addHandler(this.dragArr[i], "mousedown", function (event) {
            that.mouseDownEvent(event);
        });
        DragEventUtil.addHandler(this.dragArr[i], "touchstart", function (event) {
            that.touchStartEvent(event);
        });
    }

    DragEventUtil.addHandler(document, "mousemove", function (event) {
        that.mouseMoveEvent(event);
    });
    DragEventUtil.addHandler(document, "touchmove", function (event) {
        that.touchMoveEvent(event);
    });

    DragEventUtil.addHandler(document, "mouseup", function (event) {
        that.dragEndEvent(event);
    });
    DragEventUtil.addHandler(document, "touchend", function (event) {
        that.dragEndEvent(event);
    });

    this.mouseDownEvent = function (event) {
        if (!this.isEnable) return;

        this.dragLi = event.currentTarget;

        this.dragIndex = indexOfArray(event.currentTarget, this.dragArr);
        if (this.dragIndex == -1) return;

        this.dragDiv = event.currentTarget.getElementsByTagName("div")[0];
        if (this.dragDiv == null) return;

        if (this.isKongWei(this.dragDiv)) return;

        this.coneDiv = this.dragDiv.cloneNode(true);

        event.currentTarget.parentNode.parentNode.appendChild(this.coneDiv);

        this.offsetX = event.pageX - getLeft(this.dragDiv);
        this.offsetY = event.pageY - getTop(this.dragDiv);

        this.coneDiv.style.position = "absolute";
        this.coneDiv.style.width = this.dragDiv.offsetWidth;
        this.coneDiv.style.height = this.dragDiv.offsetHeight;

        this.coneDiv.style.left = (event.pageX - this.offsetX) + "px";
        this.coneDiv.style.top = (event.pageY - this.offsetY) + "px";

        this.dragDiv.style.opacity = 0.2;

        this.rectArr = getRects(this.dragArr);

        this.lastSwapIndex = -1;

        this.callback("start", {target: this.dragLi});

        this.isDraging = true;
    };

    this.touchStartEvent = function (event) {
        if (!this.isEnable) return;

        this.dragLi = event.currentTarget;

        this.dragIndex = indexOfArray(event.currentTarget, this.dragArr);
        if (this.dragIndex == -1) return;

        this.dragDiv = event.currentTarget.getElementsByTagName("div")[0];
        if (this.dragDiv == null) return;

        if (this.isKongWei(this.dragDiv)) return;

        this.coneDiv = this.dragDiv.cloneNode(true);

        event.currentTarget.parentNode.parentNode.appendChild(this.coneDiv);

        var curTouch = event.changedTouches[0];

        this.offsetX = curTouch.pageX - getLeft(this.dragDiv);
        this.offsetY = curTouch.pageY - getTop(this.dragDiv);

        this.coneDiv.style.position = "absolute";
        this.coneDiv.style.width = this.dragDiv.offsetWidth;
        this.coneDiv.style.height = this.dragDiv.offsetHeight;

        this.coneDiv.style.left = (curTouch.pageX - this.offsetX) + "px";
        this.coneDiv.style.top = (curTouch.pageY - this.offsetY) + "px";

        this.dragDiv.style.opacity = 0.2;

        this.rectArr = getRects(this.dragArr);

        this.lastSwapIndex = -1;

        this.callback("start", {target: this.dragLi});

        this.isDraging = true;
    };

    this.mouseMoveEvent = function (event) {
        if (!this.isEnable) return;

        event.preventDefault();

        if (this.isDraging) {

            this.coneDiv.style.left = (event.pageX - this.offsetX) + "px";
            this.coneDiv.style.top = (event.pageY - this.offsetY) + "px";

            var coneDivCenter = getCenter(this.coneDiv);

            var inRectIndex = getInRectIndex(coneDivCenter, this.rectArr);

            if (inRectIndex == -1 || inRectIndex == this.dragIndex) {
                if (this.lastSwapIndex != -1 && this.lastSwapIndex != this.dragIndex) {
                    swapChildren(this.dragArr[this.lastSwapIndex], this.dragArr[this.dragIndex]);

                    this.callback("move", {target: this.dragLi, fromIndex: this.lastSwapIndex, toIndex: this.dragIndex});
                }
            }
            else {
                if (this.lastSwapIndex != inRectIndex) {
                    if (this.lastSwapIndex != -1 && this.lastSwapIndex != this.dragIndex) {
                        swapChildren(this.dragArr[this.lastSwapIndex], this.dragArr[this.dragIndex]);
                    }

                    swapChildren(this.dragArr[inRectIndex], this.dragArr[this.dragIndex]);

                    this.callback("move", {target: this.dragLi, fromIndex: this.dragIndex, toIndex: inRectIndex});
                }
            }

            this.lastSwapIndex = inRectIndex;
        }
    };

    this.touchMoveEvent = function (event) {
        if (!this.isEnable) return;

        if (this.isDraging) {

            event.preventDefault();

            var curTouch = event.changedTouches[0];

            this.coneDiv.style.left = (curTouch.pageX - this.offsetX) + "px";
            this.coneDiv.style.top = (curTouch.pageY - this.offsetY) + "px";

            var coneDivCenter = getCenter(this.coneDiv);

            var inRectIndex = getInRectIndex(coneDivCenter, this.rectArr);

            if (inRectIndex == -1 || inRectIndex == this.dragIndex) {
                if (this.lastSwapIndex != -1 && this.lastSwapIndex != this.dragIndex) {
                    swapChildren(this.dragArr[this.lastSwapIndex], this.dragArr[this.dragIndex]);
                }
            }
            else {
                if (this.lastSwapIndex != inRectIndex) {
                    if (this.lastSwapIndex != -1 && this.lastSwapIndex != this.dragIndex) {
                        swapChildren(this.dragArr[this.lastSwapIndex], this.dragArr[this.dragIndex]);
                    }

                    swapChildren(this.dragArr[inRectIndex], this.dragArr[this.dragIndex]);
                }
            }

            this.lastSwapIndex = inRectIndex;
        }
    };

    this.dragEndEvent = function (event) {
        if (this.isDraging) {
            this.coneDiv.parentNode.removeChild(this.coneDiv);
        }
        if (this.dragDiv)
            this.dragDiv.style.opacity = 1;

        this.isDraging = false;

        this.callback("end", {target: this.dragLi});
    };

}

function setDragLi(dragArr, callback) {
    return new DragLi(dragArr, callback);
}

function getTop(e) {
    var top = e.offsetTop;
    if (e.offsetParent != null) {
        top += arguments.callee(e.offsetParent);
    }
    return top;
}

function getLeft(e) {
    var left = e.offsetLeft;
    if (e.offsetParent != null) {
        left += arguments.callee(e.offsetParent);
    }
    return left;
}

function getCenter(e) {
    var x = getLeft(e) + e.offsetWidth * 0.5;
    var y = getTop(e) + e.offsetHeight * 0.5;

    return {x: x, y: y};
}

function getRects(eles) {
    var rects = [];
    for (var i = 0; i < eles.length; i++) {
        var curEle = eles[i];
        rects[i] = {top: getTop(curEle), left: getLeft(curEle), width: curEle.offsetWidth, height: curEle.offsetHeight};
    }
    return rects;
}

function isInRect(pos, rect) {
    return (pos.x > rect.left && pos.x < rect.left + rect.width && pos.y > rect.top && pos.y < rect.top + rect.height);
}

function getInRectIndex(pos, rects) {
    var inIndex = -1;
    for (var i = 0; i < rects.length; i++) {
        if (isInRect(pos, rects[i])) {
            inIndex = i;
            return inIndex;
        }
    }
    return inIndex;
}

function getHitNode(nodeList, avoidNode, x, y) {

    for (var i = 0; i < nodeList.length; i++) {
        if (nodeList[i] == avoidNode)
            continue;

        var isIn = isInRect({x: x, y: y}, {
            top: getTop(nodeList[i]),
            left: getLeft(nodeList[i]),
            width: nodeList[i].offsetWidth,
            height: nodeList[i].offsetHeight
        });

        if (isIn) {
            return nodeList[i];
        }
    }

    return null;
}

function indexOfParent(e) {
    var index = 0;
    while ((e = e.previousSibling)) {
        if (e.nodeType != 3 || !/^\s*$/.test(e.data)) {
            index++;
        }
    }
    return index;
}

function indexOfArray(e, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == e) {
            return i;
        }
    }
    return -1;
}

function indexLiOfUR(li, ur) {
    var liArr = ur.getElementsByTagName("li");
    return indexOfArray(li, liArr);
}

function swapChildren(node1, node2) {
    var node1Temp = [];
    for (var i = 0; i < node1.childNodes.length; i++) {
        node1Temp[i] = node1.childNodes[i];
    }
    var node2Temp = [];
    for (i = 0; i < node2.childNodes.length; i++) {
        node2Temp[i] = node2.childNodes[i];
    }

    for (var j = 0; j < node2Temp.length; j++) {
        node1.appendChild(node2Temp[j]);
    }
    for (j = 0; j < node1Temp.length; j++) {
        node2.appendChild(node1Temp[j]);
    }


}

DragEventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        }
        else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        }
        else {
            element["on" + type] = handler;
        }
    },

    removeHandler: function (element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        }
        else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        }
        else {
            element["on" + type] = null;
        }
    }
};
