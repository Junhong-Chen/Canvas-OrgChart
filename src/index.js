require('./index.css')
import CanvasOrgChart from './canvas-orgchart'
import data from '../public/mock/data'

const $ = document.querySelector.bind(document)
const canvas = $('canvas')

const config = {
  originX: 0,
  originY: 0,
  width: 0,
  height: 0,
  padding: [10, 50],
  scale: [1, 1],
  nodeWidth: 60,
  nodeHeight: 160,
  nodeSpacing: [20, 20],
  background: '',
  customBackground: function() {

  },
  nodeColor: 'white',
  nodeBackground: 'gray',
  customNodeBackgrounds: [
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
  customNodes: [
    {
      attributeName: 'spouse',
      checkOwn: true,
      width: 120,
      draw: function(that, ctx, x, y, node) {
        x -= (this.width - that.nodeWidth) / 2
        that.drawAvatar(ctx, x, y, node)
        that.drawAvatar(ctx, x + this.width / 2, y, node.spouse)
        // node color
        ctx.fillStyle = that.nodeBackground
        if (that.customNodeBackgrounds.length > 0) {
          for (let color of that.customNodeBackgrounds) {
            if (color.own && Object.prototype.hasOwnProperty.call(node, color.attributeName) || node[color.attributeName]) {
              ctx.fillStyle = color.color
            }
          }
        }
      
        ctx.fillRect(x, y + that.nodeWidth, that.nodeWidth, that.nodeHeight - that.nodeWidth)
        ctx.fillStyle = 'LIGHTCORAL'
        ctx.fillRect(x + this.width / 2, y + that.nodeWidth, that.nodeWidth, that.nodeHeight - that.nodeWidth)
        ctx.stroke()
        that.drawVerticalText(ctx, x, y + that.nodeWidth, node.name)
        that.drawVerticalText(ctx, x + this.width / 2, y + that.nodeWidth, node.spouse.name)
      }
    }
  ],
  // customNodes: function(that, ctx, x, y, node) {
  //   that.drawAvatar(ctx, x, y + that.nodeHeight - that.nodeWidth, node)
  //   // node color
  //   ctx.fillStyle = that.nodeBackground
  //   for (let paint of that.customNodeBackgrounds) {
  //     if (paint.checkOwn && Object.prototype.hasOwnProperty.call(node, paint.attributeName) || node[paint.attributeName] !== undefined) {
  //       typeof(paint.color) === 'string' ? ctx.fillStyle = paint.color : ctx.fillStyle = paint.color[node[paint.attributeName]]
  //     }
  //   }

  //   ctx.fillRect(x, y, that.nodeWidth, that.nodeHeight - that.nodeWidth)
  //   ctx.stroke()
  //   that.drawVerticalText(ctx, x, y, node.name)
  // }
}

const canvasOrgChart = new CanvasOrgChart(config)

canvasOrgChart.render(canvas, data)

$('button').addEventListener('click', function() {
  alert(canvasOrgChart.currentSelected ? canvasOrgChart.currentSelected.name : '未选中任何节点')
}, false)
