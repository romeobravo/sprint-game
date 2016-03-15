/* React */
import React, { Component, PropTypes } from 'react'

function addable(props) {
  if(props.game.phase < 3)
    return !props.swapping && props.turn
  else
    return !props.swapping && props.turn && props.game.currentWeight + props.game.cards[props.cardId].weight <= props.game.maxWeight
}

function cancelable(props) {
  return props.swapping && props.cardId == props.adding
}

function Card(props) {
  let button = addable(props) ? <div className="card-action" onClick={() => props.add(props.cardId)}>Add</div> : null
  let cancelButton = cancelable(props) ? <div className="card-action" onClick={() => props.cancel(props.cardId)}>Cancel</div> : null
  return (
    <div className="card">
      <div className="card-title">{props.title}</div>
      <div className="card-weight">{props.weight}</div>
      { button || cancelButton }
    </div>
  )
}

export default Card;
