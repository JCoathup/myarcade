let canvas = document.getElementById("_canvas");
let controls = document.getElementById("_controls");
let wrapper = document.getElementById("_wrapper");

canvas.setAttribute("width", window.innerWidth);
canvas.setAttribute("height", window.innerHeight);
let context = canvas.getContext("2d");
let framesPerSecond = 30;
let ballX = canvas.width/2;
let ballY = canvas.height/2;
let ballSpeedX = 0.75;
let ballSpeedY = 1;
let playerScore = 0;
let playerLives = 3;

const KEY_LEFT_ARROW = 37;
const KEY_RIGHT_ARROW = 39;
const PADDLE_WIDTH = canvas.width/7;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_BOTTOM = 130;
const BRICK_W = canvas.width/10;
const BRICK_H = canvas.height/30;
let BRICK_COLS = 10;
const BRICK_ROWS = 14;
let key_held_Left = false;
let key_held_Right = false;
let paddleX = canvas.width / 2;
let brickGrid = new Array (BRICK_COLS*BRICK_ROWS);
let bricksLeft = 0;

setInterval(updateAll, 100/framesPerSecond);
canvas.addEventListener("mousemove", updateMousePosition);
brickReset();
ballReset();
updateScore();

function isBrickAtRowCol(col, row){
  if (col >= 0 && col < BRICK_COLS && row >= 0 && row < BRICK_ROWS){
    let brickIndexUnderCoord = rowColToRowIndex(col, row);
    return brickGrid[brickIndexUnderCoord];
  } else {
    return false;
  }
}
function updateAll(){
  moveAll();
  drawAll();
}
function ballMove(){
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if ((ballX < 0 && ballSpeedX < 0.0) || (ballX > canvas.width && ballSpeedX > 0.0)){
    ballSpeedX *= -1;
  }
  if (ballY < 0 || ballY > canvas.height){
    if (ballY > canvas.height){
      playerLives--;
      updateScore();
      ballReset();
      if (playerLives == 0){
          let details = document.getElementById("_details");
          details.innerHTML += "<span>GAME OVER</span>";
          wrapper.innerHTML += "<button id='_reset'>PLAY</button>";
          let reset = document.querySelector("#_reset");
          let buttonWidth = reset.width;
          let buttonHeight = reset.style.height;
          reset.style.left = (canvas.width/2 - reset.offsetWidth/2)+"px";
          reset.style.top = (window.innerHeight/2 - reset.offsetHeight/2)+"px";
          ballSpeedX = 0;
          ballSpeedY = 0;
      }
    }
    else {
      ballSpeedY *= -1;
    }
  }
}
document.addEventListener("click", function(e){
  if (e.target && e.target.id == "_reset"){
    e.target.style.display = "none";
    playerLives = 3;
    playerScore = 0;
    updateScore();
    brickReset();
    ballReset();
  }
})
function updateScore(){
  let details = document.getElementById("_details");
  details.innerHTML = "SCORE: " + playerScore + " LIVES: " + playerLives;
}
function ballBrickHandling(){
  let ballBrickCol = Math.floor(ballX / BRICK_W);
  let ballBrickRow = Math.floor(ballY / BRICK_H);
  let brickIndexUnderBall = rowColToRowIndex(ballBrickCol, ballBrickRow);

  if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS){
    if(isBrickAtRowCol(ballBrickCol, ballBrickRow)){
      brickGrid[brickIndexUnderBall] = false;
      bricksLeft--;
      if (ballBrickRow == 3){
        playerScore+=20;
      }
      if (ballBrickRow > 3 && ballBrickRow <= 6){
        playerScore+=15;
      }
      if (ballBrickRow > 6 && ballBrickRow <= 9){
        playerScore+=10;
      }
      if (ballBrickRow > 9){
        playerScore+=5;
      }
      updateScore();
      let prevBallX = ballX - ballSpeedX;
      let prevBallY = ballY - ballSpeedY;
      let prevBrickCol = Math.floor(prevBallX/BRICK_W);
      let prevBrickRow = Math.floor(prevBallY/BRICK_H);
      let bothTestsFailed = true;
      if (prevBrickCol != ballBrickCol){
        if (isBrickAtRowCol(prevBrickCol, ballBrickRow) == false){
          ballSpeedX *= -1;
          bothTestsFailed = false;
        }
      }
      if (prevBrickRow != ballBrickRow){
        if (isBrickAtRowCol(ballBrickCol, prevBrickRow) == false){
          ballSpeedY *= -1;
          bothTestsFailed = false;
        }
      }
      if (bothTestsFailed){
        ballSpeedX *= -1;
        ballSpeedY *= -1;
      }
    }
  }
}
function ballPaddleHandling(){
  let paddleTopEdgeY = canvas.height-PADDLE_DIST_BOTTOM;
  let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
  let paddleLeftEdgeX = paddleX;
  let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
  if (ballY > paddleTopEdgeY && ballY < paddleBottomEdgeY && ballX > paddleLeftEdgeX && ballX < paddleRightEdgeX){
    ballSpeedY *= -1;

    let centreOfPaddleX = paddleX + PADDLE_WIDTH/2;
    let ballDistFromCentrePaddleX = ballX - centreOfPaddleX;
    ballSpeedX = ballDistFromCentrePaddleX *0.15;
    if (bricksLeft == 0){
      playerLives++;
      ballReset();
      brickReset();
    }
  }
}
function moveAll(){
  ballMove();
  ballBrickHandling();
  ballPaddleHandling();
}
function drawAll(){
  //draw canvas
  colourRect(0,0, canvas.width,canvas.height, "black");
  //draw ball
  colourCircle(ballX, ballY, 10, "white");
  //draw paddle
  colourRect(paddleX, canvas.height-PADDLE_DIST_BOTTOM, PADDLE_WIDTH, PADDLE_THICKNESS, "white");
  //draw bricks
  drawBricks();
}
function colourRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColour){
  context.fillStyle = fillColour;
  context.fillRect(topLeftX,topLeftY, boxWidth, boxHeight);
}
function colourCircle(centreX, centreY, radius, fillColour){
  context.fillStyle ="white";
  context.beginPath();
  context.arc(centreX,centreY, radius, 0, Math.PI*2, true);
  context.fill();
}
function updateMousePosition (e){
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = e.clientX - rect.left - root.scrollLeft;
  paddleX = mouseX - PADDLE_WIDTH/2;
}
function ballReset(){
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}
function drawBricks(){
  for (let brickRow = 0; brickRow < BRICK_ROWS; brickRow++){
    for (let brickCol=0; brickCol <BRICK_COLS; brickCol++){
      let brickArrayIndex = rowColToRowIndex(brickCol, brickRow);
      if (brickGrid[brickArrayIndex]){
        colourRect(BRICK_W*brickCol,BRICK_H*brickRow, BRICK_W-2, BRICK_H-2, "purple");
       if (brickRow > 3){
        colourRect(BRICK_W*brickCol,BRICK_H*brickRow, BRICK_W-2, BRICK_H-2, "red");
       }
       if (brickRow > 6){
        colourRect(BRICK_W*brickCol,BRICK_H*brickRow, BRICK_W-2, BRICK_H-2, "orange");
       }
       if (brickRow > 9){
        colourRect(BRICK_W*brickCol,BRICK_H*brickRow, BRICK_W-2, BRICK_H-2, "yellow");
       }
      }
    }
  }
}
function brickReset(){
  bricksLeft = 0;
  let i;
  for (i=0; i < 3*BRICK_COLS; i++){
    brickGrid[i] = false;
  }
  for (; i < BRICK_COLS*BRICK_ROWS; i++){
    brickGrid[i] = true;
    bricksLeft++;
  }
}
function rowColToRowIndex(col, row){
  return col + BRICK_COLS * row
}
function ballReset(){
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  ballSpeedX = 1;
  ballSpeedY = 1.5;
}

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

