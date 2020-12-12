require('./index.css')
import CanvasOrgChart from '../canvas-orgchart' // npm publish 时记住要删除无用的依赖，在这个项目中可以全部删除
import data from '../public/mock/data'

const $ = document.querySelector.bind(document)

const options = {
  width: 0,
  height: 0,
  scale: [1, 1],
  originX: 0,
  originY: 0,
  padding: [10, 50],
  node: {
    width: 60,
    height: 160,
    spacing: [20, 20],
    color: 'white',
    background: 'cornflowerblue',
    customBackgrounds: [
      {
        attributeName: 'sex',
        checkOwn: false,
        color: {
          0: 'cornflowerblue',
          1: 'lightcoral'
        }
      },
      {
        attributeName: 'self',
        checkOwn: true,
        color: 'black'
      }
    ],
    defaultAvatar: '/images/male.jpg',
    customAvatar: {
      attributeName: 'sex',
      avatars: {
        0: '/images/male.jpg',
        1: '/images/female.jpg'
      }
    },
  },
  nodeTemplate: [
    {
      attributeName: 'spouse',
      checkOwn: true,
      width: 120,
      draw: function(that, ctx, x, y, node) {
        that.drawAvatar(ctx, x, y, node)
        that.drawAvatar(ctx, x + this.width / 2, y, node.spouse)
        // node color
        if (node.self) {
          ctx.fillStyle = 'black'
        } else if (node.sex === 0) {
          ctx.fillStyle = 'cornflowerblue'
        } else {
          ctx.fillStyle = 'lightcoral'
        }
      
        ctx.fillRect(x, y + that.nodeWidth, that.nodeWidth, that.nodeHeight - that.nodeWidth)
        if (node.spouse && node.spouse.sex === 0) {
          ctx.fillStyle = 'cornflowerblue'
        } else if (node.spouse && node.spouse.sex === 1) {
          ctx.fillStyle = 'lightcoral'
        }
        ctx.fillRect(x + this.width / 2, y + that.nodeWidth, that.nodeWidth, that.nodeHeight - that.nodeWidth)
        ctx.stroke()
        const textHeight = that.nodeHeight - that.nodeWidth
        that.drawVerticalText(ctx, x, y + that.nodeWidth, that.nodeWidth, textHeight, node.name)
        that.drawVerticalText(ctx, x + this.width / 2, y + that.nodeWidth, that.nodeWidth, textHeight, node.spouse.name)
      }
    }
    // {
    //   attributeName: 'test',
    //   checkOwn: true,
    //   width: 40,
    //   height: 140,
    //   draw: function(that, ctx, x, y, node) {
    //     that.drawAvatar(ctx, x, y, node, this.width)
    //     // node color
    //     ctx.fillStyle = that.nodeBackground
    //     if (that.nodeCustomBackgrounds.length > 0) {
    //       for (let color of that.nodeCustomBackgrounds) {
    //         if (color.own && Object.prototype.hasOwnProperty.call(node, color.attributeName) || node[color.attributeName]) {
    //           ctx.fillStyle = color.color
    //         }
    //       }
    //     }
      
    //     ctx.fillRect(x, y + this.width, this.width, 100)
    //     ctx.stroke()
    //     that.drawVerticalText(ctx, x, y + this.width, this.width, 100, node.name)
    //   }
    // }
  ],
  // nodeTemplate: function(that, ctx, x, y, node) {
  //   that.drawAvatar(ctx, x, y + that.nodeHeight - that.nodeWidth, node)
  //   // node color
  //   ctx.fillStyle = that.nodeBackground
  //   for (let paint of that.nodeCustomBackgrounds) {
  //     if (paint.checkOwn && Object.prototype.hasOwnProperty.call(node, paint.attributeName) || node[paint.attributeName] !== undefined) {
  //       typeof(paint.color) === 'string' ? ctx.fillStyle = paint.color : ctx.fillStyle = paint.color[node[paint.attributeName]]
  //     }
  //   }

  //   ctx.fillRect(x, y, that.nodeWidth, that.nodeHeight - that.nodeWidth)
  //   ctx.stroke()
  //   that.drawVerticalText(ctx, x, y, node.name)
  // }
}

const canvas = $('canvas')
const canvasOrgChart = new CanvasOrgChart(canvas, options)
canvasOrgChart.render(data)

$('.get-current-node').addEventListener('click', function() {
  alert(canvasOrgChart.currentSelected ? canvasOrgChart.currentSelected.name : '未选中任何节点')
}, false)

$('.export').addEventListener('click', function() {
  const anchor = document.createElement('a')
  anchor.download = 'canvas-orgchart.png'
  anchor.href = canvas.toDataURL('image/png')
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}, false)
