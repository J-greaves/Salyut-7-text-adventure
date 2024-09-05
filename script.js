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
let lastOptionPicked = 0;
let nameKnown = false;
const inventory = [];
let isTyping = false; // Flag to prevent interaction during typing

//dialogue

const dialogue = {
  0: {
    text: [
      "Lebedevsky: Good morning, Andrei. Are you ready to start the air quality checks for today?",
    ],
    next: 1,
    optionText1: "About that",
    optionText2: "I can't wait! Let's get started!",
    optionText3: "If we must.",
  },
  1: {
    text: ["you are gae"],
    next: 2,
    optionText: "who sir are the gae?",
  },
  2: {
    text: ["no it is you sah who ah the gae"],
    next: null, // No more dialogue
  },
};

let currentDialogue = 0;

async function startDialogue(dialogueId) {
  disableButtons();
  const dialogueNode = dialogue[dialogueId];

  await typeText(dialogueNode.text, [0], () => {
    gameState = 1;
    lastOptionPicked = 1;
    option1.innerText = dialogueNode.optionText1;
    option2.innerText = dialogueNode.optionText2;
    option3.innerText = dialogueNode.optionText3;
    enableButtons();
  });

  if (dialogueNode.next !== null) {
    option1.onclick = () => startDialogue(dialogueNode.next);
    option2.onclick = () => startDialogue(dialogueNode.next);
    option3.onclick = () => startDialogue(dialogueNode.next);
  } else {
    // End of dialogue, re-enable other options or proceed
    enableButtons();
  }
}

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
            }, 2750);
            setTimeout(() => {
              ominousTitleTrail2.play();
            }, 5500);
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
      chooseOption(lastOptionPicked); // Replay the text associated with the restored state
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
            "16th May 1982",
            "You are Andrei Berezkinov, a Soviet cosmonaut.",
            "Along with your crewmate, Valente Lebedevsky, you are the first team to man the Soviet space station...",
          ],
          [3000, 3500, 3500, 4000],
          () => {
            typingSound.pause();
            typingSpeed = 0;
            setFontSize(60);
            typeText(["", "SALYUT-7"], [2000, 1000], () => {
              setFontSize(20);
              typingSpeed = 0;
              typeText(
                [
                  "",
                  "Your mission is to activate this new space station, conduct various biological studies, and use the station's instruments to observe astronomical phenomena.",
                  "Having docked with SALYUT-7 three days ago, on 13th May 1982, you and Lebedevsky have just finished bringing the station fully online, initializing its life support systems, communications, power systems, and scientific equipment.",
                  "You are now required to conduct a comprehensive series of inspections and checks to ensure that all systems are functioning correctly and that the station is ready for long-term habitation and operations.",
                  "Are you up to the job?",
                ],
                [3000, 3500, 4000, 3500, 0],
                () => {
                  gameState = 1;
                  lastOptionPicked = 1;
                  updateOptions();
                  enable2();
                }
              );
            });
          }
        );
      }
      break;

    case 1:
      typingSpeed = 70;
      disableButtons();
      changeBackground("images/inside.png");
      if (option === 2) {
        typeText(
          [
            "Good morning, Andrei. Are you ready to start the air quality checks for today?",
          ],
          [1000],
          () => {
            moveOn(2, option);
          }
        );
      }
      break;

    case 2:
      disableButtons(); // Ensure buttons are disabled
      if (option === 1) {
        typeText(
          [
            "Lebedevsky: Alright. Let's start with the oxygen levels. I'll check the readings from the Oxygen Generation System, you take a look at CO2 removal. Check the Lithium Hydroxide canisters, the Co2 levels, and the system logs, in that order.",
            "Come and see me when you're done.",
          ],
          [2000],
          () => {
            moveOn(3, option);
          }
        );
      } else if (option === 2) {
        lastOptionPicked = 2;
        typeText(
          [
            "Lebedevsky: Cool your jets, spaceman. We'll be here for a long enough. It's best not to rush things.",
            "",
            "Idle minds unravel fast up here.",
          ],
          [0, 2000],
          () => {
            moveOn(4, option);
          }
        );
      } else {
        typeText(
          [
            "Lebedevsky: What's the matter, comrade? Still struggling with the space sickness?",
          ],
          [],
          () => {
            moveOn(5, option);
          }
        );
      }
      break;

    case 3:
      disableButtons(); // Ensure buttons are disabled
      if (option === 1) {
        typeText([], [], () => {
          moveOn();
        });
      } else if (option === 2) {
        lastOptionPicked = 2;
        typeText([], [], () => {
          moveOn();
        });
      } else {
        typeText([], [], () => {
          moveOn();
        });
      }
      break;

    case 4:
      disableButtons(); // Ensure buttons are disabled
      if (option === 1) {
        typeText(
          [
            "Lebedevsky: Exactly. We're the first crew to be stationed here. We need to make sure we look after the place.",
            "Slow and steady, that's the pace up here. But look who I'm talking to. You've been with the agency for long enough.",
            "What's it been, 10 years now?",
          ],
          [2000, 2000, 2000],
          () => {
            option1.innerText = "About that";
            option2.innerText = "12 years";
            option3.innerText = "*shrug*";
            enableButtons();
            option1.onclick = () =>
              typeText(
                [
                  "Lebedevsky: Sounds about right. This might be your first trip to space, but you've been around long enough.",
                  "Surely you've heard some of the stories from the other cosmonauts?",
                ],
                [0],
                () => {
                  option1.innerText = "You hear things";
                  option2.innerText = "Not really";
                  option3.innerText = "Of course, and don't call me Shirley!";
                  enableButtons();
                  option1.onclick = () =>
                    typeText(
                      [
                        "Lebedevsky: Of course, we all do. You can't help but notice some cosmonauts come back...",
                        "...different",
                      ],
                      [2000],
                      () => {
                        typeText(
                          [
                            "Lebedevsky: People think it's the silence of space that gets in your head, but that's not it.",
                            "It's the noise.",
                            "The constant, never ending hum of the station. The eternal hum and everything it means.",
                            "It's the hum of the research instruments, of the life support systems, the oxygen generator and the carbon dioxide scrubbers.",
                            "It's the hum that keeps you alive.",
                            "And it's the hum that never let's you forget where you are.",
                            "But I'm sure you'll adjust to life up here just fine.",
                            "Anyway... ",
                            "Let's start with the oxygen levels. I'll check the readings from the Oxygen Generation System, you take a look at CO2 removal. Check the Lithium Hydroxide canisters, the o2 levels, and the system logs, in that order",
                          ],
                          [2000, 2000, 2000, 2000, 2000, 2000, 2000],
                          () => {}
                        );
                      }
                    );
                  option2.onclick = () =>
                    typeText(
                      [
                        " Lebedevsky: I find that hard to believe, comrade. Stories travel fast on the ground, and everyone in the agency has observed some cosmonauts coming back...",
                        "...different",
                      ],
                      [2000],
                      () => {
                        typeText(
                          [
                            "Lebedevsky: People think it's the silence of space that gets in your head, but that's not it.",
                            "It's the noise.",
                            "The constant, never ending hum of the station. The eternal hum and everything it means.",
                            "It's the hum of the research instruments, of the life support systems, the oxygen generator and the carbon dioxide scrubbers.",
                            "It's the hum that keeps you alive.",
                            "And it's the hum that never let's you forget where you are.",
                            "But I'm sure you'll adjust to life up here just fine.",
                            "Anyway... ",
                            "Let's start with the oxygen levels. I'll check the readings from the Oxygen Generation System, you take a look at CO2 removal. Check the Lithium Hydroxide canisters, the o2 levels, and the system logs, in that order",
                          ],
                          [2000, 2000, 2000, 2000, 2000, 2000, 2000],
                          () => {}
                        );
                      }
                    );
                  option3.onclick = () =>
                    typeText(
                      [
                        "Lebedevsky: Haha, good one comrade. But don't let ground control hear you referencing American movies!",
                        "Joking aside, you must have noticed, on occasion, some cosmonauts come back a little...",
                        "...different",
                      ],
                      [2000, 2000],
                      () => {
                        typeText(
                          [
                            "Lebedevsky: People think it's the silence of space that gets in your head, but that's not it.",
                            "It's the noise.",
                            "The constant, never ending hum of the station. The eternal hum and everything it means.",
                            "It's the hum of the research instruments, of the life support systems, the oxygen generator and the carbon dioxide scrubbers.",
                            "It's the hum that keeps you alive.",
                            "And it's the hum that never let's you forget where you are.",
                            "But I'm sure you'll adjust to life up here just fine.",
                            "Anyway... ",
                            "Let's start with the oxygen levels. I'll check the readings from the Oxygen Generation System, you take a look at CO2 removal. Check the Lithium Hydroxide canisters, the o2 levels, and the system logs, in that order",
                          ],
                          [2000, 2000, 2000, 2000, 2000, 2000, 2000],
                          () => {}
                        );
                      }
                    );
                }
              );
            option2.onclick = () =>
              typeText(
                [
                  "Lebedevsky: Sounds about right. This might be your first trip to space, but you've been around long enough.",
                  "Surely you've heard some of the stories from the other cosmonauts?",
                ],
                [0],
                () => {
                  option1.innerText = "You hear things";
                  option2.innerText = "Not really";
                  option3.innerText = "Of course, and don't call me Shirley!";
                  enableButtons();
                  option1.onclick = () =>
                    typeText(
                      [
                        "Lebedevsky: Of course, we all do. You can't help but notice some cosmonauts come back...",
                        "...different",
                      ],
                      [2000],
                      () => {
                        typeText(
                          [
                            "Lebedevsky: People think it's the silence of space that gets in your head, but that's not it.",
                            "It's the noise.",
                            "The constant, never ending hum of the station. The eternal hum and everything it means.",
                            "It's the hum of the research instruments, of the life support systems, the oxygen generator and the carbon dioxide scrubbers.",
                            "It's the hum that keeps you alive.",
                            "And it's the hum that never let's you forget where you are.",
                            "But I'm sure you'll adjust to life up here just fine.",
                            "Anyway... ",
                            "Let's start with the oxygen levels. I'll check the readings from the Oxygen Generation System, you take a look at CO2 removal. Check the Lithium Hydroxide canisters, the o2 levels, and the system logs, in that order",
                          ],
                          [2000, 2000, 2000, 2000, 2000, 2000, 2000],
                          () => {}
                        );
                      }
                    );
                  option2.onclick = () =>
                    typeText(
                      [
                        " Lebedevsky: I find that hard to believe, comrade. Stories travel fast on the ground, and everyone in the agency has observed some cosmonauts coming back...",
                        "...different",
                      ],
                      [2000],
                      () => {
                        typeText(
                          [
                            "Lebedevsky: People think it's the silence of space that gets in your head, but that's not it.",
                            "It's the noise.",
                            "The constant, never ending hum of the station. The eternal hum and everything it means.",
                            "It's the hum of the research instruments, of the life support systems, the oxygen generator and the carbon dioxide scrubbers.",
                            "It's the hum that keeps you alive.",
                            "And it's the hum that never let's you forget where you are.",
                            "But I'm sure you'll adjust to life up here just fine.",
                            "Anyway... ",
                            "Let's start with the oxygen levels. I'll check the readings from the Oxygen Generation System, you take a look at CO2 removal. Check the Lithium Hydroxide canisters, the o2 levels, and the system logs, in that order",
                          ],
                          [2000, 2000, 2000, 2000, 2000, 2000, 2000],
                          () => {}
                        );
                      }
                    );
                  option3.onclick = () =>
                    typeText(
                      [
                        "Lebedevsky: Haha, good one comrade. But don't let ground control hear you referencing American movies!",
                        "Joking aside, you must have noticed, on occasion, some cosmonauts come back a little...",
                        "...different",
                      ],
                      [2000, 2000],
                      () => {
                        typeText(
                          [
                            "Lebedevsky: People think it's the silence of space that gets in your head, but that's not it.",
                            "It's the noise.",
                            "The constant, never ending hum of the station. The eternal hum and everything it means.",
                            "It's the hum of the research instruments, of the life support systems, the oxygen generator and the carbon dioxide scrubbers.",
                            "It's the hum that keeps you alive.",
                            "And it's the hum that never let's you forget where you are.",
                            "But I'm sure you'll adjust to life up here just fine.",
                            "Anyway... ",
                            "Let's start with the oxygen levels. I'll check the readings from the Oxygen Generation System, you take a look at CO2 removal. Check the Lithium Hydroxide canisters, the o2 levels, and the system logs, in that order",
                          ],
                          [2000, 2000, 2000, 2000, 2000, 2000, 2000],
                          () => {}
                        );
                      }
                    );
                }
              );
            option3.onclick = () =>
              typeText(
                [
                  "Lebedevsky: Sounds about right. This might be your first trip to space, but you've been around long enough.",
                  "Surely you've heard some of the stories from the other cosmonauts?",
                ],
                [0],
                () => {
                  option1.innerText = "You hear things";
                  option2.innerText = "Not really";
                  option3.innerText = "Of course, and don't call me Shirley!";
                  enableButtons();
                  option1.onclick = () =>
                    typeText(
                      [
                        "Lebedevsky: Of course, we all do. You can't help but notice some cosmonauts come back...",
                        "...different",
                      ],
                      [2000],
                      () => {
                        typeText(
                          [
                            "Lebedevsky: People think it's the silence of space that gets in your head, but that's not it.",
                            "It's the noise.",
                            "The constant, never ending hum of the station. The eternal hum and everything it means.",
                            "It's the hum of the research instruments, of the life support systems, the oxygen generator and the carbon dioxide scrubbers.",
                            "It's the hum that keeps you alive.",
                            "And it's the hum that never let's you forget where you are.",
                            "But I'm sure you'll adjust to life up here just fine.",
                            "Anyway... ",
                            "Let's start with the oxygen levels. I'll check the readings from the Oxygen Generation System, you take a look at CO2 removal. Check the Lithium Hydroxide canisters, the o2 levels, and the system logs, in that order",
                          ],
                          [2000, 2000, 2000, 2000, 2000, 2000, 2000],
                          () => {}
                        );
                      }
                    );
                  option2.onclick = () =>
                    typeText(
                      [
                        " Lebedevsky: I find that hard to believe, comrade. Stories travel fast on the ground, and everyone in the agency has observed some cosmonauts coming back...",
                        "...different",
                      ],
                      [2000],
                      () => {
                        typeText(
                          [
                            "Lebedevsky: People think it's the silence of space that gets in your head, but that's not it.",
                            "It's the noise.",
                            "The constant, never ending hum of the station. The eternal hum and everything it means.",
                            "It's the hum of the research instruments, of the life support systems, the oxygen generator and the carbon dioxide scrubbers.",
                            "It's the hum that keeps you alive.",
                            "And it's the hum that never let's you forget where you are.",
                            "But I'm sure you'll adjust to life up here just fine.",
                            "Anyway... ",
                            "Let's start with the oxygen levels. I'll check the readings from the Oxygen Generation System, you take a look at CO2 removal. Check the Lithium Hydroxide canisters, the o2 levels, and the system logs, in that order",
                          ],
                          [2000, 2000, 2000, 2000, 2000, 2000, 2000],
                          () => {}
                        );
                      }
                    );
                  option3.onclick = () =>
                    typeText(
                      [
                        "Lebedevsky: Haha, good one comrade. But don't let ground control hear you referencing American movies!",
                        "Joking aside, you must have noticed, on occasion, some cosmonauts come back a little...",
                        "...different",
                      ],
                      [2000, 2000],
                      () => {
                        typeText(
                          [
                            "Lebedevsky: People think it's the silence of space that gets in your head, but that's not it.",
                            "It's the noise.",
                            "The constant, never ending hum of the station. The eternal hum and everything it means.",
                            "It's the hum of the research instruments, of the life support systems, the oxygen generator and the carbon dioxide scrubbers.",
                            "It's the hum that keeps you alive.",
                            "And it's the hum that never let's you forget where you are.",
                            "But I'm sure you'll adjust to life up here just fine.",
                            "Anyway... ",
                            "Let's start with the oxygen levels. I'll check the readings from the Oxygen Generation System, you take a look at CO2 removal. Check the Lithium Hydroxide canisters, the o2 levels, and the system logs, in that order",
                          ],
                          [2000, 2000, 2000, 2000, 2000, 2000, 2000],
                          () => {}
                        );
                      }
                    );
                }
              );
          }
        );
      } else if (option === 2) {
        lastOptionPicked = 2;
        typeText([], [], () => {
          moveOn();
        });
      } else {
        typeText([], [], () => {
          moveOn();
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
      option1.innerText = "Good morning, Valente. Of course, let's begin.";
      option2.innerText = "I can't wait! Let's get started!";
      option3.innerText = "If we must.";
      break;

    case 3:
      option1.innerText = "state3";
      option2.innerText = "state3";
      option3.innerText = "state3";
      break;

    case 4:
      option1.innerText =
        "You're right. If there's one thing we have plenty of, it's time!";
      option2.innerText =
        "We have more than enough experiments to keep us occupied.";
      option3.innerText =
        "I am aware of the mental toll space travel can take.";
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
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center center";
  document.body.style.backgroundAttachment = "fixed";
  document.body.style.backgroundSize = "auto"; // Set specific size
}

function moveOn(newGameState, option) {
  gameState = newGameState;
  lastOptionPicked = option;
  updateOptions();
  enableButtons();
}

startButton.addEventListener("click", startGame);
