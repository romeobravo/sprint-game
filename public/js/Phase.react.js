/* React */
import React, { Component, PropTypes } from 'react'

function turn(state, player) {
  return state.game ? state.game.players[player].turn == true : false
}

function score(state, player) {
  let scr = 0
  console.log(state.game.sprint)
  for(let card in state.game.sprint) {
    if(state.game.sprint[card] && state.game.sprint[card].player == player) {
      scr += state.game.sprint[card].weight
    }
  }
  return scr
}

function Phase(props) {
  return (
    <div className="phase">
      <div>Phase: {props.state.game.phase}</div>
      <div>Score: {score(props.state, props.player)}</div>
      <div>{ props.state.game.phase == 2 ? 'Turns: ' + props.state.game.turns : null }</div>
    </div>
  )
}

export default Phase;
