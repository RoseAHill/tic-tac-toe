/* Element Constants */

const messageEl = document.querySelector("#message")
const startEl = document.querySelector("#start")
const boardParent = document.querySelector("#board")

const boardSquares = document.querySelectorAll('#board>div')
const squareEls = Array.from(boardSquares)

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

/* Game Functions */

// removes the inner text from all the squares on the board
const clearBoard = () => {
  squareEls.forEach(square => {
    square.innerText = ""
  })
  console.log("clearing board")
  board = [...boardTemplate]
  console.log(board)
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

// prints out the result depending on if its a tie, then adds the winner to the past winner list
const endMatch = (isTie) => {
  if(isTie) {
    renderMessage(`Cat's game, whomp whomp, nobody won...`)
    pastWinners.push("Tie")
  } else {
    renderMessage(`${playerTurn.name} won!`)
    pastWinners.push(playerTurn.name)
  }
  squareEls.forEach(square => {
    square.removeEventListener("click", clickHandler)
  })
  console.log(pastWinners)
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

const showStart = (toShow) => {
  if (toShow) {
    startEl.removeAttribute("hidden")
    startEl.addEventListener("click", resetBoard)
  } else {
    startEl.setAttribute("hidden", true)
    startEl.removeEventListener("click", resetBoard)
  }
}

const resetBoard = () => {
  clearBoard()
  init()
}

/* Game Function Calls */

resetBoard()





// /* Game Class */

// class Game {
//   constructor(){
//     this.createBoard()

//   }
//   createBoard() {
//     squareEls.forEach(square => {
//       square.innerText = ""
//       square.addEventListener("click", this.clickHandler)
//     });
//   }
//   clickHandler(e) {
//     console.log(e)
//     const id = parseInt(e.target.id)
//     if (!board[id]) {
//       board[id] = playerTurn.symbol
//       e.target.innerText = playerTurn.symbol
//       this.testForWin()
//       playerTurn = playerTurn === players[0] ? players[1] : players[0]
//     }
//     e.target.removeEventListener('click', this.clickHandler);
//   }
//   testForWin() {
  
//   }
//   winHandler() {
//     messageEl.innerText = `${this.playerTurn.name} won!`
//   }
// }
                
// const currentGame = new Game();