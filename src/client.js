const WinWheel = require('winwheel')
const randomInt = require('random-int')

const colors = ['#591781', '#4E2C69', '#AE3557', '#6420B1', '#A946B9', '#591781', '#4E2C69', '#AE3557', '#6420B1', '#A946B9', '#591781', '#4E2C69', '#AE3557', '#6420B1', '#A946B9', '#591781', '#4E2C69', '#AE3557', '#6420B1', '#A946B9']

const restaurants = ['Samosa House', 'Fiesta Brava', 'Komodo', 'Cafe 212 Pier', `George's`, 'L&L Hawaiian', `Morfia's`, 'In-N-Out', 'Chic-fil-A', 'Thai vegan', 'Subway', 'JINYA Ramen', 'Taco Truck', `Jersey Mike's`]

const segments = restaurants.map((x, i) => {
  return {
    'fillStyle' : colors[i],
    'text' : x,
    'textFontSize' : 15,
    'textFillStyle': '#fff'
  }
})

function createWheel() {
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
      'duration': randomInt(5, 10),
      'spins': randomInt(5, 10),
      'callbackFinished' : 'alertPrize()'
    }
  })
}

let wheel = createWheel()

window.alertPrize = function() {
  const winner = wheel.getIndicatedSegment().text
  output.innerHTML = `${winner}`
  output.classList.toggle('Show', true)
  body.classList.toggle('Spinning', false)
}

const spinButton = document.querySelector('.SpinButton')
const output = document.querySelector('.WheelOutput')
const body = document.body

spinButton.addEventListener('click', (event) => {
  event.preventDefault()
  wheel = createWheel()
  output.textContent = ''
  output.classList.toggle('Show', false)
  body.classList.toggle('Spinning', true)
  wheel.startAnimation()
}, false)

const {pathname, host, protocol}  = window.location
const ws = new WebSocket(`${protocol === 'https:' ? `wss` : `ws`}://${host}${pathname}`)


ws.addEventListener('message', event => {
  const data = event.data

  if (data === 'buttonPressed') {
    spinButton.classList.toggle('active', true)
  } else if (data === 'buttonReleased') {
    spinButton.classList.toggle('active', false)
    spinButton.click()
  } else if (data === 'lidRaised') {
    body.classList.toggle('Blink', true)
  } else if (data === 'lidClosed') {
    body.classList.toggle('Blink', false)
  }
})
