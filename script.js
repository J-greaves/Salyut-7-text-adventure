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
let typingSpeed = 10;
let previousGameState = null;
let nameKnown = false;
const inventory = [];
let isTyping = false; // Flag to prevent interaction during typing

const spaceAmbientSound = new Audio(
  "sounds/spaceship-ambience-with-effects-21420.mp3"
);
const typingSound = new Audio("sounds/keyboard-typing-5997.mp3");
typingSound.volume = 0.4; // Adjust volume if needed
const ominousTitle = new Audio("sounds/ominousTitle.mp3");
ominousTitle.volume = 0.6;
const ominousTitleTrail = new Audio("sounds/ominousTitleTrail.mp3");
ominousTitleTrail.volume = 0.4;

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

      // Ensure we're working with the span inside the text-display
      let textElement = textDisplay.querySelector("span");
      if (!textElement) {
        textElement = document.createElement("span"); // Create a span element
        textDisplay.appendChild(textElement); // Append the span to the text box
      }

      textElement.textContent = ""; // Clear previous text

      let charIndex = 0;
      function typing() {
        if (charIndex < sentence.length) {
          textElement.textContent += sentence.charAt(charIndex);
          charIndex++;
          typingSound.play();
          setTimeout(typing, typingSpeed); // Adjust typing speed here
        } else {
          index++;
          const delay = delays[index - 1] || 1000; // Use delay from array or default
          typingSound.pause();
          typingSound.currentTime = 0; // Reset the playback position to the start

          if (sentence === "SALYUT-7") {
            ominousTitle.play();
            setTimeout(() => {
              ominousTitleTrail.play();
            }, 2500);
            setTimeout(() => {
              ominousTitleTrail.volume = 2.5;
              ominousTitleTrail.play();
            }, 5000);
            // Add a delay before starting the fade-out effect
            setTimeout(() => {
              // Apply fade-out effect if the sentence is "SALYUT-7"
              textElement.classList.add("fade-out-text");

              setTimeout(() => {
                textElement.textContent = ""; // Clear the text after fade-out
                textElement.classList.remove("fade-out-text"); // Remove fade-out class
                setTimeout(typeSentence, delay); // Proceed with the next sentence
              }, 7000); // Duration for fade-out effect
            }, 5000); // Delay before starting the fade-out effect
          } else {
            setTimeout(typeSentence, delay);
          }
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
            "You are Andrei Berezkinov, a Soviet cosmonaut. \n\nAlong with your crewmate, Valente Lebedevsky, you are part of the first team to man the Soviet space station...",
          ],
          [2500, 2000, 3000],
          () => {
            typingSound.pause();
            typingSpeed = 0;
            setFontSize(60);
            typeText(["", "SALYUT-7"], [2000, 1000], () => {
              setFontSize(20);
              typingSpeed = 10;
              typeText(
                [
                  "Your mission is to activate this new space station, conduct various biological studies, and use the station's instruments to observe astronomical phenomena.",
                  "Having docked with SALYUT-7 three days ago, on 13th May 1982, you and Lebedevsky have just finished bringing the station fully online, initializing its life support systems, communications, power systems, and scientific equipment.",
                  "You are now required to conduct a comprehensive series of inspections and checks to ensure that all systems are functioning correctly and that the station is ready for long-term habitation and operations.",
                  "Are you up to the job?",
                ],
                [3000, 3000, 3000, 2500],
                () => {
                  gameState = 1;
                  updateOptions();
                  enable2();
                  //enableButtons(); // Re-enable buttons after text is done
                }
              );
            });
          }
        );
      }
      break;

    case 1:
      disableButtons(); // Ensure buttons are disabled
      if (option === 2) {
        changeBackground("images/inside.png");
        typingSpeed = 50; // Set a reasonable typing speed
        typeText(["wha r u gae?"], [0], () => {
          gameState = 2;
          updateOptions();
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
      option1.innerText = "";
      option2.innerText = "Commencing Full Inspection";
      option3.innerText = "";
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

function enable2() {
  option2.classList.remove("disabled");
  option4.classList.remove("disabled");
}

function enableButtons() {
  option1.classList.remove("disabled");
  option2.classList.remove("disabled");
  option3.classList.remove("disabled");
  option4.classList.remove("disabled"); // Ensure replay button is enabled
}

function setFontSize(size) {
  // Ensure the span exists inside the textDisplay
  let textElement = textDisplay.querySelector("span");
  if (textElement) {
    textElement.style.fontSize = size + "px";
  }
}

function changeBackground(imageUrl) {
  document.body.style.backgroundImage = `url('${imageUrl}')`;
}

startButton.addEventListener("click", startGame);
