// Define constants and initial variables
const DEGREE_LIMIT = 10; // Range of 10 degrees for the restricted area
const CLOCKWISE_SEQUENCE = ["D", "S", "A", "W"];
const COUNTER_CLOCKWISE_SEQUENCE = ["W", "A", "S", "D"];

let greenNeedle = document.querySelector(".green-needle");
let redNeedle = document.querySelector(".red-needle");
let greenNeedlePosition = 0; // Start at 90 degrees (center)
let redNeedlePosition = getRandomPosition(); // Initial random target position
let lastKey = ""; // Track the last key pressed
let moveSpeed = 5000;
let gamesWon = 0;

function updateMoveSpeed() {
  if (gamesWon === 0) {
    moveSpeed = 5000;
  } else if (gamesWon === 1) {
    moveSpeed = 4000;
  } else if (gamesWon >= 2) {
    moveSpeed = 3250;
  }
}

function moveNeedle(key) {
  const lastClockwiseIndex = CLOCKWISE_SEQUENCE.indexOf(lastKey);
  const lastCounterClockwiseIndex = COUNTER_CLOCKWISE_SEQUENCE.indexOf(lastKey);

  // Move needle clockwise if the correct sequence is followed
  if (
    lastClockwiseIndex !== -1 &&
    key === CLOCKWISE_SEQUENCE[(lastClockwiseIndex + 1) % 4]
  ) {
    greenNeedlePosition++;
    lastKey = key;
  }
  // Move needle counterclockwise if the correct sequence is followed
  else if (
    lastCounterClockwiseIndex !== -1 &&
    key === COUNTER_CLOCKWISE_SEQUENCE[(lastCounterClockwiseIndex + 1) % 4]
  ) {
    greenNeedlePosition--;
    lastKey = key;
  }
  // Start a new sequence if a valid key is pressed
  else if (
    key === CLOCKWISE_SEQUENCE[0] ||
    key === COUNTER_CLOCKWISE_SEQUENCE[0]
  ) {
    lastKey = key;
  } else {
    lastKey = ""; // Reset completely if an invalid key is pressed
  }

  updateGauge();
  checkWinCondition();
}

function updateGauge() {
  greenNeedle.style.transform = `rotate(${greenNeedlePosition}deg)`;
  redNeedle.style.transform = `rotate(${redNeedlePosition}deg)`;
}

function getRandomPosition() {
  let newPosition;
  do {
    newPosition = Math.floor(Math.random() * 120); // Random angle between 0 and 180 degrees
  } while (isWithinRestrictedRange(newPosition));
  return newPosition;
}

function isWithinRestrictedRange(position) {
  // Check if the position is within 10 degrees of the green needle
  return Math.abs(position - greenNeedlePosition) <= DEGREE_LIMIT;
}

let intervalId = null; // Initialize intervalId to null

function startGame() {
  if (intervalId !== null) {
    clearInterval(intervalId); // Clear any previous interval if it exists
  }

  intervalId = setInterval(() => {
    redNeedlePosition = getRandomPosition();
    updateGauge();
  }, moveSpeed);
}

function checkWinCondition() {
  if (greenNeedlePosition === redNeedlePosition) {
    alert("Calibration successful! You win!");
    resetGame();
  }
}

function resetGame() {
  greenNeedlePosition = 0; // Reset to center
  redNeedlePosition = getRandomPosition();
  lastKey = ""; // Reset key sequence
  gamesWon++; // Increment the games won
  updateMoveSpeed(); // Update the move speed based on games won
  startGame(); // Restart the game with the new move speed
  updateGauge();
}

// Listen for keydown events
document.addEventListener("keydown", (e) => {
  moveNeedle(e.key.toUpperCase());
});

// Initialize the game
startGame();
