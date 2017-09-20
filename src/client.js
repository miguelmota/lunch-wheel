/**
 * This is prototype. Beware: crappy code ahead.
 */

const WinWheel = require('winwheel')
const randomInt = require('random-int')

const wheelNameEl = document.querySelector('.HeaderWheelName')
const spinButton = document.querySelector('.SpinButton')
const result = document.querySelector('.WheelResult')
const body = document.body
let resultTimeout = null
let restaurants = null
let wheelName = wheelNameEl.textContent

const defaultRestaurants = ['Samosa House', 'Fiesta Brava', 'Komodo', 'Cafe 212 Pier', `George's`, 'L&L Hawaiian', `Morfia's`, 'In-N-Out', 'Chic-fil-A', 'Thai vegan', 'Subway', 'JINYA Ramen', 'Taco Truck', `Jersey Mike's`]

const localStorageKeySegments = 'lunchwheel:segments'
const localStorageKeyWheelName = 'lunchwheel:name'

const colors = ['#591781', '#4E2C69', '#AE3557', '#6420B1', '#A946B9', '#591781', '#4E2C69', '#AE3557', '#6420B1', '#A946B9', '#591781', '#4E2C69', '#AE3557', '#6420B1', '#A946B9', '#591781', '#4E2C69', '#AE3557', '#6420B1', '#A946B9']

window.lunchWheel = {
  segments: function (list) {
    if (!Array.isArray(list)) {
      return restaurants
    }

    restaurants = list

    try {
      localStorage.setItem(localStorageKeySegments, JSON.stringify(list))
    } catch (error) { }

    wheel = createWheel()
    return restaurants
  },
  name: function (name) {
    if (typeof name !== 'string') {
      return wheelName
    }

    wheelName = name

    try {
      localStorage.setItem(localStorageKeyWheelName, wheelName)
    } catch (error) { }

    wheelNameEl.textContent = wheelName

    return wheelName
  }
}

try {
  restaurants = JSON.parse(localStorage.getItem(localStorageKeySegments))
} catch (error) {}

if (!restaurants) {
  restaurants = defaultRestaurants
}

try {
  const name = localStroage.getItem(localStorageKeyWheelName)
  if (name) {
    wheelName = name
    lunchWheel.name(wheelName)
  }
} catch (error) {}

function createWheel() {
  const segments = restaurants.map((x, i) => {
    return {
      'fillStyle': colors[i],
      'text': x,
      'textFontSize': 15,
      'textFillStyle': '#fff'
    }
  })

  return new WinWheel({
    'outerRadius': 212,
    'innerRadius': 75,
    'textFontSize': 24,
    'textOrientation': 'horizontal',
    'textAlignment': 'outer',
    'numSegments': segments.length,
    'segments': segments,
    'animation': {
      'type': 'spinToStop',
      'duration': randomInt(8, 12),
      'spins': randomInt(3, 6),
      'callbackFinished' : 'alertPrize()'
    }
  })
}

function onSpinClick (event) {
  event.preventDefault()
  wheel = createWheel()
  hideResult()
  body.classList.toggle('Spinning', true)
  wheel.startAnimation()
}

function showResult() {
  const winner = wheel.getIndicatedSegment().text
  result.innerHTML = `${winner}`
  result.classList.toggle('Show', true)
  body.classList.toggle('Spinning', false)
  clearTimeout(resultTimeout)
  resultTimeout = setTimeout(() => {
    hideResult()
  }, 15e3)
}

function hideResult() {
  result.textContent = ''
  result.classList.toggle('Show', false)
}

let wheel = createWheel()
window.alertPrize = showResult
spinButton.addEventListener('click', onSpinClick, false)

const {host, protocol}  = window.location
const ws = new WebSocket(`${protocol === 'https:' ? `wss` : `ws`}://${host}/`)

ws.addEventListener('message', onMessage)

function onMessage (event) {
  const data = event.data

  if (data === 'buttonPressed') {
    spinButton.classList.toggle('active', true)
  } else if (data === 'buttonReleased') {
    spinButton.classList.toggle('active', false)
    body.classList.toggle('Blink', false)
    spinButton.click()
  } else if (data === 'lidRaised') {
    body.classList.toggle('Blink', true)
  } else if (data === 'lidClosed') {
    body.classList.toggle('Blink', false)
    if (!body.classList.contains('Spinning')) {
      wheel = createWheel()
    }
  }
}
