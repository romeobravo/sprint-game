/* React */
import React, { Component, PropTypes } from 'react'

function turn(state, player) {
  return state.game ? state.game.players[player].turn == true : false
}

function Players(props) {
  let players = ['red', 'blue', 'green', 'yellow'].map( color => {
    let classes = turn(props.state, color) ? color + ' player turn' : color + ' player'
    return (
      <div className={classes} key={color}>{color.toUpperCase()}</div>
    )
  })
  return (
    <div className="players">
      {players}
    </div>
  )
}

export default Players;
