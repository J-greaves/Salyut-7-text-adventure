const startPage = document.getElementById("start-page");
const gamePage = document.getElementById("game-page");
const startButton = document.getElementById("start-button");
const textDisplay = document.getElementById("text-display");
const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const option3 = document.getElementById("option3");
const option4 = document.getElementById("option4");

// Game state tracker

let gameScript = {};
let gameState = 0;
let typingSpeed = 10;
let previousGameState = 0;
let lastOptionPicked = 0;
let nameKnown = false;
const inventory = [];
let isTyping = false; // Flag to prevent interaction during typing

const spaceAmbientSound = new Audio(
  "sounds/spaceship-ambience-with-effects-21420.mp3"
);
const typingSound = new Audio("sounds/keyboard-typing-5997.mp3");
typingSound.volume = 0.25;
const ominousTitle = new Audio("sounds/ominousTitle.mp3");
ominousTitle.volume = 0.4;
const ominousTitleTrail = new Audio("sounds/ominousTitleTrail.mp3");
ominousTitleTrail.volume = 0.2;
const ominousTitleTrail2 = new Audio(
  "sounds/the-appearance-of-a-mysterious-creature-143028.mp3"
);
ominousTitleTrail2.volume = 0.05;

function startAmbience() {
  spaceAmbientSound.loop = true;
  spaceAmbientSound.volume = 0.75;
  spaceAmbientSound.play();
}

fetch("dialogue.json")
  .then((response) => response.json())
  .then((data) => {
    gameScript = data;
  })
  .catch((err) => {
    console.log(err);
  });

function startGame() {
  startPage.style.display = "none";
  gamePage.style.display = "block"; // Show the game page
  startAmbience();
  chooseOption(2); // Start the game by choosing the first option
}

function typeText(sentences, delays) {
  return new Promise((resolve, reject) => {
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

        textElement.innerHTML = ""; // Clear previous text (use innerHTML now)

        let charIndex = 0;

        function typing() {
          if (charIndex < sentence.length) {
            // Add HTML progressively while avoiding breaking HTML tags
            // Use substr to gradually build the full string but keep existing innerHTML intact
            const htmlSubstring = sentence.slice(0, charIndex + 1);
            textElement.innerHTML = htmlSubstring; // Apply innerHTML to allow spans

            charIndex++;
            typingSound.play();
            setTimeout(typing, typingSpeed); // Adjust typing speed here
          } else {
            index++;
            const delay = delays[index - 1] || 1000; // Use delay from array or default
            typingSound.pause();
            typingSound.currentTime = 0; // Reset the playback position to the start

            if (sentence === "SALYUT-7") {
              setFontSize(60);
              typingSound.pause();
              typingSpeed = 0;
              ominousTitle.play();
              setTimeout(() => {
                ominousTitleTrail.play();
              }, 2750);
              setTimeout(() => {
                ominousTitleTrail2.play();
              }, 5500);
              // Add a delay before starting the fade-out effect
              setTimeout(() => {
                // Apply fade-out effect if the sentence is "SALYUT-7"
                textElement.classList.add("fade-out-text");

                setTimeout(() => {
                  textElement.innerHTML = ""; // Clear the text after fade-out
                  textElement.classList.remove("fade-out-text"); // Remove fade-out class
                  setFontSize(20);
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
        resolve(); // Resolve the promise when typing is done
      }
    }
    typeSentence();
  });
}

function chooseOption(option) {
  if (isTyping) return; // Prevent choice if typing is in progress

  if (gameState > 0) {
    changeBackground("images/inside.png");
  }

  // Handle replay button logic
  if (option === 4) {
    if (previousGameState !== null) {
      gameState = previousGameState; // Restore previous state
      previousGameState = null; // Clear previous game state after restoring
      updateOptions(); // Ensure options are updated for the restored state
      chooseOption(lastOptionPicked); // Replay the text associated with the restored state
      return; // Exit function to avoid further processing
    }
  } else {
    previousGameState = gameState;
  }

  const currentScript = gameScript[gameState][option];
  disableButtons();
  lastOptionPicked = option;
  typeText(currentScript.text, currentScript.timings)
    .then(() => {
      updateOptions(option);
      enableButtons();
    })
    .catch((err) => {
      console.log(err);
    });
}

function updateOptions(option) {
  const currentOptions = gameScript[gameState][option];

  if (currentOptions) {
    option1.innerText = currentOptions.options.option1.buttonText;
    option2.innerText = currentOptions.options.option2.buttonText;
    option3.innerText = currentOptions.options.option3.buttonText;
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

function setFontSize(size) {
  // Ensure the span exists inside the textDisplay
  let textElement = textDisplay.querySelector("span");
  if (textElement) {
    textElement.style.fontSize = size + "px";
  }
}

function changeBackground(imageUrl) {
  document.body.style.backgroundImage = `url('${imageUrl}')`;
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center center";
  document.body.style.backgroundAttachment = "fixed";
  document.body.style.backgroundSize = "auto"; // Set specific size
}

function handleClick(option) {
  gameState =
    gameScript[gameState][lastOptionPicked].options[`option${option}`]
      .nextState;
  console.log(gameState, previousGameState, lastOptionPicked);
  chooseOption(option);
}

startButton.addEventListener("click", startGame);
