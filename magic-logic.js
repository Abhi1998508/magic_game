let playerName = "";
let avatarID = 1;
let playerScore = 0;
let computerScore = 0;
let currentAnswer = 0;
let timeLeft = 10;
let timer;
let locked = false;
let freezeUsed = false;
let skipUsed = false;
let gameOver = false;

const avatarMap = {
  1: "avatar1.png",
  2: "avatar2.png",
  3: "avatar3.png"
};

function selectAvatar(id) {
  avatarID = id;
  document.querySelectorAll("#avatarOptions img").forEach(img => img.classList.remove("selected"));
  event.target.classList.add("selected");
}

function startGame() {
  playerName = document.getElementById("nicknameInput").value || "Mystery Mage";
  document.getElementById("setupScreen").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("playerName").textContent = playerName;
  document.getElementById("playerAvatar").src = avatarMap[avatarID];
  generateQuestion();
  startTimer();
  playSound("duelSound");
  createKeypad();
}

function generateQuestion() {
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 20) + 1;
  const ops = ["+", "-", "*"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  currentAnswer = eval(`${num1} ${op} ${num2}`);
  document.getElementById("questionBox").textContent = `Cast: ${num1} ${op} ${num2}`;
  document.getElementById("answerInput").value = "";
  document.getElementById("answerInput").disabled = false;
  locked = false;
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 10;
  document.getElementById("timer").textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      playerMissed();
    }
  }, 1000);
}

function checkAnswer() {
  if (locked || gameOver) return;
  const userAnswer = parseInt(document.getElementById("answerInput").value);
  if (userAnswer === currentAnswer) {
    playSound("correctSound");
    playerScore++;
    document.getElementById("playerScore").textContent = `🧙 Mana: ${playerScore}`;
  } else {
    playSound("wrongSound");
    document.getElementById("feedback").textContent = "Incorrect answer ❌";
    document.getElementById("feedback").classList.remove("hidden");
    setTimeout(() => document.getElementById("feedback").classList.add("hidden"), 1500);
  }
  locked = true;
  document.getElementById("answerInput").disabled = true;
  setTimeout(() => {
    computerTurn();
  }, 500);
}

function playerMissed() {
  document.getElementById("feedback").textContent = "Oops! Be faster next time ⏳";
  document.getElementById("feedback").classList.remove("hidden");
  locked = true;
  document.getElementById("answerInput").disabled = true;
  setTimeout(() => {
    document.getElementById("feedback").classList.add("hidden");
    computerTurn();
  }, 1000);
}

function computerTurn() {
  if (gameOver) return;
  const chance = Math.random();
  if (chance < 0.7) {
    computerScore++;
    document.getElementById("computerScore").textContent = `🤖 CPU Mana: ${computerScore}`;
  }

  checkForWinner();
  if (!gameOver) {
    nextRound();
  }
}

function nextRound() {
  generateQuestion();
  startTimer();
}

function checkForWinner() {
  if (playerScore >= 20) {
    endGame(`${playerName} wins! 🎉`);
  } else if (computerScore >= 20) {
    endGame("Computer wins! 🤖");
  }
}

function useFreeze() {
  if (freezeUsed) return alert("Freeze already used!");
  clearInterval(timer);
  timeLeft += 5;
  document.getElementById("timer").textContent = timeLeft;
  freezeUsed = true;
}

function useSkip() {
  if (skipUsed) return alert("Skip already used!");
  skipUsed = true;
  locked = true;
  document.getElementById("answerInput").disabled = true;
  computerTurn();
}

function createKeypad() {
  const keypad = document.getElementById("keypad");
  keypad.innerHTML = "";
  const buttons = ['1','2','3','4','5','6','7','8','9','0','-','←','Enter'];
  buttons.forEach(symbol => {
    const btn = document.createElement("button");
    btn.textContent = symbol;
    btn.onclick = () => handleKey(symbol);
    keypad.appendChild(btn);
  });
}

function handleKey(symbol) {
  const input = document.getElementById("answerInput");
  if (symbol === '←') {
    input.value = input.value.slice(0, -1);
  } else if (symbol === 'Enter') {
    checkAnswer();
  } else if (symbol === '-') {
    if (!input.value.includes('-')) {
      input.value = '-' + input.value;
    }
  } else {
    input.value += symbol;
  }
}

function endGame(message) {
  clearInterval(timer);
  gameOver = true;
  document.getElementById("feedback").textContent = message;
  document.getElementById("feedback").classList.remove("hidden");
  document.getElementById("gameOver").classList.remove("hidden");
}

function restartGame() {
  playerScore = 0;
  computerScore = 0;
  freezeUsed = false;
  skipUsed = false;
  gameOver = false;
  document.getElementById("playerScore").textContent = "🧙 Mana: 0";
  document.getElementById("computerScore").textContent = "🤖 CPU Mana: 0";
  document.getElementById("feedback").classList.add("hidden");
  document.getElementById("gameOver").classList.add("hidden");
  generateQuestion();
  startTimer();
}

function exitGame() {
  if (!gameOver) {
    const confirmExit = confirm("Do you really want to exit the duel?");
    if (confirmExit) {
      endGame("You exited the duel! CPU wins ⚔️");

      // Redirect to setup screen after short delay
      setTimeout(() => {
        document.getElementById("game").classList.add("hidden");
        document.getElementById("setupScreen").classList.remove("hidden");

        playerScore = 0;
        computerScore = 0;
        freezeUsed = false;
        skipUsed = false;
        gameOver = false;

        document.getElementById("playerScore").textContent = "🧙 Mana: 0";
        document.getElementById("computerScore").textContent = "🤖 CPU Mana: 0";
        document.getElementById("nicknameInput").value = "";
        document.getElementById("feedback").classList.add("hidden");
        document.getElementById("gameOver").classList.add("hidden");
      }, 2000);
    }
  }
}

function playSound(id) {
  const sound = document.getElementById(id);
  sound && sound.play();
}
