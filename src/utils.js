/**
 * @method 判断某个点是否在矩形中
 * @param {number[]} origin: 矩形左上角坐标
 * @param {number} width: 矩形宽度
 * @param {number} height: 矩形高度
 * @param {number} x: 点的横坐标
 * @param {number} y: 点的纵坐标
 * @return {boolean}
 */
function pointInRect(origin, width, height, x, y) {
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
  return getCrossProduct(p, a, b) * getCrossProduct(p, c, d) >= 0 &&
    getCrossProduct(p, b, c) * getCrossProduct(p, d, a) >= 0
}

/**
 * @method 叉乘
 * @param {object} p
 * @param {object} p1
 * @param {object} p2
 * @return {boolean}
 */
function getCrossProduct(p, p1, p2) {
  return (p2.x - p1.x) * (p.y - p1.y) - (p.x - p1.x) * (p2.y - p1.y)
}

/**
 * @method reverseAssign
 * @param {object} target
 * @param {*} sources
 */
function reverseAssign(target) {
  if (target == null) { // null == undefined -> true
    throw new Error('Cannot convert undefined or null to object.')
  }
  const from = Object(target)
  for (let i = arguments.length - 1; i > 0; i--) {
    const source = arguments[i]
    if (source != null) {
      for (let key in source) {
        if (!Object.prototype.hasOwnProperty.call(from, key))
        from[key] = source[key]
      }
    }
  }
  return from
}

export { pointInRect, getCrossProduct, reverseAssign }
