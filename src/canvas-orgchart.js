import maleAvatar from '../public/images/male.jpg'
import femaleAvatar from '../public/images/female.jpg'
import imageError from '../public/images/image-error.png'

export default class CanvasOrgChart {
    constructor(config) {
      this.width = parseInt(config.width) || 0
      this.height = parseInt(config.height) || 0
      this.nodeWidth = parseInt(config.nodeWidth) || 60
      this.nodeHeight = parseInt(config.nodeHeight) || 160
      this.nodeHorizontalSpacing = parseInt( config.nodeSpacing[0]) || 20
      this.nodeVerticalSpacing = parseInt(config.nodeSpacing[1]) || 20
      this.originX = parseInt(config.originX) || 0
      this.originY = parseInt(config.originY) || 0
      this.customColors = config.customColors || []
      this.defaultColor = config.defaultColor || 'DODGERBLUE'
      this.customNode = config.customNode || []
      this.ctx = null
      this.verifyParameter()
    }

    verifyParameter() {
      if (!Array.isArray(this.customColors)) {
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
          this.setCanvasSize(canvas, this.width || this.originX, this.height)
          this.drawChart(this.ctx, data, false)
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
      if (current.y > this.height) {
        this.height = current.y
      }
      if (length <= 0) {
        current.x = this.originX
        this.originX += this.nodeWidth + this.nodeHorizontalSpacing
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
    drawChart(ctx, current, hasFather) {
      const length = current.children.length
      if (Array.isArray(this.customNode) && this.customNode.length > 0) {
        for (let node of this.customNode) {
          if (node.checkOwn && Object.prototype.hasOwnProperty.call(current, node.attributeName)) {
            node.draw(this, ctx, current.x, current.y, current)
          } else if (current[node.attributeName]) {
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
      if (hasFather) {
        ctx.moveTo(current.x + (this.nodeWidth / 2), current.y)
        ctx.lineTo(current.x + (this.nodeWidth / 2), current.y - this.nodeVerticalSpacing / 2)
        ctx.stroke()
      }
      if (length > 0) {
        const height = this.nodeHeight - this.nodeWidth
        ctx.moveTo(current.x + (this.nodeWidth / 2), current.y + (this.nodeWidth + height))
        ctx.lineTo(current.x + (this.nodeWidth / 2), current.y + (this.nodeWidth + height) + this.nodeVerticalSpacing / 2)
        ctx.stroke()
        const y = current.y + this.nodeHeight + this.nodeVerticalSpacing / 2 + 1
        this.drawLine(ctx, [current.children[0].x + (this.nodeWidth / 2), y], [current.children[length - 1].x + (this.nodeWidth / 2), y])

        for (let item of current.children) {
          this.drawChart(ctx, item, true)
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
      // 移动画笔至坐标 start 的位置
      ctx.moveTo(...start)
      // 绘制到坐标 end 的位置
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
     * @method 绘制个人
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {number} x: 起始横坐标
     * @param {number} y: 起始纵坐标
     * @param {object} person
     */ 
    drawNode(ctx, x, y, person) {
      this.drawAvatar(ctx, x, y, person)
      // node color
      ctx.fillStyle = this.defaultColor
      for (let paint of this.customColors) {
        if (paint.checkOwn && Object.prototype.hasOwnProperty.call(person, paint.attributeName)) {
          typeof(paint.color) === 'string' ? ctx.fillStyle = paint.color : ctx.fillStyle = paint.color[person[paint.attributeName]]
        } else if (person[paint.attributeName] !== undefined) {
          typeof(paint.color) === 'string' ? ctx.fillStyle = paint.color : ctx.fillStyle = paint.color[person[paint.attributeName]]
        }
      }

      ctx.fillRect(x, y + this.nodeWidth, this.nodeWidth, this.nodeHeight - this.nodeWidth)
      ctx.stroke()
      this.drawVerticalText(ctx, x, y + this.nodeWidth, person.name)
    }

    /**
     * @method 绘制头像
     * @param {object} ctx: CanvasRenderingContext2D
     * @param {number} x: 起始横坐标
     * @param {number} y: 起始纵坐标
     * @param {string} avatarUrl: 头像地址
     */
    drawAvatar(ctx, x, y, person) {
      const img = new Image() // 创建一个<img>元素
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

    setCanvasSize(canvas, width, height) {
      canvas.setAttribute('width', width - this.nodeHorizontalSpacing)
      canvas.setAttribute('height', height + this.nodeHeight)
    }
}