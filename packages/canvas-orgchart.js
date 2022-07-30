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
    Object.defineProperty(target, descriptor.key, descriptor);
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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
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

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

var CanvasOrgChart = /*#__PURE__*/function () {
  function CanvasOrgChart(canvas) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      node: {}
    };

    _classCallCheck(this, CanvasOrgChart);

    _defineProperty(this, "_lastClickNode", null);

    _defineProperty(this, "_isFindNode", false);

    _defineProperty(this, "_chartWidth", 0);

    _defineProperty(this, "_chartHeight", 0);

    this.canvas = canvas;
    var _options$scale = options.scale;
    this.scale = _options$scale === void 0 ? [1, 1] : _options$scale;
    var _options$padding = options.padding;
    this.padding = _options$padding === void 0 ? [0, 0, 0, 0] : _options$padding;
    var _options$nodeTemplate = options.nodeTemplate;
    this.nodeTemplate = _options$nodeTemplate === void 0 ? [] : _options$nodeTemplate;
    var _options$defaultAvata = options.defaultAvatar;
    this.defaultAvatar = _options$defaultAvata === void 0 ? '' : _options$defaultAvata;
    var _options$width = options.width;
    this.width = _options$width === void 0 ? 0 : _options$width;
    var _options$height = options.height;
    this.height = _options$height === void 0 ? 0 : _options$height;

    var _ref = options.node || {};

    var _ref$spacing = _ref.spacing;
    this.nodeSpacing = _ref$spacing === void 0 ? [20, 20] : _ref$spacing;
    var _ref$color = _ref.color;
    this.nodeColor = _ref$color === void 0 ? 'white' : _ref$color;
    var _ref$background = _ref.background;
    this.nodeBackground = _ref$background === void 0 ? 'cornflowerblue' : _ref$background;
    var _ref$customBackground = _ref.customBackgrounds;
    this.nodeCustomBackgrounds = _ref$customBackground === void 0 ? [] : _ref$customBackground;
    var _ref$customAvatar = _ref.customAvatar;
    this.customAvatar = _ref$customAvatar === void 0 ? null : _ref$customAvatar;
    var _ref$width = _ref.width;
    this.nodeWidth = _ref$width === void 0 ? 60 : _ref$width;
    var _ref$height = _ref.height;
    this.nodeHeight = _ref$height === void 0 ? 160 : _ref$height;
    this.formatParams();
    this.originX = this.padding[3];
    this.originY = this.padding[0];
    this.ctx = null;
    this._chartWidth = this.originX;
    this.verifyParameter();
  }

  _createClass(CanvasOrgChart, [{
    key: "selected",
    get: function get() {
      return this._lastClickNode;
    }
  }, {
    key: "verifyParameter",
    value: function verifyParameter() {
      if (!this.canvas || !(this.canvas instanceof HTMLElement)) {
        throw new Error('Please pass a valid canvas.');
      }

      if (!Array.isArray(this.nodeCustomBackgrounds)) {
        throw new TypeError('nodeCustomBackgrounds must be an array.');
      }

      if (!Array.isArray(this.padding) || this.padding.length < 1) {
        throw new TypeError('padding must be an non-empty array.');
      }

      if (!Array.isArray(this.nodeSpacing) || this.nodeSpacing.length < 1) {
        throw new TypeError('nodeSpacing must be an non-empty array.');
      }

      if (!Array.isArray(this.scale)) {
        throw new TypeError('scale must be an array.');
      }

      if (typeof this.nodeBackground !== 'string') {
        throw new TypeError('nodeBackground must be a string.');
      }

      if (typeof this.width !== 'number' || typeof this.height !== 'number' || typeof this.nodeWidth !== 'number' || typeof this.nodeHeight !== 'number') {
        throw new TypeError('width or height must be a number.');
      }

      if (typeof this.nodeTemplate !== 'function' && !Array.isArray(this.nodeTemplate)) {
        throw new TypeError('customNode must be a function or an array.');
      }
    }
  }, {
    key: "formatParams",
    value: function formatParams() {
      switch (this.padding.length) {
        case 1:
          this.padding[1] = this.padding[0];
          this.padding[2] = this.padding[0];
          this.padding[3] = this.padding[0];
          break;

        case 2:
          this.padding[2] = this.padding[0];
          this.padding[3] = this.padding[1];
          break;

        case 3:
          this.padding[3] = this.padding[1];
          break;
      }

      if (this.nodeSpacing.length === 1) {
        this.nodeSpacing[1] = this.nodeSpacing[0];
      }
    }
  }, {
    key: "render",
    value: function render(data) {
      var canvas = this.canvas;

      if (canvas.getContext) {
        this.ctx = canvas.getContext('2d');

        if (data) {
          var _this$ctx;

          this.nodeTemplate === [] ? this.calculateCoordinate(data, this.originY) : this.calculateCustomCoordinate(data, this.originY);
          this._chartWidth -= this.nodeSpacing[0];
          this._chartHeight += this.nodeHeight;
          this.setCanvasSize(canvas, this.width || this._chartWidth + this.padding[1], this.height || this._chartHeight + this.padding[2]);

          (_this$ctx = this.ctx).scale.apply(_this$ctx, _toConsumableArray(this.scale));

          this.drawChart(this.ctx, data, false);
          this.bindClick(canvas, data);
        } else {
          throw new Error('data can\'t be empty.');
        }
      } else {
        throw new Error('can\'t get canvas context.');
      }
    }
    /**
     * @method 计算坐标
     * @param {object} current
     * @param {number} y
     */

  }, {
    key: "calculateCoordinate",
    value: function calculateCoordinate(current, y) {
      var length = current.children.length;
      current.y = y;

      if (current.y > this._chartHeight) {
        this._chartHeight = current.y;
      }

      if (length <= 0) {
        current.x = this._chartWidth;
        this._chartWidth += this.nodeWidth + this.nodeSpacing[0];
      } else {
        y += this.nodeHeight + this.nodeSpacing[1];

        var _iterator = _createForOfIteratorHelper(current.children),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            this.calculateCoordinate(item, y);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (length === 1) {
          current.x = current.children[0].x;
        } else {
          current.x = Math.round(current.children[0].x + (current.children[length - 1].x - current.children[0].x) / 2);
        }
      }
    }
    /**
     * @method 计算自定义节点坐标
     * @param {object} current
     * @param {number} y
     */

  }, {
    key: "calculateCustomCoordinate",
    value: function calculateCustomCoordinate(current, y) {
      var length = current.children.length;
      current.y = y;

      if (Array.isArray(this.nodeTemplate) && this.nodeTemplate.length > 0) {
        var _iterator2 = _createForOfIteratorHelper(this.nodeTemplate.entries()),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                index = _step2$value[0],
                custom = _step2$value[1];

            if (custom.checkOwn && Object.prototype.hasOwnProperty.call(current, custom.attributeName) || current[custom.attributeName]) {
              current._isCustom = index;
              current._width = custom.width;
              current._height = custom.height;
              break;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      if (current.y > this._chartHeight) {
        this._chartHeight = current.y;
      }

      if (length <= 0) {
        current.x = this._chartWidth;
        this._chartWidth += (current._width || this.nodeWidth) + this.nodeSpacing[0];
      } else {
        y += this.nodeHeight + this.nodeSpacing[1];

        var _iterator3 = _createForOfIteratorHelper(current.children),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var item = _step3.value;
            this.calculateCustomCoordinate(item, y);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        if (length === 1) {
          current.x = current.children[0].x;
        } else {
          // 如果坐标有小数点，渲染时会模糊
          var offsetX = ((current.children[0]._width || this.nodeWidth) - this.nodeWidth) / 2 - ((current._width || this.nodeWidth) - this.nodeWidth) / 2;
          current.x = Math.round(current.children[0].x + (current.children[length - 1].x - current.children[0].x) / 2 + offsetX);
        }
      }
    }
    /**
     * @method 绘图
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {object} current
     */

  }, {
    key: "drawChart",
    value: function drawChart(ctx, current) {
      if (typeof this.nodeTemplate === 'function') {
        this.nodeTemplate(this, ctx, current.x, current.y, current);
      } else if (current._isCustom !== undefined) {
        this.nodeTemplate[current._isCustom].draw(this, ctx, current.x, current.y, current);
      } else {
        this.drawNode(ctx, current.x, current.y, current);
      }

      this.drawNodeLine(ctx, current);
    }
    /**
     * @method 绘制节点
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {number} x: 起始横坐标
     * @param {number} y: 起始纵坐标
     * @param {object} node
     */

  }, {
    key: "drawNode",
    value: function drawNode(ctx, x, y, node) {
      this.drawAvatar(ctx, x, y, node); // node color

      ctx.fillStyle = this.nodeBackground;

      var _iterator4 = _createForOfIteratorHelper(this.nodeCustomBackgrounds),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var paint = _step4.value;

          if (paint.checkOwn && Object.prototype.hasOwnProperty.call(node, paint.attributeName) || node[paint.attributeName] !== undefined) {
            typeof paint.color === 'string' ? ctx.fillStyle = paint.color : ctx.fillStyle = paint.color[node[paint.attributeName]];
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      var height = this.nodeHeight - this.nodeWidth;
      ctx.fillRect(x, y + this.nodeWidth, this.nodeWidth, height);
      ctx.stroke();
      this.drawVerticalText(ctx, x, y + this.nodeWidth, node._width || this.nodeWidth, height, node.name);
    }
    /**
     * @method 绘制头像
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {number} x: 起始横坐标
     * @param {number} y: 起始纵坐标
     * @param {string} avatarUrl: 头像地址
     */

  }, {
    key: "drawAvatar",
    value: function drawAvatar(ctx, x, y, person) {
      var width = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.nodeWidth;
      // Object.prototype.hasOwnProperty.call(person, 'sex')
      var img = new Image();
      var that = this;

      if (person.avatar) {
        img.src = person.avatar;
      } else if (this.customAvatar && Object.prototype.hasOwnProperty.call(person, this.customAvatar.attributeName)) {
        img.src = this.customAvatar.avatars[person[this.customAvatar.attributeName]];
      } else {
        img.src = this.defaultAvatar;
      }

      img.onload = function () {
        ctx.drawImage(this, x, y, width, width);
      };

      img.onerror = function () {
        that.drawImageError(ctx, x, y, width, width);
      };
    }
    /**
     * @method 绘制纵向文字
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {number} x: 起始横坐标
     * @param {number} y: 起始纵坐标
     * @param {string} content: 内容
     * @param {number} height: 绘制总长度
     */

  }, {
    key: "drawVerticalText",
    value: function drawVerticalText(ctx, x, y, width, height, content) {
      var margin = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 10;
      var fontSize = 22;
      var spacing = (height - content.length * fontSize - margin) / (content.length - 1);
      ctx.font = "".concat(fontSize, "px serif");
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = this.nodeColor;
      x += width / 2 - fontSize / 2;
      y += fontSize + margin / 2;

      var _iterator5 = _createForOfIteratorHelper(content.split('')),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var single = _step5.value;
          ctx.fillText(single, x, y);
          y += fontSize + spacing;
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
    /**
     * @method 绘制连接node的线
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {object} node
     */

  }, {
    key: "drawNodeLine",
    value: function drawNodeLine(ctx, node) {
      var length = node.children.length;
      this.drawSelected(ctx, node, node._width || this.nodeWidth, node._height || this.nodeHeight, true);
      ctx.strokeStyle = 'black';
      ctx.lineCap = 'butt';
      var tempX = node.x + (node._width || this.nodeWidth) / 2;

      if (node.y > this.originY) {
        this.drawLine(ctx, [tempX, node.y - 2], [tempX, node.y - this.nodeSpacing[1] / 2]);
      }

      if (length > 0) {
        var tempY = node.y + (node._height || this.nodeHeight);
        this.drawLine(ctx, [tempX, tempY + 2], [tempX, tempY + this.nodeSpacing[1] / 2 + this.nodeHeight - (node._height || this.nodeHeight)]);
        var y = node.y + this.nodeHeight + this.nodeSpacing[1] / 2 + 1;
        this.drawLine(ctx, [node.children[0].x + (node.children[0]._width || this.nodeWidth) / 2, y], [node.children[length - 1].x + (node.children[length - 1]._width || this.nodeWidth) / 2, y]);

        var _iterator6 = _createForOfIteratorHelper(node.children),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var item = _step6.value;
            this.drawChart(ctx, item);
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      }
    }
    /**
     * @method 选中样式
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {number} x: 起始横坐标
     * @param {number} y: 起始纵坐标
     * @param {number} width: 宽度
     * @param {number} height: 高度
     */

  }, {
    key: "drawSelected",
    value: function drawSelected(ctx, node, width, height) {
      var isClean = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var x = node.x - 1;
      var y = node.y - 1;
      width += 2;
      height += 2;
      ctx.lineCap = 'round';

      if (isClean) {
        ctx.strokeStyle = 'white';
      } else {
        ctx.strokeStyle = 'black';
      }

      this.drawLine(ctx, [x, y], [x + width, y]);
      this.drawLine(ctx, [x + width, y], [x + width, y + height]);
      this.drawLine(ctx, [x + width, y + height], [x, y + height]);
      this.drawLine(ctx, [x, y + height], [x, y]);
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
      ctx.beginPath(); // 设置线宽，宽度如果为奇数会导致像素渲染时侵染，reference-link: https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors

      ctx.lineWidth = 2;
      ctx.moveTo.apply(ctx, _toConsumableArray(start));
      ctx.lineTo.apply(ctx, _toConsumableArray(end));
      ctx.stroke();
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
     * @method 绑定点击事件
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {object} data
     */

  }, {
    key: "bindClick",
    value: function bindClick(canvas, data) {
      var that = this;
      canvas.addEventListener('click', function (event) {
        var rect = this.getBoundingClientRect();
        var x = (event.clientX - rect.left) / that.scale[0];
        var y = (event.clientY - rect.top) / that.scale[1]; // 判断点击坐标是否在 tree chart 绘制范围内和是否重复点击

        if (that.isPointInRect([that.originX, that.originY], that._chartWidth - that.padding[3], that._chartHeight - that.padding[0], x, y)) {
          // valid range
          if (that._lastClickNode && that.isPointInRect([that._lastClickNode.x, that._lastClickNode.y], that._lastClickNode._width || that.nodeWidth, that._lastClickNode._height || that.nodeHeight, x, y)) ; else {
            that._isFindNode = false;
            that.isClickNode(data, x, y);

            if (!that._isFindNode) {
              // 删除 selected 样式
              if (that._lastClickNode) {
                that.drawSelected(that.ctx, that._lastClickNode, that._lastClickNode._width || that.nodeWidth, that._lastClickNode._height || that.nodeHeight, true);
              }

              that._lastClickNode = null;
            }
          }
        } else {
          // invalid range
          if (that._lastClickNode) {
            that.drawSelected(that.ctx, that._lastClickNode, that._lastClickNode._width || that.nodeWidth, that._lastClickNode._height || that.nodeHeight, true);
          }

          that._lastClickNode = null;
        }
      });
    }
    /**
     * @method 是否点击节点
     * @param {object} current
     * @param {number} x: 点击时的横坐标
     * @param {number} y: 点击时的纵坐标
     */

  }, {
    key: "isClickNode",
    value: function isClickNode(current, x, y) {
      if (this.isPointInRect([current.x, current.y], current._width || this.nodeWidth, current._height || this.nodeHeight, x, y)) {
        if (this._lastClickNode) {
          this.drawSelected(this.ctx, this._lastClickNode, this._lastClickNode._width || this.nodeWidth, this._lastClickNode._height || this.nodeHeight, true);
        }

        this._lastClickNode = current;
        this._isFindNode = true;
        this.drawSelected(this.ctx, current, this._lastClickNode._width || this.nodeWidth, this._lastClickNode._height || this.nodeHeight);
        return;
      }

      if (current.children.length > 0 && !this._isFindNode) {
        var _iterator7 = _createForOfIteratorHelper(current.children),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var node = _step7.value;
            this.isClickNode(node, x, y);
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      }
    }
    /**
     * @method 判断某个点是否在长方形中
     * @param {array} origin: 长方形左上角坐标
     * @param {number} width: 长方形宽度
     * @param {number} height: 长方形高度
     * @param {number} x: 点的横坐标
     * @param {number} y: 点的纵坐标
     * @return {boolean}
     */

  }, {
    key: "isPointInRect",
    value: function isPointInRect(origin, width, height, x, y) {
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
      return this.getCrossProduct(p, a, b) * this.getCrossProduct(p, c, d) >= 0 && this.getCrossProduct(p, b, c) * this.getCrossProduct(p, d, a) >= 0;
    }
    /**
     * @method 叉乘
     * @param {object} p
     * @param {object} p1
     * @param {object} p2
     * @return {boolean}
     */

  }, {
    key: "getCrossProduct",
    value: function getCrossProduct(p, p1, p2) {
      return (p2.x - p1.x) * (p.y - p1.y) - (p.x - p1.x) * (p2.y - p1.y);
    }
    /**
     * @method 图片错误
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */

  }, {
    key: "drawImageError",
    value: function drawImageError(ctx, x, y, width, height) {
      var mountainHeigh = height / 2;
      var mountainWidth = width / 5.5;
      var fontSize = width / 4;
      var offsetY = width / 14;
      ctx.beginPath();
      ctx.fillStyle = 'darkgray';
      ctx.strokeStyle = 'white';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = 'white';
      ctx.font = "".concat(fontSize, "px arial");
      ctx.fillText('暂无', x + fontSize / 3, y + fontSize / 2 * 3);
      ctx.fillText('图片', x + fontSize / 3, y + fontSize / 2 * 5);
      ctx.arc(x + width - mountainWidth, y + height / 4, fontSize / 3, 0, Math.PI * 2);
      var tempHeight = y + height - mountainHeigh / 2;
      ctx.lineWidth = 2;
      ctx.moveTo(x + 0, y + height);
      ctx.lineTo(x + mountainWidth, tempHeight);
      this.drawMountain(ctx, [x + mountainWidth, tempHeight], [x + mountainWidth * 2, tempHeight], offsetY);
      this.drawMountain(ctx, [x + mountainWidth * 2, tempHeight], [x + mountainWidth * 3, tempHeight], offsetY, true);
      ctx.lineTo(x + mountainWidth * 4, y + height - mountainHeigh);
      this.drawMountain(ctx, [x + mountainWidth * 4, y + height - mountainHeigh], [x + mountainWidth * 5, y + height - mountainHeigh], offsetY);
      ctx.lineTo(x + width, y + height - mountainHeigh + mountainWidth * .6);
      ctx.stroke();
      ctx.closePath();
    }
    /**
     * @method 山峰
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {array} start
     * @param {array} end
     * @param {number} offsetY
     * @param {boolean} rotate
     */

  }, {
    key: "drawMountain",
    value: function drawMountain(ctx, start, end, offsetY) {
      var rotate = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      if (rotate) {
        offsetY *= -1;
      }

      ctx.moveTo.apply(ctx, _toConsumableArray(start));
      var cp0 = {
        x: start[0] + (end[0] - start[0]) / 4,
        y: start[1] - offsetY
      };
      var cp1 = {
        x: end[0] - (end[0] - start[0]) / 4,
        y: end[1] - offsetY
      };
      ctx.bezierCurveTo.apply(ctx, [cp0.x, cp0.y, cp1.x, cp1.y].concat(_toConsumableArray(end)));
    }
  }]);

  return CanvasOrgChart;
}();

export { CanvasOrgChart as default };
