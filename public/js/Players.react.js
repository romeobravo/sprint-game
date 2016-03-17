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

const names = {
  red: 'Customer',
  blue: 'Product Owner',
  green: 'Scrum Master',
  yellow: 'Developer'
}

function Players(props) {
  let players = ['red', 'blue', 'green', 'yellow'].map( color => {
    let classes = turn(props.state, color) ? color + ' player turn' : color + ' player'
    return (
      <div className={classes} key={color}>
        <div>{names[color].toUpperCase()}</div>
        <div>{score(props.state, color)}</div>
      </div>
    )
  })
  return (
    <div className="players">
      {players}
    </div>
  )
}

export default Players;
