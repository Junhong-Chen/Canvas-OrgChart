import { pointInRect, reverseAssign } from './utils.js'

const EVENTS = {
  SELECT: 'select'
}

export default class CanvasOrgChart {
  #fns = new Map()
  #chartWidth = 0
  #chartHeight = 0
  constructor(canvas, options = { node: {} }) {
    this.canvas = canvas
    this.nodeAttr = {}
    this.options = {};
    ({
      width: this.options.width = 0,
      height: this.options.height = 0,
      padding: this.options.padding = [0, 0, 0, 0],
      background: this.options.background = '',
    } = options);
    ({
      width: this.nodeAttr.width = 0,
      height: this.nodeAttr.height = 0,
      spacing: this.nodeAttr.spacing = [20, 20],
      radii: this.nodeAttr.radii = 8,
      color: this.nodeAttr.color = 'white',
      borderColor: this.nodeAttr.borderColor = 'black',
      background: this.nodeAttr.background = 'cornflowerblue',
      avatar: this.nodeAttr.avatar = null,
      name: this.nodeAttr.name = null,
      desc: this.nodeAttr.desc = null
    } = options.node || {})
    this.formatParams()
    this.originX = this.options.padding[3]
    this.originY = this.options.padding[0]
    this.ctx = null
    this.#chartWidth = this.originX
    this.verifyParameter()
  }

  verifyParameter() {
    if (!this.canvas || !(this.canvas instanceof HTMLElement)) {
      throw new Error('Please pass a valid canvas.')
    }
    if (!Array.isArray(this.options.padding) || this.options.padding.length < 1) {
      throw new TypeError('padding must be an non-empty array.')
    }
    if (!Array.isArray(this.nodeAttr.spacing) || this.nodeAttr.spacing.length < 1) {
      throw new TypeError('nodeSpacing must be an non-empty array.')
    }
    if (typeof(this.nodeAttr.background) !== 'string') {
      throw new TypeError('nodeBackground must be a string.')
    }
    if (typeof(this.options.width) !== 'number' || typeof(this.options.height) !== 'number' || typeof(this.nodeAttr.width) !== 'number' || typeof(this.nodeAttr.height) !== 'number' ) {
      throw new TypeError('width or height must be a number.')
    }
  }

  formatParams() {
    switch (this.options.padding.length) {
      case 1:
        this.options.padding[1] = this.options.padding[0]
        this.options.padding[2] = this.options.padding[0]
        this.options.padding[3] = this.options.padding[0]
        break
      case 2:
        this.options.padding[2] = this.options.padding[0]
        this.options.padding[3] = this.options.padding[1]
        break
      case 3:
        this.options.padding[3] = this.options.padding[1]
        break
    }
    if (this.nodeAttr.spacing.length === 1) {
      this.nodeAttr.spacing[1] = this.nodeAttr.spacing[0]
    }
  }

