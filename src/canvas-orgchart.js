import maleAvatar from '../public/images/male.jpg'
import femaleAvatar from '../public/images/female.jpg'
import imageError from '../public/images/image-error.png'

export default class CanvasOrgChart {
  _lastClickNode = null
  get currentSelected() {
    return this._lastClickNode
  }
  _isFindNode = false
  _chartWidth = 0
  _chartHeight = 0
  constructor(config) {
    this.width = parseInt(config.width) || 0
    this.height = parseInt(config.height) || 0
    this.padding = config.padding || [0, 0, 0, 0] // 补充: 需兼容成 css 属性一样
    this.scale = config.scale || [1, 1]
    this.nodeWidth = parseInt(config.nodeWidth) || 60
    this.nodeHeight = parseInt(config.nodeHeight) || 160
    this.nodeHorizontalSpacing = parseInt( config.nodeSpacing[0]) || 20
    this.nodeVerticalSpacing = parseInt(config.nodeSpacing[1]) || 20
    this.originX = parseInt(config.originX) || 0 + this.padding[3]
    this.originY = parseInt(config.originY) || 0 + this.padding[0]
    this.customColors = config.customColors || []
    this.defaultColor = config.defaultColor || 'DODGERBLUE'
    this.customNode = config.customNode || []
    this.ctx = null
    this._chartWidth = this.originX
    this.verifyParameter()
  }

  verifyParameter() {
    if (!Array.isArray(this.customColors)) {
      throw new TypeError('config.customColors must be an array.')
    }
    if (!Array.isArray(this.padding) || this.padding.length < 1) {
      throw new TypeError('config.customColors must be an non-empty array.')
    }
    if (!Array.isArray(this.scale)) {
      throw new TypeError('config.customColors must be an array.')
    }
    if (typeof(this.defaultColor) !== 'string') {
      throw new TypeError('config.defaultColor must be a string.')
    }
    if (typeof(this.customNode) !== 'function' && !Array.isArray(this.customNode)) {
      throw new TypeError('config.customNode must be a function or an array.')
    }
  }

  render(canvas, data) {
    if (canvas.getContext) {
      this.ctx = canvas.getContext('2d')
      if (data.name) {
        this.calculateCoordinate(data, 0)
        this._chartWidth -= this.nodeHorizontalSpacing
        this._chartHeight += this.nodeHeight
        this.setCanvasSize(canvas, this.width || (this._chartWidth + this.padding[1]), this.height || (this._chartHeight + this.padding[2]))
        this.ctx.scale(...this.scale)
        this.drawChart(this.ctx, data, false)
        this.bindClick(canvas, data)
      }
    } else {
      alert('can\'t get canvas context.')
    }
  }

  /**
   * @method 计算坐标
   * @param {object} current
   * @param {number} layer
   */
  calculateCoordinate(current, layer) {
    const length = current.children.length
    current.y = this.originY + layer * (this.nodeHeight + this.nodeVerticalSpacing)
    if (current.y > this._chartHeight) {
      this._chartHeight = current.y
    }
    if (length <= 0) {
      current.x = this._chartWidth
      this._chartWidth += this.nodeWidth + this.nodeHorizontalSpacing
    } else {
      layer++
      for (let item of current.children) {
        this.calculateCoordinate(item, layer)
      }
      if (length === 1) {
        current.x = current.children[0].x
      } else {
        current.x = current.children[0].x + (current.children[length - 1].x - current.children[0].x) / 2
      }
    }
  }

  /**
   * @method 绘图
   * @param {object} current
   */
  drawChart(ctx, current) {
    const length = current.children.length
    if (Array.isArray(this.customNode) && this.customNode.length > 0) {
      for (let node of this.customNode) {
        if (node.checkOwn && Object.prototype.hasOwnProperty.call(current, node.attributeName) || current[node.attributeName]) {
          node.draw(this, ctx, current.x, current.y, current)
        } else {
          this.drawNode(ctx, current.x, current.y, current)
        }
      }
    } else if (typeof(this.customNode) === 'function') {
      this.customNode(this, ctx, current.x, current.y, current)
    } else {
      this.drawNode(ctx, current.x, current.y, current)
    }

    // 绘线
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    const halfWidth = this.nodeWidth / 2
    if (current.y > this.originY) {
      ctx.moveTo(current.x + halfWidth, current.y)
      ctx.lineTo(current.x + halfWidth, current.y - this.nodeVerticalSpacing / 2)
      ctx.stroke()
    }
    if (length > 0) {
      const height = this.nodeHeight - this.nodeWidth
      ctx.moveTo(current.x + halfWidth, current.y + (this.nodeWidth + height))
      ctx.lineTo(current.x + halfWidth, current.y + (this.nodeWidth + height) + this.nodeVerticalSpacing / 2)
      ctx.stroke()
      const y = current.y + this.nodeHeight + this.nodeVerticalSpacing / 2 + 1
      this.drawLine(ctx, [current.children[0].x + halfWidth, y], [current.children[length - 1].x + halfWidth, y])

      for (let item of current.children) {
        this.drawChart(ctx, item)
      }
    }
  }

