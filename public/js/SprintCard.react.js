/* React */
import React, { Component, PropTypes } from 'react'

function swappable(props) {
  // console.log(props, props.swapping, props.game.currentWeight + props.game.cards[props.cardId].weight - props.weight <= props.game.maxWeight)
  return props.swapping && props.game.currentWeight + props.game.cards[props.adding].weight - props.weight <= props.game.maxWeight
}

function SprintCard(props) {
  let button = swappable(props) ? <div className="card-action" onClick={() => props.swap(props.cardId)}>Swap</div> : null
  let classes = 'card-border ' + props.player
  return (
    <div className="card sprint-card">
      <div className="card-title">{props.title}</div>
      <div className="card-weight">{props.weight}</div>
      {button}
      <div className={classes}></div>
    </div>
  )
}

export default SprintCard;