  render(data) {
    const canvas = this.canvas
    if (canvas.getContext) {
      this.ctx = canvas.getContext('2d')
      /* 设置线宽，宽度如果为奇数会导致像素渲染时侵染
      * reference-link: https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors
      */
      // this.ctx.lineWidth = 2
      if (data) {
        this.calcNodesPosition(data, this.originY)
        this.#chartWidth -= this.nodeAttr.spacing[0]
        this.#chartHeight += this.nodeAttr.height
        this.setCanvasSize(canvas, this.options.width || (this.#chartWidth + this.options.padding[1]), this.options.height || (this.#chartHeight + this.options.padding[2]))
        this.drawChart(this.ctx, data, false)
        canvas.addEventListener('click', this.selectEvent(data).bind(this))
      } else {
        throw new Error('data can\'t be empty.')
      }
    } else {
      throw new Error('can\'t get canvas context.')
    }
  }

  addEventListener(event, fn) {
    if (!this.#fns.has(event)) {
      this.#fns.set(event, [])
    }
    this.#fns.get(event).push(fn)
  }

  /**
   * @method 赋值节点属性
   * @param {object} node
   */
  setAttribute(node) {
    if (!node.nodeAttr) node.nodeAttr = {}
    reverseAssign(node.nodeAttr, this.nodeAttr)
  }

  /**
   * @method 计算节点位置
   * @param {object} current
   * @param {number} y
   */
  calcNodesPosition(node, y) {
    const length = node.children?.length || 0
    this.setAttribute(node)
    node.nodeAttr.y = y
    if (y > this.#chartHeight) {
      this.#chartHeight = y
    }
    if (length === 0) {
      node.nodeAttr.x = this.#chartWidth
      this.#chartWidth += node.nodeAttr.width + node.nodeAttr.spacing[0]
    } else {
      y += node.nodeAttr.height + this.nodeAttr.spacing[1]
      for (let item of node.children) {
        this.calcNodesPosition(item, y)
      }
      if (length === 1) {
        node.nodeAttr.x = node.children[0].x
      } else {
        node.nodeAttr.x = Math.round(node.children[0].nodeAttr.x + (node.children[length - 1].nodeAttr.x - node.children[0].nodeAttr.x) / 2)
      }
    }
  }

  /**
   * @method 绘图
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {object} node
   */
  drawChart(ctx, node) {
    if (this.options.background) this.drawBackground(ctx)
    this.drawNode(ctx, node)
  }

  /**
   * @method 绘制背景
   * @param {object} ctx: CanvasRenderingContext2D
   */ 
  drawBackground(ctx) {
    ctx.save()
    ctx.fillStyle = this.options.background
    ctx.fillRect(0, 0, this.options.width || (this.#chartWidth + this.options.padding[1]), this.options.height || (this.#chartHeight + this.options.padding[2]))
    ctx.restore()
  }

  /**
   * @method 绘制节点 
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {object} node
   */ 
  drawNode(ctx, node) {
    const { x, y, width, height, borderColor, background, radii, avatar } = node.nodeAttr
    ctx.save()
    ctx.beginPath()
    // 填充
    ctx.roundRect(x, y, width, height, radii)
    ctx.fillStyle = background
    ctx.fill()
    // 边框
    ctx.roundRect(x, y, width, height, radii)
    ctx.strokeStyle = borderColor
    ctx.stroke()
    ctx.restore()
    // 头像
    if (avatar) {
      this.drawImg(ctx, node)
    }
    // 名字
    if (node.name) {
      this.drawText({
        ctx,
        x: node.nodeAttr.x,
        y: node.nodeAttr.y,
        nodeWidth: node.nodeAttr.width,
        text: node.name,
        textStyle: node.nodeAttr.name
      })
    }
    // 描述
    node.children?.map(node => {
      this.drawNode(ctx, node)
    })
    // 连接线
    this.drawLinkLine(ctx, node)
  }

  /**
   * @method 绘线
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {array} start: 起始坐标
   * @param {array} end: 结束坐标
   */
  drawLine(ctx, start, end) {
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(...start)
    ctx.lineTo(...end)
    ctx.stroke()
    ctx.restore()
  }

  /**
   * @method 绘制图片
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {object} node
   */
  drawImg(ctx, node) {
    const img = new Image()
    const { offsetX, offsetY, width, height, url, circle } = node.nodeAttr.avatar
    let { x, y } = node.nodeAttr
    x += offsetX
    y += offsetY
    img.src = url
    img.onload = function() {
      ctx.save()
      if (circle) {
        const radius = width / 2
        ctx.beginPath()
        ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2)
        ctx.clip()
        ctx.closePath()

        ctx.drawImage(this, x, y, width, height)

      } else {
        ctx.drawImage(this, x, y, width, height)
      }
      ctx.restore()
    }
    img.onerror = function() {
      console.error('img loaded fail.')
    }
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
  drawText({ ctx, x, y, nodeWidth, text, textStyle }) {
    const { offsetX, offsetY, color, font, textAlign } = textStyle
    ctx.save()
    ctx.font = font
    ctx.fillStyle = color
    x += offsetX
    y += offsetY
    const textWidth = ctx.measureText(text).width
    switch (textAlign) {
      case 'center':
        x += (nodeWidth - textWidth) / 2
        break;
      case 'right':
        x += (nodeWidth - textWidth)
        break;
    }
    ctx.fillText(text, x, y)
    ctx.restore()
  }

  /**
   * @method 绘制连接线
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {object} node
   */
  drawLinkLine(ctx, node) {
    const length = node.children.length
    const lw = ctx.lineWidth
    ctx.strokeStyle = 'black'
    ctx.lineCap = 'butt'
    const tempX = node.nodeAttr.x + (node._width || this.nodeAttr.width) / 2

    if (node.nodeAttr.y > this.originY) {
      this.drawLine(
        ctx,
        [tempX, node.nodeAttr.y - lw],
        [tempX, node.nodeAttr.y - this.nodeAttr.spacing[1] / 2]
      )
    }

    if (length > 0) {
      const tempY = node.nodeAttr.y + (node.nodeAttr.height)
      this.drawLine(
        ctx,
        [tempX, tempY + lw],
        [tempX, tempY + this.nodeAttr.spacing[1] / 2 + node.nodeAttr.height - this.nodeAttr.height]
      )

      const y = node.nodeAttr.y + this.nodeAttr.height + this.nodeAttr.spacing[1] / 2 + lw
      this.drawLine(
        ctx,
        [node.children[0].nodeAttr.x + node.nodeAttr.width / 2, y],
        [node.children[length - 1].nodeAttr.x + node.nodeAttr.width / 2, y]
      )
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
   * @method 选中事件
   * @param {object} ctx: CanvasRenderingContext2D
   * @param {object} data
   */
  selectEvent(data) {
    return function(event) {
      const rect = this.canvas.getBoundingClientRect()
      const x = (event.clientX - rect.left)
      const y = (event.clientY - rect.top)
      // 判断点击坐标是否在 tree chart 绘制范围内和是否重复点击
      if (pointInRect(
        [this.originX, this.originY],
        this.#chartWidth - this.options.padding[3],
        this.#chartHeight - this.options.padding[0],
        x,
        y
      )) {
        // valid range
        const target = this.getSelected([data], x, y) || null
        this.#fns.get(EVENTS.SELECT).map((fn) => {
          fn(target)
        })
      }
    }
  }

  /**
   * @method 是否点击节点
   * @param {object[]} nodeList
   * @param {number} x: 点击时的横坐标
   * @param {number} y: 点击时的纵坐标
   */
  getSelected(nodeList, x, y) {
    for (let node of nodeList) {
      if (pointInRect([node.nodeAttr.x, node.nodeAttr.y], node._width || this.nodeAttr.width, node._height || this.nodeAttr.height, x, y)) {
        return node
      } else if (node.children?.length) {
        const target = this.getSelected(node.children, x, y)
        if (target) return target
      }
    }
  }
}
