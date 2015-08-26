var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) {window.setTimeout(callback, 1000/60)};

// --Variable for defining game--

var canvas = document.getElementById('game');
var width = 900;
var height = 700;
var context = canvas.getContext('2d');

var player = new Player();
var computer = new Computer();
var ball = new Ball(450, 350);


canvas.width = width;
canvas.height = height;

window.onload = function() {
  animate(step);
};

var playerScore = 0;
var computerScore = 0;

var step = function() {
  update();
  render();
  animate(step);
};

//Creates viewable playing field
var render = function() {
  context.fillStyle = "rgba(46, 204, 113,0.4)";
  context.fillRect(0, 0, width, height);

  context.beginPath();
  context.moveTo(0,350);
  context.lineTo(900,350);
  context.stroke();

  player.render();
  computer.render();
  ball.render();

  scoreDisplay();
};

var update = function() {
  player.update(ball);
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};


//Resets paddle when either computer or player scores a point
function resetPlayerPaddle() {
  player.paddle.x = 375;
}


function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

function Player() {
  this.paddle = new Paddle(375, 680, 150, 10);
}

function Computer() {
  this.paddle = new Paddle(375, 10, 150, 10);
};


function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = 3;
  this.radius = 5;
};

//Displays and updates scores as the ball passes a certain Y plane
function scoreDisplay() {
  context.font = "bold 14px Arial";
  console.log("Computer: " + computerScore + " Player: " + playerScore);
  context.font="20px Georgia";
  context.fillText("Computer: " + computerScore, 10, 340);
  context.fillText("Player: " + playerScore, 810, 375);
};


Paddle.prototype.render = function() {
  context.fillStyle = "rgba(231, 76, 60,1.0)";
  context.fillRect(this.x, this.y, this.width, this.height);
};

Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2*Math.PI, false);
  context.fillStyle = "rgba(142, 68, 173,1.0)";
  context.fill();
};

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - 5;
  var top_y = this.y - 5;
  var bottom_x = this.x + 5;
  var bottom_y = this.y + 5;

  if (ball.y >= 700) {
    computerScore += 1;
    resetPlayerPaddle();
  }
  else if (ball.y <= 0) {
    playerScore += 1;
    resetPlayerPaddle();
  }

  if(this.x - 5 < 0) {
    this.x = 5;
    this.x_speed = -this.x_speed;
  } else if (this.x + 5 > 900) {
    this.x = 895;
    this.x_speed = -this.x_speed;
  }

//If ball goes outside of the boundaries of the canvas, this resets it to the middle and gives it an initial speed
  if(this.y < 0 || this.y > 700) {
    this.x_speed = 0;
    this.y_speed = 10;
    this.x = 450;
    this.y = 350;
  }

//Collision
   if(top_y > 400) {
    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
      this.y_speed = -8;
      this.x_speed += (paddle1.x_speed / 4);
      this.y += this.y_speed;
    }
  } else {
    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      this.y_speed = 8;
      this.x_speed += (paddle2.x_speed / 4);
      this.y += this.y_speed;
    }
  }
};

var keysDown = {};

window.addEventListener('keydown', function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener('keyup', function(event) {
  delete keysDown[event.keyCode];
});

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // left arrow
      this.paddle.move(-8, 0);
    } else if (value == 39) { // right arrow
      this.paddle.move(8, 0);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) { // all the way to the left
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > 900) { // all the way to the right
    this.x = 900 - this.width;
    this.x_speed = 0;
  }
};

// Speed of computer paddle left and right
Computer.prototype.update = function(ball) {
  var x_pos = ball.x;
  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos); //Keeps center of paddle tracking ball
  if(diff < 0 && diff < -8) { //Speed right
    diff = -8;
  } else if(diff > 0 && diff > 8) { //Speed left
    diff = 8;
  }

  this.paddle.move(diff, 0);
  if(this.paddle.x < 0) {
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.width > 900) {
    this.paddle.x = 900 - this.paddle.width;
  }
};
