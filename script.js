const startPage = document.getElementById("start-page");
const gamePage = document.getElementById("game-page");
const startButton = document.getElementById("start-button");
const textDisplay = document.getElementById("text-display");
const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const option3 = document.getElementById("option3");
const option4 = document.getElementById("option4");

// Game state tracker
let gameState = 0;
let previousGameState = null;
let nameKnown = false;
const inventory = [];
let isTyping = false; // Flag to prevent interaction during typing

const spaceAmbientSound = new Audio(
  "sounds/spaceship-ambience-with-effects-21420.mp3"
);
const typingSound = new Audio("sounds/keyboard-typing-5997.mp3");
typingSound.volume = 0.2; // Adjust volume if needed

function startAmbience() {
  spaceAmbientSound.loop = true; // Make the music loop
  spaceAmbientSound.volume = 0.6; // Adjust volume if needed
  spaceAmbientSound.play().catch((error) => {
    console.log("Failed to play music:", error);
  });
}

function startGame() {
  startPage.style.display = "none";
  gamePage.style.display = "block"; // Show the game page
  startAmbience();
  chooseOption(1); // Start the game by choosing the first option
}

function typeText(sentences, delays, callback) {
  if (isTyping) return; // Prevent typing if already typing
  isTyping = true; // Set flag to true

  let index = 0;

  function typeSentence() {
    if (index < sentences.length) {
      const sentence = sentences[index];
      textDisplay.textContent = ""; // Clear previous text

      let charIndex = 0;
      function typing() {
        if (charIndex < sentence.length) {
          textDisplay.textContent += sentence.charAt(charIndex);
          charIndex++;
          typingSound.play();
          setTimeout(typing, 70); // Adjust typing speed here
        } else {
          index++;
          const delay = delays[index - 1] || 1000; // Use delay from array or default
          typingSound.pause();
          typingSound.currentTime = 0; // Reset the playback position to the start
          setTimeout(typeSentence, delay);
        }
      }
      typing();
    } else {
      isTyping = false; // Reset flag when typing is done
      if (callback) callback();
    }
  }
  typeSentence();
}

function chooseOption(option) {
  if (isTyping) return; // Prevent choice if typing is in progress

  // Handle replay button logic
  if (option === 4) {
    if (previousGameState !== null) {
      gameState = previousGameState; // Restore previous state
      previousGameState = null; // Clear previous game state after restoring
      updateOptions(); // Ensure options are updated for the restored state
      chooseOption(1); // Replay the text associated with the restored state
      return; // Exit function to avoid further processing
    }
  } else {
    // Save the current state before changing it
    previousGameState = gameState;
  }

  switch (gameState) {
    case 0:
      disableButtons(); // Ensure buttons are disabled
      if (option === 1) {
        typeText(
          [
            "",
            "14th May 1982",
            "You are Andrei Berezkinov, a Soviet cosmonaut. \n\nAlong with your crewmate, Valente Lebedevsky, you are the first team to man the Soviet space station...",
            "SALYUT-7",
          ],
          [2500, 2000, 2500],
          () => {
            gameState = 1;
            updateOptions();
            enableButtons(); // Re-enable buttons after text is done
          }
        );
      } else if (option === 2) {
        typeText("is there anyone there?      Can you hear me?", () => {
          gameState = 1;
          updateOptions();
          enableButtons(); // Re-enable buttons after text is done
        });
      } else if (option === 3) {
        typeText("11111111111111111111111111?", () => {
          gameState = 1;
          nameKnown = true;
          updateOptions();
          enableButtons(); // Re-enable buttons after text is done
        });
      }
      break;

    case 1:
      disableButtons(); // Ensure buttons are disabled
      if (option === 1) {
        typeText(
          ["hello", "how are you?", "I am jolly", "good day!"],
          [1000, 2000, 3000],
          () => {
            gameState = 2; // Move to the next state
            updateOptions();
            enableButtons(); // Re-enable buttons after text is done
          }
        );
      } else if (option === 2) {
        typeText("wha r u gae?", () => {
          enableButtons(); // Re-enable buttons after text is done
        });
      } else {
        typeText("2222222222222", () => {
          nameKnown = true;
          enableButtons(); // Re-enable buttons after text is done
        });
      }
      break;

    case 2:
      disableButtons(); // Ensure buttons are disabled
      if (option === 1) {
        typeText("You find a treasure chest!", () => {
          gameState = 3; // Move to another state
          updateOptions();
          enableButtons(); // Re-enable buttons after text is done
        });
      } else if (option === 2) {
        typeText("You encounter a strange figure.", () => {
          gameState = 3; // Move to another state
          updateOptions();
          enableButtons(); // Re-enable buttons after text is done
        });
      } else {
        typeText("You hear a growling sound from the shadows.", () => {
          gameState = 3; // Move to another state
          updateOptions();
          enableButtons(); // Re-enable buttons after text is done
        });
      }
      break;

    // Add more game states as needed
  }
}

function updateOptions() {
  switch (gameState) {
    case 1:
      option1.innerText = "Open the chest";
      option2.innerText = "Talk to the figure";
      option3.innerText = "Run away";
      break;

    case 2:
      option1.innerText = "Inspect the treasure";
      option2.innerText = "Attack the figure";
      option3.innerText = "Hide in the shadows";
      break;

    // Add more updates as the game progresses
  }
}

function disableButtons() {
  option1.classList.add("disabled");
  option2.classList.add("disabled");
  option3.classList.add("disabled");
  option4.classList.add("disabled"); // Ensure replay button is also disabled
}

function enableButtons() {
  option1.classList.remove("disabled");
  option2.classList.remove("disabled");
  option3.classList.remove("disabled");
  option4.classList.remove("disabled"); // Ensure replay button is enabled
}

startButton.addEventListener("click", startGame);
