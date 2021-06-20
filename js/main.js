/* Random Name List */

// Most of these names were pulled from this article: https://www.polygon.com/features/2019/11/27/20974490/greatest-video-game-characters-2019-2010-skyrim-witcher-splatoon
const nameArray = ["Ash Ketchum", "Steve", "Link", "Mario", "Pikachu", "Cloud", "Agent 47", "Freddy Fazbear", "Bayonetta", "Dovahkiin", "Sephiroth", "Lightning", "Lightning McQueen", "Zelda", "Batman", "Joker", "The Bloody Baron", "The Squid Sisters", "Catherine De Medici", "Clementine", "Lee", "Delilah Copperspoon", "Dutch Van Der Linde", "Edith Finch", "Elizabeth", "Booker", "Ellie", "Riley", "Elodie", "Emet-Selch", "Florence Yeoh", "Ghost", "Glados", "Goose", "Handsome Jack", "Hannah", "Herschel Biggs", "Isabelle", "Jane Shepard", "Kiryu Kazuma", "Josh", "Junko Enoshima", "Kassandra", "Kratos", "Lara Croft", "Lester Crest", "Lily Bowen", "Lincoln Clay", "Madeline", "Mae Borowski", "Marcus Fenix", "Marcus Holloway", "Max", "Chloe", "Monika", "Nathan Drake", "Owlboy", "Paarthurnax", "Pagan Min", "Parvati Holcomb", "Prince Sidon", "Ratbag the Coward", "Sam Porter Bridges", "Samantha Greenbrair", "Sans Undertale", "Shovel Knight", "Sojiro Sakura", "Spider-Man", "Stanley", "Tracer", "The Traveler", "Venom Snake"]

// Sounds are from https://www.myinstants.com/
const winSounds = ["omae-wa-mou-shindeirump3.mp3", "nani_mkANQUf.mp3", "you-fool_1.mp3", "roblox-death-sound_1.mp3", "anime-wow-sound-effect.mp3", "movie_1.mp3", "sound-9______.mp3", "order66.mp3", "that_was_easy.mp3", "its-a-very-nice.mp3", "139-item-catch.mp3", "punch.mp3", "yeet.mp3", "ding-sound-effect_1.mp3", "discord-leave_NoJ5lp8.mp3", "12_3.mp3"]


/* Element Constants */

const messageEl = document.querySelector("#message")
const startEl = document.querySelector("#start")
const boardParent = document.querySelector("#board")
const vsNamesEl = document.querySelector("#vs-names")

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

let currentAudio = null

/* Sound Effects */

const loose = new Audio('https://www.myinstants.com/media/sounds/to-be-continued-song.mp3')
loose.volume = .5
let win = new Audio(`https://www.myinstants.com/media/sounds/${winSounds[Math.floor(Math.random() * winSounds.length)]}`)

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


// prints out the result depending on if its a tie, then adds the winner to the past winner list
const endMatch = (isTie) => {
  if(isTie) {
    renderMessage(`To be continued...`)
    pastWinners.push("Tie")
    handleSound(loose)
  } else {
    renderMessage(`${playerTurn.name} won!`)
    pastWinners.push(playerTurn.name)
    trackScore(players.indexOf(playerTurn))
    handleSound(win)
    win = new Audio(`https://www.myinstants.com/media/sounds/${winSounds[Math.floor(Math.random() * winSounds.length)]}`)
  }
  squareEls.forEach(square => {
    square.removeEventListener("click", clickHandler)
  })
  // console.log(pastWinners)
  playerTurn = players[pastWinners.length % 2]
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

// Handles end music & showing start button
const handleSound = (audio) => {
  audio.volume = .5
  currentAudio = audio
  audio.play()
  if(audio == loose) {
    window.setTimeout(function() {
      showStart(true)
    }, 4000)
  } else {
    showStart(true)
  }
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
  if (currentAudio == loose) loose.volume = 0
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
  vsNamesEl.innerText = `${players[0].name} VS ${players[1].name}`
}

/* Game Function Calls */

resetBoard()
