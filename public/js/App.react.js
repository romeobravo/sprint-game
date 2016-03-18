import React, { Component, PropTypes } from 'react'
import Players from './Players.react'
import Phase from './Phase.react'
import Card from './Card.react'
import SprintCard from './SprintCard.react'

function notInSprint(card) {
  return card.sprint == false
}

function inSprint(card) {
  return card.sprint == true
}

function turn(state, player) {
  return state.game ? state.game.players[player].turn == true : false
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      connected: false,
      swapping: false,
      game: false
    }
  }

  componentDidMount() {
    var self = this
    this.socket = io()
    this.socket.emit('ready', { player: this.state.player })
    this.socket.on('event', function(state){
      self.setState({
        connected: true,
        game: state
      })
    })
  }

  swapCard(cardId) {
    console.log('swap', this.state.adding, cardId)
    this.socket.emit('swap', { addedCard: this.state.adding, swappedCard: cardId})
    this.setState({
      swapping: false,
      adding: null
    })
  }

  addCard(cardId) {
    if(this.state.game.currentWeight + this.state.game.cards[cardId].weight > this.state.game.maxWeight) {
      this.setState({
        swapping: true,
        adding: cardId
      })
    } else {
      console.log('add', cardId)
      this.socket.emit('swap', { addedCard: cardId})
    }
  }

  cancelCard(cardId) {
    this.setState({
      swapping: false,
      adding: null
    })
  }

  toInitialState() {
    this.setState({
      swapping: false,
      adding: null
    })
    this.socket.emit('reset')
  }

  pass() {
    this.socket.emit('pass')
  }

  render() {
    if(this.state.connected) {
      let self = this
      let sprintCards = this.state.game.cards.filter(inSprint).map( card => {
        return (
          <SprintCard
            key={card.id}
            game={self.state.game}
            cardId={card.id}
            title={card.title}
            weight={card.weight}
            player={card.player}
            swapping={self.state.swapping}
            adding={self.state.adding}
            swap={self.swapCard.bind(self)}
            turn={turn(this.state, this.props.player)}
          />
        )
      })
      let freeCards = this.state.game.cards.filter(notInSprint).map( card => {
        return (
          <Card
            key={card.id}
            swapping={self.state.swapping}
            adding={self.state.adding}
            cardId={card.id}
            title={card.title}
            weight={card.weight}
            add={self.addCard.bind(self)}
            cancel={self.cancelCard.bind(self)}
            game={self.state.game}
            turn={turn(this.state, this.props.player)}
          />
        )
      })
      let classes = "header " + this.props.player
      let pass = turn(this.state, this.props.player) ? <div className="header-action" onClick={this.pass.bind(this)}>Pass</div> : null
      let space = this.state.game.currentWeight + '/' + this.state.game.maxWeight
      return (
        <div>
          <div className={classes}>
            <div className="name">Sprint-game</div>
            <Phase state={this.state} player={this.props.player} />
            { pass }
            <div className="header-action reset" onClick={this.toInitialState.bind(this)}>Reset</div>
          </div>
          <Players state={this.state} player={this.props.player}/>
          <section className="sprint">
            <div className="bord-name">Sprint ({space})</div>
            { sprintCards }
          </section>
          <section>
            <div className="bord-name">Available</div>
            { freeCards }
          </section>
        </div>

      )
    } else {
      return (<div></div>)
    }
  }
}

export default App