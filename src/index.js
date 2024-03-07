import CanvasOrgChart from './canvas-orgchart.js'
import data from '/static/mock/data.js'

const $ = document.querySelector.bind(document)

const options = {
  width: 0,
  height: 0,
  direction: 'row',
  padding: [20],
  background: '',
  selectable: true,
  selectedBorder: 'red',
  node: {
    width: 100,
    height: 100,
    spacing: [20, 40],
    radii: 8,
    color: 'white',
    borderColor: 'yellow',
    background: 'cornflowerblue',
    avatar: {
      url: '/static/images/male.jpg',
      offsetX: 30, // (100 - 40) / 2
      offsetY: 8,
      width: 40,
      height: 40,
      circle: true 
    },
    name: {
      offsetX: 0,
      offsetY: 70,
      color: 'white',
      font: '16px sans-serif',
      textAlign: 'center',
    },
    desc: [
      {
        offsetX: 0,
        offsetY: 70,
        color: 'white',
        font: '16px sans-serif',
        textAlign: 'center',
      }
    ]
  },
}

const canvas = $('canvas')
const canvasOrgChart = new CanvasOrgChart(canvas, options)

function dataFormat(node) {
  if (node.sex === 1) {
    node.nodeAttr = {
      background: 'lightcoral',
    }
  }
  node.children.map(el => {
    dataFormat(el)
  })
}
dataFormat(data)

canvasOrgChart.render(data)

canvasOrgChart.addEventListener('select', function(node) {
  if (node) alert(node.name)
})

$('.export').addEventListener('click', function() {
  const anchor = document.createElement('a')
  anchor.download = 'canvas-orgchart.png'
  anchor.href = canvas.toDataURL('image/png')
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}, false)