  /**
   * @method 绘制实线
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
    ctx.closePath()
  }

  /**
   * @method 绘制虚线
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {array} start: 起始坐标
   * @param {array} end: 结束坐标
   */
  drawDottedLine(ctx, start, end) {
    ctx.beginPath()
    ctx.lineWidth = 2
    // 设置间距（参数为无限数组，虚线的样式随数组循环）
    ctx.setLineDash([4, 3])
    ctx.moveTo(...start)
    ctx.lineTo(...end)
    ctx.strokeStyle = 'black'
    ctx.stroke()
    ctx.closePath()
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
    ctx.fillStyle = this.defaultColor
    for (let paint of this.customColors) {
      if (paint.checkOwn && Object.prototype.hasOwnProperty.call(node, paint.attributeName) || node[paint.attributeName] !== undefined) {
        typeof(paint.color) === 'string' ? ctx.fillStyle = paint.color : ctx.fillStyle = paint.color[node[paint.attributeName]]
      }
    }

    ctx.fillRect(x, y + this.nodeWidth, this.nodeWidth, this.nodeHeight - this.nodeWidth)
    ctx.stroke()
    this.drawVerticalText(ctx, x, y + this.nodeWidth, node.name)
  }

  /**
   * @method 绘制头像
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {number} x: 起始横坐标
   * @param {number} y: 起始纵坐标
   * @param {string} avatarUrl: 头像地址
   */
  drawAvatar(ctx, x, y, person) {
    const img = new Image()
    const that = this
    if (person.avatar) {
      img.src = person.avatar
    } else if (Object.prototype.hasOwnProperty.call(person, 'sex')){
      if (typeof(person.sex) === 'number') {
        if (person.sex) {
          img.src = femaleAvatar
        } else {
          img.src = maleAvatar
        }
      } else {
        img.src = `${person.sex}Avatar`
      }
    } else {
      img.src = maleAvatar
    }
    img.onerror = function() {
      this.src = imageError
    }
    img.onload = function() {
      ctx.drawImage(this, x, y, that.nodeWidth, that.nodeWidth)
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
  drawVerticalText(ctx, x, y, content) {
    const height = this.nodeHeight - this.nodeWidth
    const fontSize = 22
    let spacing = (height - content.length * fontSize - 10) / (content.length - 1) // 10 是整体文字的上下总间距
    ctx.font = `${fontSize}px serif`
    ctx.textBaseline = 'bottom'
    ctx.fillStyle = 'white'
    x += (this.nodeWidth / 2 - fontSize / 2)
    y += fontSize + (10 / 2)
    for (let single of content.split('')) {
      ctx.fillText(single, x, y)
      y += fontSize + spacing
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
    const x = node.x - 1
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
    if (isClean) {
      ctx.strokeStyle = 'black'
      ctx.lineCap = 'butt'
      if (node.y > this.originY) {
        this.drawLine(ctx, [x + width / 2, y - 1], [x + width / 2, y + 1])
      }
      if (node.children.length > 0) {
        this.drawLine(ctx, [x + width / 2, y + height - 1], [x + width / 2, y + height + 1])
      }
    }
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
      // 判断点击坐标是否在 tree chart 绘制范围内和是否重复点击（注：这里还没有处理自定义节点）
      if (that.isPointInRect([that.originX, that.originY], that._chartWidth - that.padding[3], that._chartHeight - that.padding[0], x, y)) {
        // valid range
        if (that._lastClickNode && that.isPointInRect([that._lastClickNode.x, that._lastClickNode.y], that.nodeWidth, that.nodeHeight, x, y)) {
          console.log('重复点击')
        } else {
          that._isFindNode = false
          that.isClickNode(data, x, y)
          if (!that._isFindNode) {
            // 删除 selected 样式
            if (that._lastClickNode) {
              that.drawSelected(that.ctx, that._lastClickNode, that.nodeWidth, that.nodeHeight, true)
            }
            that._lastClickNode = null
          }
        }
      } else {
        // invalid range
        if (that._lastClickNode) {
          that.drawSelected(that.ctx, that._lastClickNode, that.nodeWidth, that.nodeHeight, true)
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
    if (this.isPointInRect([current.x, current.y], this.nodeWidth, this.nodeHeight, x, y)) {
      if (this._lastClickNode) {
        this.drawSelected(this.ctx, this._lastClickNode, this.nodeWidth, this.nodeHeight, true)
      }
      this._lastClickNode = current
      this._isFindNode = true
      this.drawSelected(this.ctx, current, this.nodeWidth, this.nodeHeight)
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
    
}