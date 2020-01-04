export default class CanvasOrgChart {
  _lastClickNode = null
  get currentSelected() {
    return this._lastClickNode
  }
  _isFindNode = false
  _chartWidth = 0
  _chartHeight = 0
  constructor(options) {
    if (options === undefined) {
      options = {}
    }
    this.width = parseInt(options.width) || 0
    this.height = parseInt(options.height) || 0
    this.scale = options.scale || [1, 1]
    this.padding = options.padding || [0, 0, 0, 0] // 补充: 需兼容成 css 属性一样
    this.nodeWidth = parseInt(options.node.width) || 60
    this.nodeHeight = parseInt(options.node.height) || 160
    this.nodeSpacing = options.node.spacing || [20, 20]
    this.nodeColor = options.node.color || 'white'
    this.nodeBackground = options.node.background || 'cornflowerblue'
    this.nodeCustomBackgrounds = options.node.customBackgrounds || []
    this.defaultAvatar = options.node.defaultAvatar || ''
    this.customAvatar = options.node.customAvatar || null
    this.nodeTemplate = options.nodeTemplate || []
    this.formatParams()
    this.originX = parseInt(options.originX) || 0 + this.padding[3]
    this.originY = parseInt(options.originY) || 0 + this.padding[0]
    this.ctx = null
    this._chartWidth = this.originX
    this.verifyParameter()
  }

  verifyParameter() {
    if (!Array.isArray(this.nodeCustomBackgrounds)) {
      throw new TypeError('nodeCustomBackgrounds must be an array.')
    }
    if (!Array.isArray(this.padding) || this.padding.length < 1) {
      throw new TypeError('padding must be an non-empty array.')
    }
    if (!Array.isArray(this.nodeSpacing) || this.nodeSpacing.length < 1) {
      throw new TypeError('nodeSpacing must be an non-empty array.')
    }
    if (!Array.isArray(this.scale)) {
      throw new TypeError('scale must be an array.')
    }
    if (typeof(this.nodeBackground) !== 'string') {
      throw new TypeError('nodeBackground must be a string.')
    }
    if (typeof(this.nodeTemplate) !== 'function' && !Array.isArray(this.nodeTemplate)) {
      throw new TypeError('customNode must be a function or an array.')
    }
  }

  formatParams() {
    switch (this.padding.length) {
      case 1:
        this.padding[1] = this.padding[0]
        this.padding[2] = this.padding[0]
        this.padding[3] = this.padding[0]
        break
      case 2:
        this.padding[2] = this.padding[0]
        this.padding[3] = this.padding[1]
        break
      case 3:
        this.padding[3] = this.padding[1]
        break
    }
    if (this.nodeSpacing.length === 1) {
      this.nodeSpacing[1] = this.nodeSpacing[0]
    }
  }

  render(canvas, data) {
    if (canvas.getContext) {
      this.ctx = canvas.getContext('2d')
      if (data) {
        this.nodeTemplate === [] ? this.calculateCoordinate(data, this.originY) : this.calculateCustomCoordinate(data, this.originY)
        this._chartWidth -= this.nodeSpacing[0]
        this._chartHeight += this.nodeHeight
        this.setCanvasSize(canvas, this.width || (this._chartWidth + this.padding[1]), this.height || (this._chartHeight + this.padding[2]))
        this.ctx.scale(...this.scale)
        this.drawChart(this.ctx, data, false)
        this.bindClick(canvas, data)
      } else {
        throw new Error('data can\'t be empty.')
      }
    } else {
      throw new Error('can\'t get canvas context.')
    }
  }

  /**
   * @method 计算坐标
   * @param {object} current
   * @param {number} y
   */
  calculateCoordinate(current, y) {
    const length = current.children.length
    current.y = y
    if (current.y > this._chartHeight) {
      this._chartHeight = current.y
    }
    if (length <= 0) {
      current.x = this._chartWidth
      this._chartWidth += this.nodeWidth + this.nodeSpacing[0]
    } else {
      y += this.nodeHeight + this.nodeSpacing[1]
      for (let item of current.children) {
        this.calculateCoordinate(item, y)
      }
      if (length === 1) {
        current.x = current.children[0].x
      } else {
        current.x = Math.round(current.children[0].x + (current.children[length - 1].x - current.children[0].x) / 2)
      }
    }
  }

  /**
   * @method 计算自定义节点坐标
   * @param {object} current
   * @param {number} y
   */
  calculateCustomCoordinate(current, y) {
    const length = current.children.length
    current.y = y
    if (Array.isArray(this.nodeTemplate) && this.nodeTemplate.length > 0) {
      for (let [index, custom] of this.nodeTemplate.entries()) {
        if (custom.checkOwn && Object.prototype.hasOwnProperty.call(current, custom.attributeName) || current[custom.attributeName]) {
          current._isCustom = index
          current._width = custom.width
          current._height = custom.height
          break
        }
      }
    }
    if (current.y > this._chartHeight) {
      this._chartHeight = current.y
    }
    if (length <= 0) {
      current.x = this._chartWidth
      this._chartWidth += (current._width || this.nodeWidth) + this.nodeSpacing[0] 
    } else {
      y += this.nodeHeight + this.nodeSpacing[1]
      for (let item of current.children) {
        this.calculateCustomCoordinate(item, y)
      }
      if (length === 1) {
        current.x = current.children[0].x
      } else {
        // 如果坐标有小数点，渲染时会模糊
        const offsetX = ((current.children[0]._width || this.nodeWidth) - this.nodeWidth) / 2 - ((current._width || this.nodeWidth) - this.nodeWidth) / 2
        current.x = Math.round(current.children[0].x + (current.children[length - 1].x - current.children[0].x) / 2 + offsetX)
      }
    }
  }

  /**
   * @method 绘图
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {object} current
   */
  drawChart(ctx, current) {
    if (typeof(this.nodeTemplate) === 'function') {
      this.nodeTemplate(this, ctx, current.x, current.y, current)
    } else if (current._isCustom !== undefined) {
      this.nodeTemplate[current._isCustom].draw(this, ctx, current.x, current.y, current)
    } else {
      this.drawNode(ctx, current.x, current.y, current)
    }
    this.drawNodeLine(ctx, current)
  }

  /**
   * @method 绘制节点
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {number} x: 起始横坐标
   * @param {number} y: 起始纵坐标
   * @param {object} node
   */ 
  drawNode(ctx, x, y, node) {
    this.drawAvatar(ctx, x, y, node)
    // node color
    ctx.fillStyle = this.nodeBackground
    for (let paint of this.nodeCustomBackgrounds) {
      if (paint.checkOwn && Object.prototype.hasOwnProperty.call(node, paint.attributeName) || node[paint.attributeName] !== undefined) {
        typeof(paint.color) === 'string' ? ctx.fillStyle = paint.color : ctx.fillStyle = paint.color[node[paint.attributeName]]
      }
    }

    const height = this.nodeHeight - this.nodeWidth
    ctx.fillRect(x, y + this.nodeWidth, this.nodeWidth, height)
    ctx.stroke()
    this.drawVerticalText(ctx, x, y + this.nodeWidth, node._width || this.nodeWidth, height, node.name)
  }

  /**
   * @method 绘制头像
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {number} x: 起始横坐标
   * @param {number} y: 起始纵坐标
   * @param {string} avatarUrl: 头像地址
   */
  drawAvatar(ctx, x, y, person, width = this.nodeWidth) {
    // Object.prototype.hasOwnProperty.call(person, 'sex')
    const img = new Image()
    const that = this
    if (person.avatar) {
      img.src = person.avatar
    } else if (this.customAvatar && Object.prototype.hasOwnProperty.call(person, this.customAvatar.attributeName)) {
      img.src = this.customAvatar.avatars[person[this.customAvatar.attributeName]]
    } else {
      img.src = this.defaultAvatar
    }
    img.onload = function() {
      ctx.drawImage(this, x, y, width, width)
    }
    img.onerror = function() {
      that.drawImageError(ctx, x, y, width, width)
    }
  }

  /**
   * @method 绘制纵向文字
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {number} x: 起始横坐标
   * @param {number} y: 起始纵坐标
   * @param {string} content: 内容
   * @param {number} height: 绘制总长度
   */
  drawVerticalText(ctx, x, y, width, height, content, margin = 10) {
    const fontSize = 22
    let spacing = (height - content.length * fontSize - margin) / (content.length - 1)
    ctx.font = `${fontSize}px serif`
    ctx.textBaseline = 'bottom'
    ctx.fillStyle = this.nodeColor
    x += (width / 2 - fontSize / 2)
    y += fontSize + (margin / 2)
    for (let single of content.split('')) {
      ctx.fillText(single, x, y)
      y += fontSize + spacing
    }
  }

  /**
   * @method 绘制连接node的线
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {object} node
   */
  drawNodeLine(ctx, node) {
    const length = node.children.length
    this.drawSelected(ctx, node, node._width || this.nodeWidth, node._height || this.nodeHeight, true)
    ctx.strokeStyle = 'black'
    ctx.lineCap = 'butt'
    const tempX = node.x + (node._width || this.nodeWidth) / 2
    if (node.y > this.originY) {
      this.drawLine(ctx, [tempX, node.y - 2], [tempX, node.y - this.nodeSpacing[1] / 2])
    }
    if (length > 0) {
      const tempY = node.y + (node._height || this.nodeHeight)
      this.drawLine(ctx, [tempX, tempY + 2], [tempX, tempY + this.nodeSpacing[1] / 2 + this.nodeHeight - (node._height || this.nodeHeight)])
      const y = node.y + this.nodeHeight + this.nodeSpacing[1] / 2 + 1
      this.drawLine(ctx, [node.children[0].x + (node.children[0]._width || this.nodeWidth) / 2, y], [node.children[length - 1].x + (node.children[length - 1]._width || this.nodeWidth) / 2, y])

      for (let item of node.children) {
        this.drawChart(ctx, item)
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
  drawSelected(ctx, node, width, height, isClean = false) {
    let x = node.x - 1
    const y = node.y - 1
    width += 2
    height += 2
    ctx.lineCap = 'round'
    if (isClean) {
      ctx.strokeStyle = 'white'
    } else {
      ctx.strokeStyle = 'black'
    }
    this.drawLine(ctx, [x, y], [x + width, y])
    this.drawLine(ctx, [x + width, y], [x + width, y + height])
    this.drawLine(ctx, [x + width, y + height], [x, y + height])
    this.drawLine(ctx, [x, y + height], [x, y])
  }

  /**
   * @method 绘线
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {array} start: 起始坐标
   * @param {array} end: 结束坐标
   */
  drawLine(ctx, start, end) {
    ctx.beginPath()
    // 设置线宽，宽度如果为奇数会导致像素渲染时侵染，reference-link: https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors
    ctx.lineWidth = 2
    ctx.moveTo(...start)
    ctx.lineTo(...end)
    ctx.stroke()
  }

  /**
   * @method 设置canvas宽高
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {number} width
   * @param {number} height
   */
  setCanvasSize(canvas, width, height) {
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
  }

  /**
   * @method 绑定点击事件
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {object} data
   */
  bindClick(canvas, data) {
    const that = this
    canvas.addEventListener('click', function(event) {
      const rect = this.getBoundingClientRect()
      const x = (event.clientX - rect.left) / that.scale[0]
      const y = (event.clientY - rect.top) / that.scale[1]
      // 判断点击坐标是否在 tree chart 绘制范围内和是否重复点击
      if (that.isPointInRect([that.originX, that.originY], that._chartWidth - that.padding[3], that._chartHeight - that.padding[0], x, y)) {
        // valid range
        if (that._lastClickNode && that.isPointInRect([that._lastClickNode.x, that._lastClickNode.y], that._lastClickNode._width || that.nodeWidth, that._lastClickNode._height || that.nodeHeight, x, y)) {
          // console.log('重复点击')
        } else {
          that._isFindNode = false
          that.isClickNode(data, x, y)
          if (!that._isFindNode) {
            // 删除 selected 样式
            if (that._lastClickNode) {
              that.drawSelected(that.ctx, that._lastClickNode, that._lastClickNode._width || that.nodeWidth, that._lastClickNode._height || that.nodeHeight, true)
            }
            that._lastClickNode = null
          }
        }
      } else {
        // invalid range
        if (that._lastClickNode) {
          that.drawSelected(that.ctx, that._lastClickNode, that._lastClickNode._width || that.nodeWidth, that._lastClickNode._height || that.nodeHeight, true)
        }
        that._lastClickNode = null
      }
    })
  }

  /**
   * @method 是否点击节点
   * @param {object} current
   * @param {number} x: 点击时的横坐标
   * @param {number} y: 点击时的纵坐标
   */
  isClickNode(current, x, y) {
    if (this.isPointInRect([current.x, current.y], current._width || this.nodeWidth, current._height || this.nodeHeight, x, y)) {
      if (this._lastClickNode) {
        this.drawSelected(this.ctx, this._lastClickNode, this._lastClickNode._width || this.nodeWidth, this._lastClickNode._height || this.nodeHeight, true)
      }
      this._lastClickNode = current
      this._isFindNode = true
      this.drawSelected(this.ctx, current, this._lastClickNode._width || this.nodeWidth, this._lastClickNode._height || this.nodeHeight)
      return
    }
    if (current.children.length > 0 && !this._isFindNode) {
      for (let node of current.children) {
        this.isClickNode(node, x, y)
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
  isPointInRect(origin, width, height, x, y) {
    const p = {
      x,
      y
    }
    const a = {
      x: origin[0],
      y: origin[1]
    }
    const b = {
      x: origin[0] + width,
      y: origin[1]
    } 
    const c = {
      x: origin[0] + width,
      y: origin[1] + height
    }
    const d = {
      x: origin[0],
      y: origin[1] + height
    }
    return this.getCrossProduct(p, a, b) * this.getCrossProduct(p, c, d) >= 0 && this.getCrossProduct(p, b, c) * this.getCrossProduct(p, d, a) >= 0
  }

  /**
   * @method 叉乘
   * @param {object} p
   * @param {object} p1
   * @param {object} p2
   * @return {boolean}
   */
  getCrossProduct (p, p1, p2) {
    return (p2.x - p1.x) * (p.y - p1.y) - (p.x - p1.x) * (p2.y - p1.y)
  }

  /**
   * @method 图片错误
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  drawImageError(ctx, x, y, width, height) {
    const mountainHeigh = height / 2
    const mountainWidth = width / 5.5
    const fontSize = width / 4
    const offsetY = width / 14
    ctx.beginPath()
    ctx.fillStyle = 'darkgray'
    ctx.strokeStyle = 'white'
    ctx.fillRect(x, y, width, height)
    ctx.fillStyle = 'white'
    ctx.font = `${fontSize}px arial`
    ctx.fillText('暂无', x + fontSize / 3, y + fontSize / 2 * 3)
    ctx.fillText('图片', x + fontSize / 3, y + fontSize / 2 * 5)
    ctx.arc(x + width - mountainWidth, y + height / 4, fontSize / 3, 0, Math.PI*2)

    const tempHeight = y + height - mountainHeigh / 2
    ctx.lineWidth = 2
    ctx.moveTo(x + 0, y + height)
    ctx.lineTo(x + mountainWidth, tempHeight)
    this.drawMountain(ctx, [x + mountainWidth, tempHeight], [x + mountainWidth * 2, tempHeight], offsetY)
    this.drawMountain(ctx, [x + mountainWidth * 2, tempHeight], [x + mountainWidth * 3 , tempHeight], offsetY, true)
    ctx.lineTo(x + mountainWidth * 4, y + height - mountainHeigh)
    this.drawMountain(ctx, [x + mountainWidth * 4, y + height - mountainHeigh], [x + mountainWidth * 5, y + height - mountainHeigh], offsetY)
    ctx.lineTo(x + width, y + height - mountainHeigh + mountainWidth * .6)
    ctx.stroke()
    ctx.closePath()
  }

  /**
   * @method 山峰
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {array} start
   * @param {array} end
   * @param {number} offsetY
   * @param {boolean} rotate
   */
  drawMountain(ctx, start, end, offsetY, rotate = false) {
    if (rotate) {
      offsetY *= -1
    }
    ctx.moveTo(...start)
    const cp0 = {
      x: start[0] + (end[0] - start[0]) / 4,
      y: start[1] - offsetY
    }
    const cp1 = {
      x: end[0] - (end[0] - start[0]) / 4,
      y: end[1] - offsetY
    }
    ctx.bezierCurveTo(cp0.x, cp0.y, cp1.x, cp1.y, ...end)
  }
}
