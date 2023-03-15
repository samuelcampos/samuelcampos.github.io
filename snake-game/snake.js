// Define the canvas and its context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

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

// Define the function to update the game state
function update() {
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
    alert("Game Over!");
    location.reload();
  }
  for (var i = 0; i < snake.cells.length; i++) {
    if (snake.cells[i].x === snake.x && snake.cells[i].y === snake.y) {
      alert("Game Over!");
      location.reload();
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

// Define the function to handle key presses
function handleKeyDown(e) {
  switch (e.keyCode) {
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
}

// Set up the initial game state
food.x = Math.floor(Math.random() * canvas.width / cellSize);
food.y = Math.floor(Math.random() * canvas.height / cellSize);
snake.x = Math.floor(canvas.width / cellSize / 2);
snake.y = Math.floor(canvas.height / cellSize / 2);
for (var i = 0; i < snake.length; i++) {
    snake.cells.push({ x: snake.x - i, y: snake.y });
}

// Add the event listener for key presses
document.addEventListener("keydown", handleKeyDown);

// Define the main game loop
function loop() {
    update();
    draw();
    setTimeout(loop, 100);
}

// Start the game loop
loop();
