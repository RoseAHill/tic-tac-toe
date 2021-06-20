/* Random Name List */

const nameArray = ["Steve", "Link", "Mario", "Gomez", "Cloud", "Agent 47", "Freddy Fazbear", "Bayonetta", "Dovahkiin", "Lightning", "Zelda", "Batman", "Joker", "The Bloody Baron", "The Squid Sisters", "Catherine De Medici", "Clementine", "Lee", "Delilah Copperspoon", "Dutch Van Der Linde", "Edith Finch", "Elizabeth", "Booker", "Ellie", "Riley", "Elodie", "Emet-Selch", "Florence Yeoh", "Ghost", "Glados", "Goose", "Handsome Jack", "Hannah", "Herschel Biggs", "Isabelle", "Jane Shepard", "Kiryu Kazuma", "Josh", "Junko Enoshima", "Kassandra", "Kratos", "Lara Croft", "Lester Crest", "Lily Bowen", "Lincoln Clay", "Madeline", "Mae Borowski", "Marcus Fenix", "Marcus Holloway", "Max", "Chloe", "Monika", "Nathan Drake", "Owlboy", "Paarthurnax", "Pagan Min", "Parvati Holcomb", "Prince Sidon", "Ratbag the Coward", "Sam Porter Bridges", "Samantha Greenbrair", "Sans Undertale", "Shovel Knight", "Sojiro Sakura", "Spider-Man", "Stanley", "Tracer", "The Traveler", "Venom Snake"]

/* Element Constants */

const messageEl = document.querySelector("#message")
const startEl = document.querySelector("#start")
const boardParent = document.querySelector("#board")

const boardSquares = document.querySelectorAll('#board>div')
const squareEls = Array.from(boardSquares)

const p1ScoreEl = document.querySelector('#p1-score')
const p2ScoreEl = document.querySelector('#p2-score')

/* Game Templates and Constants */

const players = [
  {name: "Player 1", symbol: "X"},
  {name: "Player 2", symbol: "O"}
]

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8], // horizontal win conditions
  [0,3,6],[1,4,7],[2,5,8], // vertical win conditions
  [0,4,8],[2,4,6]          // diagonal win conditions
]

const boardTemplate = [null, null, null, null, null, null, null, null, null]

/* Game Variables */

let board = [...boardTemplate]
let playerTurn = players[0]

let pastWinners = []

let score = [0,0]

/* Sound Effects */

const loose = new Audio('../assets/you-lost.mp3')
loose.volume = .25
const win = new Audio('../assets/yay.wav')

/* Game Functions */

// removes the inner text from all the squares on the board
const clearBoard = () => {
  squareEls.forEach(square => {
    square.innerText = ""
  })
  // console.log("clearing board")
  board = [...boardTemplate]
  // console.log(board)
}

// gets the id of the div clicked and references the board to see if that div has an owner yet.
// if its empty, set the board owner and inner text of the div to the symbol of the current players symbol,
// It then tests if that player just won
// if not, it checks for if all the squares are full, if so it counts that as a tie
// If none of that, it swaps the players turn and carries on
const clickHandler = (e) => {
  const id = e.target.id
  if (!board[id]) {
    board[id] = playerTurn.symbol
    e.target.innerText = playerTurn.symbol
    if (testForWin()) {
      endMatch(false)
    } else if (!testForWin() && !board.includes(null)) {
      endMatch(true)
    } else {
      playerTurn = playerTurn === players[0] ? players[1] : players[0]
      renderMessage()
    }
  }
}

// Changed the message text to whatever is passed
// TODO: Add next turn sound effect
const renderMessage = (message = `${playerTurn.name}'s turn`) => {
  messageEl.innerText = message
}

// renders score on sides of board
const renderScore = () => {

}


// prints out the result depending on if its a tie, then adds the winner to the past winner list
const endMatch = (isTie) => {
  if(isTie) {
    renderMessage(`Cat's game, nobody won...`)
    pastWinners.push("Tie")
    loose.play()
  } else {
    renderMessage(`${playerTurn.name} won!`)
    pastWinners.push(playerTurn.name)
    trackScore(players.indexOf(playerTurn))
    win.play()
  }
  squareEls.forEach(square => {
    square.removeEventListener("click", clickHandler)
  })
  // console.log(pastWinners)
  playerTurn = players[pastWinners.length % 2]
  showStart(true)
}

// adds the even listeners to the board
const init = () => {
  renderMessage()
  squareEls.forEach(square => {
    square.addEventListener("click", clickHandler)
  })
}

// [0,4,8]
// Checks through the win scenarios for a match
const testForWin = () => {
  let isWin = false;
  winConditions.forEach(scenario => {
    if(board[scenario[0]] === playerTurn.symbol &&
      board[scenario[1]] === playerTurn.symbol &&
      board[scenario[2]] === playerTurn.symbol) {
        isWin = true
    }
  })
  return isWin
}

// toggles start game button
const showStart = (toShow) => {
  if (toShow) {
    startEl.removeAttribute("disabled")
    startEl.addEventListener("click", resetBoard)
  } else {
    startEl.setAttribute("disabled", "")
    startEl.removeEventListener("click", resetBoard)
  }
}

// updates and renders the score count
const trackScore = (whichPlayer) => {
  score[whichPlayer]++
  console.log(score)
  p1ScoreEl.innerText = `${players[0].symbol}'s\n${Object.values(score)[0]}`
  p2ScoreEl.innerText = `${players[1].symbol}'s\n${Object.values(score)[1]}`
}

// clears the board and starts teh game over
const resetBoard = () => {
  clearBoard()
  genRandomName()
  init()
  showStart(false)
}

// generates a random name

const genRandomName = () => {
  players.forEach(player => {
    player.name = nameArray[Math.floor(Math.random()*nameArray.length)]
    console.log(player.name)
  })
  while (players[0].name == players[1].name) {
    genRandomName()
  }
}

/* Game Function Calls */

resetBoard()