document.addEventListener("mousedown", function(e) {
  if (e.target && e.target.id == "leftArrow"){
    console.log("LEFT");
    LEFT = true;
  }
  if (e.target && e.target.id == "rightArrow"){
    console.log("RIGHT");
    RIGHT = true
    //update();
  }
})
document.addEventListener("mouseup", function(e) {
  if (e.target && e.target.id == "leftArrow"){
    LEFT = false;
  }
  if (e.target && e.target.id == "rightArrow"){
    RIGHT = false;
    //update();
  }
})
document.addEventListener("touchstart", function(e) {
  if (e.target && e.target.id == "leftArrow"){
    console.log("LEFT");
    LEFT = true;
  }
  if (e.target && e.target.id == "rightArrow"){
    console.log("RIGHT");
    RIGHT = true
    //update();
  }
})
document.addEventListener("touchend", function(e) {
  if (e.target && e.target.id == "leftArrow"){
    LEFT = false;
  }
  if (e.target && e.target.id == "rightArrow"){
    RIGHT = false;
    //update();
  }
})
let RIGHT = false;
let LEFT = false
let velX=0;
let speed=10;
let friction = 0.98;
let keys = [];
function update() {
    requestAnimationFrame(update);
    if ((keys[39]) || (RIGHT)) {
        if (velX < speed) {
            velX++;
        }
    }
    if ((keys[37])  || (LEFT)){
        if (velX > -speed) {
            velX--;
        }
    }

    velX *= friction;
    paddleX += velX;

    if (paddleX >= canvas.width - PADDLE_WIDTH ) {
        paddleX = canvas.width - PADDLE_WIDTH;
    } else if (paddleX <= 0) {
        paddleX = 0;
    }

}
update();
