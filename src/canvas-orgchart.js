import { pointInRect, reverseAssign } from './utils.js'

const EVENTS = {
  SELECT: 'select'
}

export default class CanvasOrgChart {
  #fns = new Map()
  #chartWidth = 0
  #chartHeight = 0
  #lastedSpacing = 0
  constructor(canvas, options = { node: {} }) {
    this.canvas = canvas
    this.nodeAttr = {}
    this.options = {};
    ({
      width: this.options.width = 0,
      height: this.options.height = 0,
      padding: this.options.padding = [0, 0, 0, 0],
      background: this.options.background = '',
      lineColor: this.options.lineColor = 'black'
    } = options);
    ({
      width: this.nodeAttr.width = 0,
      height: this.nodeAttr.height = 0,
      spacing: this.nodeAttr.spacing = [20, 20],
      radii: this.nodeAttr.radii = 8,
      background: this.nodeAttr.background = 'white',
      borderColor: this.nodeAttr.borderColor = 'black',
      avatar: this.nodeAttr.avatar = null,
      name: this.nodeAttr.name = null,
      descs: this.nodeAttr.descs = null,
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

  /**
   * @method 渲染组织结构图
   * @param {object} data 数据
   */
  render(data) {
    const canvas = this.canvas
    if (canvas.getContext) {
      this.ctx = canvas.getContext('2d')
      /* 设置线宽，宽度如果为奇数会导致像素渲染时侵染
      * reference-link: https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors
      */
      // this.ctx.lineWidth = 2
      if (data) {
        const _data = JSON.parse(JSON.stringify(data)) 
        this.calcNodesPosition(_data, this.originY)
        this.#chartWidth -= this.#lastedSpacing
        this.setCanvasSize(canvas, this.options.width || (this.#chartWidth + this.options.padding[1]), this.options.height || (this.#chartHeight + this.options.padding[2]))
        this.drawChart(this.ctx, _data, false)
        canvas.addEventListener('click', this.selectEvent(_data).bind(this))
      } else {
        throw new Error('data can\'t be empty.')
      }
    } else {
      throw new Error('can\'t get canvas context.')
    }
  }

  /**
   * @method 事件监听
   * @param {string} event 事件名
   * @param {function} cb 回调函数
   */
  addEventListener(event, cb) {
    if (!this.#fns.has(event)) {
      this.#fns.set(event, [])
    }
    this.#fns.get(event).push(cb)
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
    const { width, height, spacing } = node.nodeAttr
    node.nodeAttr.y = y
    if ((y + height) > this.#chartHeight) {
      this.#chartHeight = y + height
    }
    if (length === 0) {
      node.nodeAttr.x = this.#chartWidth
      this.#chartWidth += width + spacing[0]
      this.#lastedSpacing = spacing[0]
    } else {
      y += height + spacing[1]
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
    const { x, y, width, height, borderColor, background, radii, avatar, descs, name } = node.nodeAttr
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
        x,
        y,
        nodeWidth: width,
        text: node.name,
        textStyle: name
      })
    }
    // 描述
    if (node.descs?.length) {
      const { height: dHeight = 0, background: dBackground, offset = [] } = descs
      const lw = ctx.lineWidth
      ctx.save()
      ctx.beginPath()
      ctx.strokeStyle = borderColor
      this.drawLine(
        ctx,
        [x, y + height - dHeight],
        [x + width, y + height - dHeight]
      )
      ctx.roundRect(
        x + 1,
        y + height - dHeight + lw,
        width - lw * 2,
        dHeight - lw * 2,
        [0, 0, radii, radii]
      )
      ctx.fillStyle = dBackground
      ctx.fill()
      ctx.restore()
      node.descs.map((desc, i) => {
        const textStyle = Object.assign(descs, offset[i])
        this.drawText({
          ctx,
          x,
          y,
          nodeWidth: width,
          text: desc,
          textStyle
        })
      })
    }
    // 连接线
    this.drawLinkLine(ctx, node)
    // 遍历子节点
    node.children?.map(node => {
      this.drawNode(ctx, node)
    })
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
    const { url = '', offsetX = 0, offsetY = 0, width = 0, height = 0, circle = false } = node.nodeAttr.avatar
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
    const { offsetX = 0, offsetY = 0, color = 'black', font, textAlign = 'center' } = textStyle
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
    const { x, y, width, height, lineColor, spacing } = node.nodeAttr
    ctx.strokeStyle = lineColor
    const tempX = x + width / 2

    if (y > this.originY) {
      this.drawLine(
        ctx,
        [tempX, y - lw],
        [tempX, y - spacing[1] / 2]
      )
    }

    if (length > 0) {
      const tempY = y + height
      this.drawLine(
        ctx,
        [tempX, tempY + lw],
        [tempX, tempY + spacing[1] / 2 + height - height]
      )

      const _y = y + height + spacing[1] / 2 + lw
      this.drawLine(
        ctx,
        [node.children[0].nodeAttr.x + width / 2, _y],
        [node.children[length - 1].nodeAttr.x + width / 2, _y]
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
      const { x: nX, y: nY, width, height } = node.nodeAttr
      if (pointInRect([nX, nY], width, height, x, y)) {
        return node
      } else if (node.children?.length) {
        const target = this.getSelected(node.children, x, y)
        if (target) return target
      }
    }
  }
}
