const cells = document.querySelectorAll('.cells'),
      gameOverDialog = document.querySelector('.gameover'),
      playAgain = document.querySelector('#start'),
      startBtn = document.querySelector('#startbtn'),
      board = document.querySelector('.board'),
      selectMenu =document.querySelector('.select'),
      winText = document.querySelector('.winText');
let humanPlayer,aiPlayer,boardArr;


//Winning Combinations
const winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
];


//Start Game
const startGame =()=>{
  //create array with 0-9 values
  boardArr = Array.from(Array(9).keys());
  //resetting every div
  cells.forEach(el=>{
    el.addEventListener('click',divClick);
    el.style.fontSize='0';
    setTimeout(()=>el.textContent='',400);
    el.classList.remove('winner');
    el.style.removeProperty('background-color');
  });
  gameOverDialog.classList.add('invisible');
  setTimeout(()=>gameOverDialog.style.display = 'none',400);
};

//startGame();


//Div clicking Event
const divClick =e=>{
  if(typeof boardArr[e.target.id] === 'number'){
    changeTurn(e.target.id,humanPlayer);
    if(!checkWin(boardArr,humanPlayer)&&!checkTie()) changeTurn(bestSpot(),aiPlayer);
  }
}


//Change Turn
const changeTurn = (boardId,player)=>{
  boardArr[boardId]= player;
  const elem = document.getElementById(boardId);
  elem.style.fontSize = '4.5em';
  elem.textContent = player;
  const gameWon = checkWin(boardArr,player);
  if(gameWon) {gameOver(gameWon);return;};
  checkTie();
}


//empty spots
const emptySpots = ()=>{
  //filter out elements that are number
  return boardArr.filter((el,i)=> i===el); 
}


//best Spot
const bestSpot = ()=>{
  //return emptySpots()[0];
  return minimax(boardArr,aiPlayer).index;
}


//check Tie
const checkTie = ()=>{
  //if there is no empty spot left then game is a tie
  if(emptySpots().length ===0){
    cells.forEach(el=>{
      el.style.backgroundColor='#A5D6A7';
      el.removeEventListener('click',divClick)
    });
   winner('Tie!');
  return true;
  }
 return false;
}


//Winner message
const winner = message=>{
  winText.textContent = message;
  gameOverDialog.classList.remove('invisible');
 setTimeout(()=>gameOverDialog.style.display = 'block',400) 
}


//Check Win condition
const checkWin= (board,player)=>{
  //get the moves of the player
 const moves = board.reduce((acc,el,index)=>(el===player)? acc.concat(index):acc,[]);
 let gameWin = null;
  //get index and wincombination array
  for(let [index,combo] of winCombos.entries()) {
    //if moves are equal to win combination then get the index and player who won and break out;
    if(combo.every(el=>moves.indexOf(el)>-1)){
     gameWin = {index:index,player:player};
     break;
    }
  }
  //if there is no winner then return gameWin i.e: null
  return gameWin;
}


//Check if game is over
const gameOver = gameW=>{
  //get indices of the winner
  for(let index of winCombos[gameW.index]){
    document.getElementById(index).classList.add('winner');
    }
  cells.forEach(el=>{
    el.removeEventListener('click',divClick);
  })
  winner(gameW.player ==humanPlayer? 'You Win!': 'Computer Wins!');
}


//Mini Max
const minimax = (newBoard,player)=>{
    let availSpots = emptySpots(newBoard);
  
  if (checkWin(newBoard, humanPlayer)) {
    return {score: -10};
  } else if (checkWin(newBoard, aiPlayer)) {
    return {score: 10};
  } else if (availSpots.length === 0) {
    return {score: 0};
  }
  
  let moves = [];
  for (let i = 0; i < availSpots.length; i ++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    
    if (player === aiPlayer)
      move.score = minimax(newBoard, humanPlayer).score;
    else
       move.score =  minimax(newBoard, aiPlayer).score;
    newBoard[availSpots[i]] = move.index;
    if ((player === aiPlayer && move.score === 10) || (player === humanPlayer && move.score === -10))
      return move;
    else 
      moves.push(move);
  }
  
  let bestMove, bestScore;
  if (player === aiPlayer) {
    bestScore = -1000;
    for(let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
      bestScore = 1000;
      for(let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  
  return moves[bestMove];
}

const playMenu = ()=>{
board.style.display= 'none';
selectMenu.style.display = 'block';
gameOverDialog.style.display= 'none';
}

//Event Listeners
playAgain.addEventListener('click',playMenu);

startBtn.addEventListener('click',()=>{
  board.style.display= 'block';
  selectMenu.style.display = 'none';
  humanPlayer =document.querySelector('input[name="radio"]:checked').value;
  humanPlayer === 'X'? aiPlayer = 'O':aiPlayer ='X';
  startGame();
})

