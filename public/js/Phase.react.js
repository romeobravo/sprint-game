/* React */
import React, { Component, PropTypes } from 'react'

function turn(state, player) {
  return state.game ? state.game.players[player].turn == true : false
}

function Phase(props) {
  return (
    <div className="phase">
      <div>Phase: {props.state.game.phase}</div>
      <div>{ props.state.game.phase == 2 ? 'Turns: ' + props.state.game.turns : null }</div>
    </div>
  )
}

export default Phase;
