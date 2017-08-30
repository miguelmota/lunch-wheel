const PrizeWheel = require('prize-wheel')
const chromatic = require('d3-scale-chromatic')

const settings = {
  el: '#wheel',
  members: ['Samosa House', 'Fiesta Brava', 'Komodo', 'Cafe Pier 212', `George's`, 'L&L Hawaiin', `Morfia's`, 'In-N-Out', 'Chic-fil-A'],
  colors: chromatic.schemeSet3,
  radius: 250
}

const wheel = new PrizeWheel(settings)

wheel.init()

const spinButton = document.querySelector('.Spin')
const output = document.querySelector('.WheelOutput')

spinButton.addEventListener('click', (event) => {
  event.preventDefault()
  output.textContent = ''

  wheel.spin(member => {
    output.innerHTML = `Winner:<br /><strong>${member}</strong>`
  })
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
  }
})
