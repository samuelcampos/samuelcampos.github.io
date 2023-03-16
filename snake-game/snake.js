// Set the block size based on the screen size
var BLOCK_SIZE = Math.min(
    Math.floor(window.innerWidth * 0.8 / 20),
    Math.floor(window.innerHeight * 0.8 / 20)
);

/*
The number 20 is used as an arbitrary default value for the block size in case the calculation based on the screen size fails for some reason. This can happen if window.innerWidth or window.innerHeight is very small, which would result in a very small BLOCK_SIZE value. In that case, setting the BLOCK_SIZE to 20 ensures that the game will still be playable, albeit on a smaller canvas.
In practice, you can adjust this value as needed to achieve the desired block size for your game. The value of 20 was chosen as a reasonable default, but you can experiment with different values to see what works best for your game.
*/
  
// Calculate the number of columns and rows based on the block size
var COLS = Math.floor(window.innerWidth * 0.8 / BLOCK_SIZE);
var ROWS = Math.floor(window.innerHeight * 0.65 / BLOCK_SIZE);

console.log(BLOCK_SIZE, COLS, ROWS)

// Define the canvas and its context
const canvas = document.getElementById("game-canvas");
// Set the size of the canvas based on the size of the game grid
canvas.width = Math.min(COLS * BLOCK_SIZE, 900);
canvas.height = Math.min(ROWS * BLOCK_SIZE, 700)


const ctx = canvas.getContext("2d");

let inRunning = true;

// Define the width and height of each cell in the grid
var cellSize = 10;

// Define the initial position and length of the snake
var snake = {
  x: 0,
  y: 0,
  length: 5,
  direction: "right",
  cells: [],
};

// Define the initial position of the food
var food = {
  x: 0,
  y: 0,
};

// Define the function to draw a cell on the canvas
function drawCell(x, y) {
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.querySelector(".modal-overlay");
const modalCloseBtn = document.getElementById("modal-close-btn");

// Show the modal
function showModal() {
  modalContainer.style.display = "block";
  inRunning = false;
}

// Hide the modal
function hideModal() {
    location.reload();
  modalContainer.style.display = "none";
}


// Hide the modal when the overlay or close button is clicked
modalOverlay.addEventListener("click", hideModal);
modalCloseBtn.addEventListener("click", hideModal);

// Define the function to update the game state
function update() {
    if(!inRunning) {
        return;
    }

  // Move the snake in its current direction
  switch (snake.direction) {
    case "up":
      snake.y--;
      break;
    case "down":
      snake.y++;
      break;
    case "left":
      snake.x--;
      break;
    case "right":
      snake.x++;
      break;
  }

  // Check if the snake has collided with a wall or with itself
  if (snake.x < 0 || snake.x >= canvas.width / cellSize || snake.y < 0 || snake.y >= canvas.height / cellSize) {
    showModal();
    
  }
  for (var i = 0; i < snake.cells.length; i++) {
    if (snake.cells[i].x === snake.x && snake.cells[i].y === snake.y) {
        showModal();   
    }
  }

  // Check if the snake has eaten the food
  if (snake.x === food.x && snake.y === food.y) {
    snake.length++;
    food.x = Math.floor(Math.random() * canvas.width / cellSize);
    food.y = Math.floor(Math.random() * canvas.height / cellSize);
  }

  // Update the cells of the snake
  snake.cells.push({ x: snake.x, y: snake.y });
  while (snake.cells.length > snake.length) {
    snake.cells.shift();
  }
}

// Define the function to draw the game state
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  ctx.fillStyle = "green";
  for (var i = 0; i < snake.cells.length; i++) {
    drawCell(snake.cells[i].x, snake.cells[i].y);
  }

  // Draw the food
  ctx.fillStyle = "red";
  drawCell(food.x, food.y);
}

// Define the function to handle key presses and touch events
/*function handleInput(input) {
    if (input.keyCode >= 37 && input.keyCode <= 40) {
      // Handle key presses
      switch (input.keyCode) {
        case 38: // Up arrow
          snake.direction = "up";
          break;
        case 40: // Down arrow
          snake.direction = "down";
          break;
        case 37: // Left arrow
          snake.direction = "left";
          break;
        case 39: // Right arrow
          snake.direction = "right";
          break;
      }
    } else if (input.type === "touchstart") {
      // Handle touch events
      startX = input.touches[0].pageX;
      startY = input.touches[0].pageY;
    } else if (input.type === "touchmove") {
        // Handle touch events
        var endX = input.touches[0].pageX;
        var endY = input.touches[0].pageY;
        var dx = endX - startX;
        var dy = endY - startY;
        var absDx = Math.abs(dx);
        var absDy = Math.abs(dy);
        
        if (absDx > absDy && absDx > 10) {
            snake.direction = dx > 0 ? "right" : "left";
        } else if (absDy > absDx && absDy > 10) {
            snake.direction = dy > 0 ? "down" : "up";
        }
    }
}*/

const ENTER_KEY = 13;
const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;


function handleInput(event) {
  if (event.type === "keydown") {
    if (event.keyCode === LEFT_KEY && snake.direction !== "right") {
        snake.direction = "left";
    } else if (event.keyCode === UP_KEY && snake.direction !== "down") {
        snake.direction = "up";
    } else if (event.keyCode === RIGHT_KEY && snake.direction !== "left") {
        snake.direction = "right";
    } else if (event.keyCode === DOWN_KEY && snake.direction !== "up") {
        snake.direction = "down";
    } else if (event.keyCode === ENTER_KEY && !inRunning) {
        hideModal();
    }
  }
  /*else if (event.type === "touchstart") {
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
  } else if (event.type === "touchmove") {
    endX = event.touches[0].pageX;
    endY = event.touches[0].pageY;

    var diffX = startX - endX;
    var diffY = startY - endY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // horizontal swipe
      if (diffX > 0 && snake.direction !== "right") {
        snake.direction = "left";
      } else if (diffX < 0 && snake.direction !== "left") {
        snake.direction = "right";
      }
    } else {
      // vertical swipe
      if (diffY > 0 && snake.direction !== "down") {
        snake.direction = "up";
      } else if (diffY < 0 && snake.direction !== "up") {
        snake.direction = "down";
      }
    }
  }
  */
}

// Set up the initial game state
food.x = Math.floor(Math.random() * canvas.width / cellSize);
food.y = Math.floor(Math.random() * canvas.height / cellSize);
snake.x = Math.floor(canvas.width / cellSize / 2);
snake.y = Math.floor(canvas.height / cellSize / 2);
for (var i = 0; i < snake.length; i++) {
    snake.cells.push({ x: snake.x - i, y: snake.y });
}

// Add the event listeners for key presses and touch events
document.addEventListener("keydown", handleInput);
/*
document.addEventListener("touchstart", handleInput);
document.addEventListener("touchmove", handleInput);
*/
document.getElementById("up-button").addEventListener("click", function() {
    if (snake.direction !== "down") {
        snake.direction = "up";
    }
  });
  document.getElementById("left-button").addEventListener("click", function() {
    if (snake.direction !== "right") {
        snake.direction = "left";
    }
  });
  document.getElementById("down-button").addEventListener("click", function() {
    if (snake.direction !== "up") {
        snake.direction = "down";
    }
  });
  document.getElementById("right-button").addEventListener("click", function() {
    if (snake.direction !== "left") {
        snake.direction = "right";
    }
  });

// Define the main game loop
function loop() {
    update();
    draw();
    setTimeout(loop, 100);
}

// Start the game loop
loop();
