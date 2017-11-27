const path = require('path')
const http = require('http')
const express = require('express')
const WebSocket = require('ws')
const uuid = require('uuid/v4')
const open = require('open')
const BigRedButton = require('big-red-button')

const app = express()
app.use(express.static(path.resolve(__dirname, '..', 'public')))

const port = process.env.PORT || 9090
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
const socks = {}

function start () {
  let button = null

  try {
    button = new BigRedButton.BigRedButton(0)
  } catch (error) {
    console.error('No big red button found')
  }

  server.listen(port, () => {
    console.log(`Server on port ${port}`)

    open(`http://localhost:${port}`)
  })

  if (button) {
    button.on('buttonPressed', () => {
      console.log('Button pressed')
      send('buttonPressed')
    })

    button.on('buttonReleased', () => {
      console.log('Button released')
      send('buttonReleased')
    })

    button.on('lidRaised', () => {
      console.log('Lid raised')
      send('lidRaised')
    })

    button.on('lidClosed', () => {
      console.log('Lid closed')
      send('lidClosed')
    })
  }
}

function send (data) {
  for (let id in socks) {
    const sock = socks[id]

    if (sock.readyState === 1) {
      sock.send(data)
    } else {
      socks[id] = null
      delete socks[id]
    }
  }
}

wss.on('connection', (sock) => {
  const id = uuid()
  console.log(`New connection: ${id}`)
  socks[id] = sock
})

wss.on('error', (error) => {
  console.error(error)
})

module.exports = { start }
