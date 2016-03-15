import React from 'react'
import { render } from 'react-dom'
import App from './App.react'

var player = document.getElementById('player').innerHTML

if(['red', 'blue', 'green', 'yellow'].indexOf(player) == -1) {
  var player = 'red'
}

render(
  <App player={player} />,
  document.getElementById('react-root')
)
