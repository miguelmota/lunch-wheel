# Lunch Wheel

> A lunch wheel for when you can't decide.

# Demo

**[https://lab.miguelmota.com/lunch-wheel](https://lab.miguelmota.com/lunch-wheel)**

Example showing the button

<img src="./screencast_button.gif" width="400">

Current retro theme

<img src="./screencast_retro.gif" width="600">

# Requirements

- [Dream Cheeky Big Red Button](http://dreamcheeky.com/big-red-button)

# Install

```bash
npm install -g lunch-wheel
```

# Usage

Run server

```bash
$ lunch-wheel
```

Then head over to [http://localhost:9090/](http://localhost:9090/)

### Update segments

Open up the console and do:

```javascript
window.lunchWheel.segments(['Burgers', 'Tacos', 'Ramen', 'Burritos', 'Seafood', 'Salad'])
```

### Update wheel name

Open up the console and do:

```javascript
window.lunchWheel.name(['Dinner Wheel'])
```

# Development

Build client scripts

```bash
npm run watch
```

# FAQ

- Q: It isn't detecting my big red button!

  - A: Plug in the USB first and then restart server.

# License

MIT
