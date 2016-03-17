var express = require('express')
var app = express();
var http = require('http').Server(app);
var exphbs = require('express-handlebars');
var io = require('socket.io')(http);

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('index');
});

app.get('/red', function(req, res){
  res.render('index', {
    player: 'red'
  });
});

app.get('/blue', function(req, res){
  res.render('index', {
    player: 'blue'
  });
});

app.get('/green', function(req, res){
  res.render('index', {
    player: 'green'
  });
});

app.get('/yellow', function(req, res){
  res.render('index', {
    player: 'yellow'
  });
});

function inSprint(card) {
  return card.sprint == true
}

function initialState() {
  return {
    players: {
      red: {
        status: 0,
        turn: true,
        indicator: 0
      },
      blue: {
        status: 0,
        turn: false,
        indicator: 0
      },
      green: {
        status: 0,
        turn: false,
        indicator: 0
      },
      yellow: {
        status: 0,
        turn: false,
        indicator: 0
      }
    },
    cards: [
      {
        id: 0,
        title: 'User Story 1',
        weight: 1,
        sprint: false
      },
      {
        id: 1,
        title: 'User Story 2',
        weight: 1,
        sprint: false
      },
      {
        id: 2,
        title: 'User Story 3',
        weight: 1,
        sprint: false
      },
      {
        id: 3,
        title: 'User Story 4',
        weight: 1,
        sprint: false
      },
      {
        id: 4,
        title: 'User Story 5',
        weight: 2,
        sprint: false
      },
      {
        id: 5,
        title: 'User Story 6',
        weight: 2,
        sprint: false
      },
      {
        id: 6,
        title: 'User Story 7',
        weight: 3,
        sprint: false
      },
      {
        id: 7,
        title: 'User Story 8',
        weight: 3,
        sprint: false
      },
      {
        id: 8,
        title: 'User Story 9',
        weight: 4,
        sprint: false
      },
      {
        id: 9,
        title: 'User Story 10',
        weight: 4,
        sprint: false
      },
      {
        id: 10,
        title: 'User Story 11',
        weight: 4,
        sprint: false
      },
      {
        id: 11,
        title: 'User Story 12',
        weight: 5,
        sprint: false
      },
      {
        id: 12,
        title: 'User Story 13',
        weight: 5,
        sprint: false
      },
      {
        id: 13,
        title: 'User Story 14',
        weight: 6,
        sprint: false
      },
      {
        id: 14,
        title: 'User Story 15',
        weight: 7,
        sprint: false
      },
      {
        id: 15,
        title: 'User Story 16',
        weight: 7,
        sprint: false
      },
      {
        id: 16,
        title: 'User Story 17',
        weight: 8,
        sprint: false
      },
      {
        id: 17,
        title: 'User Story 18',
        weight: 8,
        sprint: false
      },
      {
        id: 18,
        title: 'User Story 19',
        weight: 9,
        sprint: false
      },
      {
        id: 19,
        title: 'User Story 20',
        weight: 10,
        sprint: false
      }
    ],
    sprint: [],
    maxWeight: 30,
    currentWeight: 0,
    round: 1,
    phase: 1,
    turns: 1000
  }
}

var state = initialState()

function merge(state, player) {
  var temp = state
  temp.player = player
  return temp
}

function connect(player) {
  if(state.players[player])
    state.players[player].status = 1
}

function disconnect(player) {
  if(state.players[player])
    state.players[player].status = 0
}

function phase2(out) {
  if(state.cards[out] && state.phase == 1) {
    state.phase = 2
    state.turns = 3
  }
}

function phase3() {
  if(state.phase == 2 && state.turns <= 0) {
    state.phase = 3
  }
}

function end() {
  var end = true
  state.cards.forEach(function(card) {
    if(!card.sprint && state.currentWeight + card.weight <= state.maxWeight) {
      end = false
    }
  })
  if(state.phase == 3 && end) {
    state.phase = 4
  }
}

function currentPlayer() {
  for(key in state.players) {
    if(state.players[key].turn) {
      return key
    }
  }
}

function turn(out) {
  var players = ['red', 'blue', 'green', 'yellow']
  var player = currentPlayer()
  var idx = (players.indexOf(player) + 1) % 4
  var newPlayer = players[idx]
  state.players[player].turn = false
  state.players[newPlayer].turn = true
  state.turns -= 1
  phase2(out)
  phase3()
  end()
}

function swap(action) {
  var id = action.addedCard
  var out = action.swappedCard
  console.log(id, out)
  state.sprint[id] = state.cards[id]
  state.cards[id].sprint = true
  state.cards[id].player = currentPlayer()
  state.currentWeight += state.cards[id].weight
  if(state.cards[out]) {
    state.currentWeight -= state.cards[out].weight
    state.cards[out].sprint = false
    state.sprint[out] = null
  }
  turn(out)
}

io.on('connection', function(socket) {
  var player;

  socket.on('disconnect', function() {
    disconnect(player)
    io.emit('event', state);
  });

  socket.on('swap', function(action) {
    console.log('Swap: ', action)
    swap(action)
    io.emit('event', state);
  });

  socket.on('ready', function(msg) {
    player = msg.player
    connect(player)
    io.emit('event', state);
  });

  socket.on('pass', function(msg) {
    turn()
    io.emit('event', state)
  })

  socket.on('reset', function() {
    state = initialState()
    state.cards.forEach(function() {
      this.sprint = false
    });
    io.emit('event', state);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});