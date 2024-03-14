import CanvasOrgChart from './canvas-orgchart.js'
import data from '/static/mock/data.js'

const $ = document.querySelector.bind(document)

const options = {
  width: 0,
  height: 0,
  padding: [20],
  background: '',
  lineColor: 'black',
  node: {
    width: 100,
    height: 80,
    spacing: [20, 40],
    radii: 8,
    background: '#fff0b5',
    borderColor: '#d78624',
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
      offsetY: 69,
      color: '#d78624',
      font: '14px sans-serif',
      textAlign: 'center',
    },
    descs: {
      height: 50,
      color: '#666',
      background: 'white',
      font: '12px sans-serif',
      textAlign: 'center',
      offset: [
        {
          offsetX: 0,
          offsetY: 100,
        },
        {
          offsetX: 0,
          offsetY: 120,
        }
      ]
    },
  },
}

const canvas = $('canvas')
const canvasOrgChart = new CanvasOrgChart(canvas, options)

function dataFormat(node, level = 0) {
  if (!node.nodeAttr) node.nodeAttr = {}
  if (node.sex === 1) {
    Object.assign(
      node.nodeAttr, 
      {
        avatar: {
          url: '/static/images/female.jpg',
        }
      }
    )
  }
  switch (level) {
    case 0:
      Object.assign(
        node.nodeAttr, 
        {
          borderColor: '#9a49c7',
          background: '#ffe9ff',
          name: {
            color: '#9a49c7'
          }
        }
      )
      break
    case 1:
      Object.assign(
        node.nodeAttr, 
        {
          borderColor: '#5994db',
          background: '#addcf1',
          name: {
            color: '#5994db'
          }
        }
      )
  }
  node.children.map(el => {
    dataFormat(el, level + 1)
  })
}
dataFormat(data)

canvasOrgChart.render(data)


function cb(node) {
  if (node) {
    alert(node.name)
    canvasOrgChart.removeEventListener('select', cb)
  }
}
canvasOrgChart.addEventListener('select', cb)

$('.export').addEventListener('click', function() {
  const anchor = document.createElement('a')
  anchor.download = 'canvas-orgchart.png'
  anchor.href = canvas.toDataURL('image/png')
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}, false)
