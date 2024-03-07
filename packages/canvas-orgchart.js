function _assertClassBrand(e, t, n) {
  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function _classPrivateFieldGet2(s, a) {
  return s.get(_assertClassBrand(s, a));
}
function _classPrivateFieldSet2(s, a, r) {
  return s.set(_assertClassBrand(s, a), r), r;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : String(i);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function () {};
      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}

/**
 * @method 判断某个点是否在矩形中
 * @param {number[]} origin: 矩形左上角坐标
 * @param {number} width: 矩形宽度
 * @param {number} height: 矩形高度
 * @param {number} x: 点的横坐标
 * @param {number} y: 点的纵坐标
 * @return {boolean}
 */
function pointInRect(origin, width, height, x, y) {
  var p = {
    x: x,
    y: y
  };
  var a = {
    x: origin[0],
    y: origin[1]
  };
  var b = {
    x: origin[0] + width,
    y: origin[1]
  };
  var c = {
    x: origin[0] + width,
    y: origin[1] + height
  };
  var d = {
    x: origin[0],
    y: origin[1] + height
  };
  return getCrossProduct(p, a, b) * getCrossProduct(p, c, d) >= 0 && getCrossProduct(p, b, c) * getCrossProduct(p, d, a) >= 0;
}

/**
 * @method 叉乘
 * @param {object} p
 * @param {object} p1
 * @param {object} p2
 * @return {boolean}
 */
function getCrossProduct(p, p1, p2) {
  return (p2.x - p1.x) * (p.y - p1.y) - (p.x - p1.x) * (p2.y - p1.y);
}

/**
 * @method reverseAssign
 * @param {object} target
 * @param {*} sources
 */
function reverseAssign(target) {
  if (target == null) {
    // null == undefined -> true
    throw new Error('Cannot convert undefined or null to object.');
  }
  var from = Object(target);
  for (var i = arguments.length - 1; i > 0; i--) {
    var source = arguments[i];
    if (source != null) {
      for (var key in source) {
        if (!Object.prototype.hasOwnProperty.call(from, key)) from[key] = source[key];
      }
    }
  }
  return from;
}

var EVENTS = {
  SELECT: 'select'
};
var _fns = /*#__PURE__*/new WeakMap();
var _chartWidth = /*#__PURE__*/new WeakMap();
var _chartHeight = /*#__PURE__*/new WeakMap();
var CanvasOrgChart = /*#__PURE__*/function () {
  function CanvasOrgChart(canvas) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      node: {}
    };
    _classCallCheck(this, CanvasOrgChart);
    _classPrivateFieldInitSpec(this, _fns, new Map());
    _classPrivateFieldInitSpec(this, _chartWidth, 0);
    _classPrivateFieldInitSpec(this, _chartHeight, 0);
    this.canvas = canvas;
    this.nodeAttr = {};
    this.options = {};
    var _options$width = options.width;
    this.options.width = _options$width === void 0 ? 0 : _options$width;
    var _options$height = options.height;
    this.options.height = _options$height === void 0 ? 0 : _options$height;
    var _options$padding = options.padding;
    this.options.padding = _options$padding === void 0 ? [0, 0, 0, 0] : _options$padding;
    var _options$background = options.background;
    this.options.background = _options$background === void 0 ? '' : _options$background;
    var _ref = options.node || {};
    var _ref$width = _ref.width;
    this.nodeAttr.width = _ref$width === void 0 ? 0 : _ref$width;
    var _ref$height = _ref.height;
    this.nodeAttr.height = _ref$height === void 0 ? 0 : _ref$height;
    var _ref$spacing = _ref.spacing;
    this.nodeAttr.spacing = _ref$spacing === void 0 ? [20, 20] : _ref$spacing;
    var _ref$radii = _ref.radii;
    this.nodeAttr.radii = _ref$radii === void 0 ? 8 : _ref$radii;
    var _ref$color = _ref.color;
    this.nodeAttr.color = _ref$color === void 0 ? 'white' : _ref$color;
    var _ref$borderColor = _ref.borderColor;
    this.nodeAttr.borderColor = _ref$borderColor === void 0 ? 'black' : _ref$borderColor;
    var _ref$background = _ref.background;
    this.nodeAttr.background = _ref$background === void 0 ? 'cornflowerblue' : _ref$background;
    var _ref$avatar = _ref.avatar;
    this.nodeAttr.avatar = _ref$avatar === void 0 ? null : _ref$avatar;
    var _ref$name = _ref.name;
    this.nodeAttr.name = _ref$name === void 0 ? null : _ref$name;
    var _ref$desc = _ref.desc;
    this.nodeAttr.desc = _ref$desc === void 0 ? null : _ref$desc;
    this.formatParams();
    this.originX = this.options.padding[3];
    this.originY = this.options.padding[0];
    this.ctx = null;
    _classPrivateFieldSet2(_chartWidth, this, this.originX);
    this.verifyParameter();
  }
  _createClass(CanvasOrgChart, [{
    key: "verifyParameter",
    value: function verifyParameter() {
      if (!this.canvas || !(this.canvas instanceof HTMLElement)) {
        throw new Error('Please pass a valid canvas.');
      }
      if (!Array.isArray(this.options.padding) || this.options.padding.length < 1) {
        throw new TypeError('padding must be an non-empty array.');
      }
      if (!Array.isArray(this.nodeAttr.spacing) || this.nodeAttr.spacing.length < 1) {
        throw new TypeError('nodeSpacing must be an non-empty array.');
      }
      if (typeof this.nodeAttr.background !== 'string') {
        throw new TypeError('nodeBackground must be a string.');
      }
      if (typeof this.options.width !== 'number' || typeof this.options.height !== 'number' || typeof this.nodeAttr.width !== 'number' || typeof this.nodeAttr.height !== 'number') {
        throw new TypeError('width or height must be a number.');
      }
    }
  }, {
    key: "formatParams",
    value: function formatParams() {
      switch (this.options.padding.length) {
        case 1:
          this.options.padding[1] = this.options.padding[0];
          this.options.padding[2] = this.options.padding[0];
          this.options.padding[3] = this.options.padding[0];
          break;
        case 2:
          this.options.padding[2] = this.options.padding[0];
          this.options.padding[3] = this.options.padding[1];
          break;
        case 3:
          this.options.padding[3] = this.options.padding[1];
          break;
      }
      if (this.nodeAttr.spacing.length === 1) {
        this.nodeAttr.spacing[1] = this.nodeAttr.spacing[0];
      }
    }
  }, {
    key: "render",
    value: function render(data) {
      var canvas = this.canvas;
      if (canvas.getContext) {
        this.ctx = canvas.getContext('2d');
        /* 设置线宽，宽度如果为奇数会导致像素渲染时侵染
        * reference-link: https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors
        */
        // this.ctx.lineWidth = 2
        if (data) {
          this.calcNodesPosition(data, this.originY);
          _classPrivateFieldSet2(_chartWidth, this, _classPrivateFieldGet2(_chartWidth, this) - this.nodeAttr.spacing[0]);
          _classPrivateFieldSet2(_chartHeight, this, _classPrivateFieldGet2(_chartHeight, this) + this.nodeAttr.height);
          this.setCanvasSize(canvas, this.options.width || _classPrivateFieldGet2(_chartWidth, this) + this.options.padding[1], this.options.height || _classPrivateFieldGet2(_chartHeight, this) + this.options.padding[2]);
          this.drawChart(this.ctx, data, false);
          canvas.addEventListener('click', this.selectEvent(data).bind(this));
        } else {
          throw new Error('data can\'t be empty.');
        }
      } else {
        throw new Error('can\'t get canvas context.');
      }
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(event, fn) {
      if (!_classPrivateFieldGet2(_fns, this).has(event)) {
        _classPrivateFieldGet2(_fns, this).set(event, []);
      }
      _classPrivateFieldGet2(_fns, this).get(event).push(fn);
    }

    /**
     * @method 赋值节点属性
     * @param {object} node
     */
  }, {
    key: "setAttribute",
    value: function setAttribute(node) {
      if (!node.nodeAttr) node.nodeAttr = {};
      reverseAssign(node.nodeAttr, this.nodeAttr);
    }

    /**
     * @method 计算节点位置
     * @param {object} current
     * @param {number} y
     */
  }, {
    key: "calcNodesPosition",
    value: function calcNodesPosition(node, y) {
      var _node$children;
      var length = ((_node$children = node.children) === null || _node$children === void 0 ? void 0 : _node$children.length) || 0;
      this.setAttribute(node);
      node.nodeAttr.y = y;
      if (y > _classPrivateFieldGet2(_chartHeight, this)) {
        _classPrivateFieldSet2(_chartHeight, this, y);
      }
      if (length === 0) {
        node.nodeAttr.x = _classPrivateFieldGet2(_chartWidth, this);
        _classPrivateFieldSet2(_chartWidth, this, _classPrivateFieldGet2(_chartWidth, this) + (node.nodeAttr.width + node.nodeAttr.spacing[0]));
      } else {
        y += node.nodeAttr.height + this.nodeAttr.spacing[1];
        var _iterator = _createForOfIteratorHelper(node.children),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            this.calcNodesPosition(item, y);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        if (length === 1) {
          node.nodeAttr.x = node.children[0].x;
        } else {
          node.nodeAttr.x = Math.round(node.children[0].nodeAttr.x + (node.children[length - 1].nodeAttr.x - node.children[0].nodeAttr.x) / 2);
        }
      }
    }

    /**
     * @method 绘图
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {object} node
     */
  }, {
    key: "drawChart",
    value: function drawChart(ctx, node) {
      if (this.options.background) this.drawBackground(ctx);
      this.drawNode(ctx, node);
    }

    /**
     * @method 绘制背景
     * @param {object} ctx: CanvasRenderingContext2D
     */
  }, {
    key: "drawBackground",
    value: function drawBackground(ctx) {
      ctx.save();
      ctx.fillStyle = this.options.background;
      ctx.fillRect(0, 0, this.options.width || _classPrivateFieldGet2(_chartWidth, this) + this.options.padding[1], this.options.height || _classPrivateFieldGet2(_chartHeight, this) + this.options.padding[2]);
      ctx.restore();
    }

    /**
     * @method 绘制节点 
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {object} node
     */
  }, {
    key: "drawNode",
    value: function drawNode(ctx, node) {
      var _node$children2,
        _this = this;
      var _node$nodeAttr = node.nodeAttr,
        x = _node$nodeAttr.x,
        y = _node$nodeAttr.y,
        width = _node$nodeAttr.width,
        height = _node$nodeAttr.height,
        borderColor = _node$nodeAttr.borderColor,
        background = _node$nodeAttr.background,
        radii = _node$nodeAttr.radii,
        avatar = _node$nodeAttr.avatar;
      ctx.save();
      ctx.beginPath();
      // 填充
      ctx.roundRect(x, y, width, height, radii);
      ctx.fillStyle = background;
      ctx.fill();
      // 边框
      ctx.roundRect(x, y, width, height, radii);
      ctx.strokeStyle = borderColor;
      ctx.stroke();
      ctx.restore();
      // 头像
      if (avatar) {
        this.drawImg(ctx, node);
      }
      // 名字
      if (node.name) {
        this.drawText({
          ctx: ctx,
          x: node.nodeAttr.x,
          y: node.nodeAttr.y,
          nodeWidth: node.nodeAttr.width,
          text: node.name,
          textStyle: node.nodeAttr.name
        });
      }
      // 描述
      (_node$children2 = node.children) === null || _node$children2 === void 0 || _node$children2.map(function (node) {
        _this.drawNode(ctx, node);
      });
      // 连接线
      this.drawLinkLine(ctx, node);
    }

    /**
     * @method 绘线
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {array} start: 起始坐标
     * @param {array} end: 结束坐标
     */
  }, {
    key: "drawLine",
    value: function drawLine(ctx, start, end) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo.apply(ctx, _toConsumableArray(start));
      ctx.lineTo.apply(ctx, _toConsumableArray(end));
      ctx.stroke();
      ctx.restore();
    }

    /**
     * @method 绘制图片
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {object} node
     */
  }, {
    key: "drawImg",
    value: function drawImg(ctx, node) {
      var img = new Image();
      var _node$nodeAttr$avatar = node.nodeAttr.avatar,
        offsetX = _node$nodeAttr$avatar.offsetX,
        offsetY = _node$nodeAttr$avatar.offsetY,
        width = _node$nodeAttr$avatar.width,
        height = _node$nodeAttr$avatar.height,
        url = _node$nodeAttr$avatar.url,
        circle = _node$nodeAttr$avatar.circle;
      var _node$nodeAttr2 = node.nodeAttr,
        x = _node$nodeAttr2.x,
        y = _node$nodeAttr2.y;
      x += offsetX;
      y += offsetY;
      img.src = url;
      img.onload = function () {
        ctx.save();
        if (circle) {
          var radius = width / 2;
          ctx.beginPath();
          ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
          ctx.clip();
          ctx.closePath();
          ctx.drawImage(this, x, y, width, height);
        } else {
          ctx.drawImage(this, x, y, width, height);
        }
        ctx.restore();
      };
      img.onerror = function () {
        console.error('img loaded fail.');
      };
    }

    /**
     * @method 绘制文字
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {string} x
     * @param {string} y
     * @param {string} nodeWidth: 节点宽度
     * @param {string} text: 文本
     * @param {object} textStyle: 文本样式
     */
  }, {
    key: "drawText",
    value: function drawText(_ref2) {
      var ctx = _ref2.ctx,
        x = _ref2.x,
        y = _ref2.y,
        nodeWidth = _ref2.nodeWidth,
        text = _ref2.text,
        textStyle = _ref2.textStyle;
      var offsetX = textStyle.offsetX,
        offsetY = textStyle.offsetY,
        color = textStyle.color,
        font = textStyle.font,
        textAlign = textStyle.textAlign;
      ctx.save();
      ctx.font = font;
      ctx.fillStyle = color;
      x += offsetX;
      y += offsetY;
      var textWidth = ctx.measureText(text).width;
      switch (textAlign) {
        case 'center':
          x += (nodeWidth - textWidth) / 2;
          break;
        case 'right':
          x += nodeWidth - textWidth;
          break;
      }
      ctx.fillText(text, x, y);
      ctx.restore();
    }

    /**
     * @method 绘制连接线
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {object} node
     */
  }, {
    key: "drawLinkLine",
    value: function drawLinkLine(ctx, node) {
      var length = node.children.length;
      var lw = ctx.lineWidth;
      ctx.strokeStyle = 'black';
      ctx.lineCap = 'butt';
      var tempX = node.nodeAttr.x + (node._width || this.nodeAttr.width) / 2;
      if (node.nodeAttr.y > this.originY) {
        this.drawLine(ctx, [tempX, node.nodeAttr.y - lw], [tempX, node.nodeAttr.y - this.nodeAttr.spacing[1] / 2]);
      }
      if (length > 0) {
        var tempY = node.nodeAttr.y + node.nodeAttr.height;
        this.drawLine(ctx, [tempX, tempY + lw], [tempX, tempY + this.nodeAttr.spacing[1] / 2 + node.nodeAttr.height - this.nodeAttr.height]);
        var y = node.nodeAttr.y + this.nodeAttr.height + this.nodeAttr.spacing[1] / 2 + lw;
        this.drawLine(ctx, [node.children[0].nodeAttr.x + node.nodeAttr.width / 2, y], [node.children[length - 1].nodeAttr.x + node.nodeAttr.width / 2, y]);
      }
    }

    /**
     * @method 设置canvas宽高
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {number} width
     * @param {number} height
     */
  }, {
    key: "setCanvasSize",
    value: function setCanvasSize(canvas, width, height) {
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
    }

    /**
     * @method 选中事件
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {object} data
     */
  }, {
    key: "selectEvent",
    value: function selectEvent(data) {
      return function (event) {
        var rect = this.canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        // 判断点击坐标是否在 tree chart 绘制范围内和是否重复点击
        if (pointInRect([this.originX, this.originY], _classPrivateFieldGet2(_chartWidth, this) - this.options.padding[3], _classPrivateFieldGet2(_chartHeight, this) - this.options.padding[0], x, y)) {
          // valid range
          var target = this.getSelected([data], x, y) || null;
          _classPrivateFieldGet2(_fns, this).get(EVENTS.SELECT).map(function (fn) {
            fn(target);
          });
        }
      };
    }

    /**
     * @method 是否点击节点
     * @param {object[]} nodeList
     * @param {number} x: 点击时的横坐标
     * @param {number} y: 点击时的纵坐标
     */
  }, {
    key: "getSelected",
    value: function getSelected(nodeList, x, y) {
      var _iterator2 = _createForOfIteratorHelper(nodeList),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _node$children3;
          var node = _step2.value;
          if (pointInRect([node.nodeAttr.x, node.nodeAttr.y], node._width || this.nodeAttr.width, node._height || this.nodeAttr.height, x, y)) {
            return node;
          } else if ((_node$children3 = node.children) !== null && _node$children3 !== void 0 && _node$children3.length) {
            var target = this.getSelected(node.children, x, y);
            if (target) return target;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }]);
  return CanvasOrgChart;
}();

export { CanvasOrgChart as default };
