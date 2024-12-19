// script.js
const textDisplay = document.getElementById('text-display');
const userInput = document.getElementById('user-input');
const resultsDiv = document.getElementById('results');
const accuracyDisplay = document.getElementById('accuracy');
const wpmDisplay = document.getElementById('wpm');
const scoreDisplay = document.getElementById('score');
const difficultyDisplay = document.getElementById('difficulty-result');
const durationDisplay = document.getElementById('duration-result');
const restartButton = document.getElementById("restart-button");
const durationButtons = document.querySelectorAll("#duration-selection button");
const difficultyButtons = document.querySelectorAll("#difficulty-selection button");
const timeLeftDisplay = document.getElementById("time-left");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById('start-button'); // Get the start button
const typingArea = document.getElementById('typing-area');

const texts = {
    30: {
        easy: "Typing is an essential skill for everyone. It helps in communication and improves work efficiency. Practice typing regularly to increase your speed and accuracy. It’s important to maintain good posture while typing.",
        medium: "Learning how to type quickly can save a lot of time and effort. The more you practice, the faster your fingers will move across the keyboard. Focus on accuracy, and soon you'll be typing without looking at the keys.",
        hard: "Typing proficiency is not just about speed but also about developing muscle memory. As you type, your brain processes the words faster than you can think. With consistent practice, you’ll master touch typing and reach impressive speeds while maintaining high accuracy."
    },
    60: {
        easy: "Typing is a basic skill that everyone can learn. It is helpful in many areas of life, such as writing emails, chatting online, and working on the computer. The more you practice, the better you get. Start slow, and try to improve with every session. Don’t worry if you make mistakes—just keep going!",
        medium: "Typing quickly and accurately is a valuable skill that can make your daily tasks easier. Whether you’re writing emails, creating documents, or chatting online, fast typing helps you complete tasks more efficiently. With regular practice, your fingers will get used to the layout of the keys, allowing you to type without looking at the keyboard.",
        hard: "Mastering typing is not just about speed; it’s about developing muscle memory and being able to type without thinking about each key. Touch typing allows you to focus on your ideas, rather than worrying about where the letters are on the keyboard. Regular practice will increase both your typing speed and your ability to type accurately under pressure. As you improve, you’ll notice how your skills translate into more efficient work habits."
    },
    120: {
        easy: "Typing is an important skill that everyone can learn. It helps you complete tasks quickly and efficiently. Whether you are typing a letter, writing a story, or sending an email, being able to type fast will save you time. Start by practicing every day, focusing on accuracy and proper finger placement. With time and effort, you will see improvements. Remember, don’t rush—practice consistently, and you’ll become faster and more comfortable with each typing session.",
        medium: "Being able to type quickly and accurately is a valuable skill in today’s world. It helps you work more efficiently and stay productive, especially when you have many tasks to complete. For example, if you're writing emails, creating reports, or even coding, being fast at typing can help you finish your work much faster. Typing regularly can help you improve your speed, but it's important to also focus on accuracy. When you combine both, you’ll be able to type with greater ease and confidence, reducing the time spent on typing and allowing you to focus on other important tasks.",
        hard: "Typing is not just about pressing keys; it’s about developing the ability to communicate swiftly and efficiently through text. The faster and more accurately you can type, the less time you’ll spend on mundane tasks, and the more you can focus on the content of your work. Professional writers, programmers, and data entry specialists all rely on their typing skills to complete projects quickly. As you continue to practice, your muscle memory will improve, and you'll be able to type without thinking about each individual key. Ultimately, mastering typing requires consistency, dedication, and a commitment to perfecting your technique, which will lead to faster, more accurate work in every task you undertake."
    }
};

let timerInterval;
let text;
let timeLeft;
let gameDuration;
let gameDifficulty = "easy"; // Default difficulty
let score;
let gameStarted = false; // Track the game state

function startGame(duration, difficulty) {
    gameDuration = duration;
    gameDifficulty = difficulty;
    timeLeft = gameDuration;
    updateTimerDisplay();

    text = texts[duration][difficulty];

    textDisplay.innerText = text;
    userInput.value = '';
    userInput.disabled = false;
    userInput.focus();
    resultsDiv.style.display = 'none';
    timerDisplay.style.display = "block";
    score = 0;
    gameStarted = true; // Set gameStarted to true
    startButton.disabled = true;
    durationButtons.forEach(btn => btn.disabled = true);
    difficultyButtons.forEach(btn => btn.disabled = true);
    timerInterval = setInterval(updateTimer, 1000);
    let initialText = "";
    for(let i = 0; i < text.length; i++){
        initialText += `<span>${text[i]}</span>`
    }
    typingArea.innerHTML = ""; // Clear any previous content
    for (const char of text) {
        const span = document.createElement('span');
        span.textContent = char; // Use textContent to avoid HTML entity issues
        typingArea.appendChild(span);
    }
    typingArea.focus();
}

typingArea.addEventListener('input', () => {
    if (!gameStarted) return;

    const enteredText = typingArea.innerText;
    const textSpans = typingArea.querySelectorAll('span');

    for (let i = 0; i < text.length; i++) {
        if (i < enteredText.length) {
            if (enteredText[i] === text[i]) {
                textSpans[i].className = "correct";
            } else {
                textSpans[i].className = "incorrect";
            }
        } else {
            textSpans[i].className = "";
        }
    }

    if (enteredText.length === text.length) {
        endGame();
    }
});

function updateTimer() {
    if (!gameStarted) return; // Exit if the game hasn't started
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft < 0) {
        endGame();
    }
}

function updateTimerDisplay() {
    timeLeftDisplay.innerText = timeLeft;
}

function endGame() {
    clearInterval(timerInterval);
    timerDisplay.style.display = "none";
    const enteredText = userInput.value;
    let correctChars = 0;
    for (let i = 0; i < Math.min(text.length, enteredText.length); i++) {
        if (text[i] === enteredText[i]) {
            correctChars++;
        }
    }

    const accuracy = (correctChars / text.length) * 100 || 0;
    const words = enteredText.length / 5; // Correct WPM calculation
    const timeTakenInMinutes = gameDuration / 60;
    const wpm = timeTakenInMinutes > 0 ? words / timeTakenInMinutes : 0; // Avoid division by zero
    
    score = Math.round(wpm * accuracy);

    wpmDisplay.innerText = Math.round(wpm);
    scoreDisplay.innerText = score;
    accuracyDisplay.innerText = accuracy.toFixed(2);
    difficultyDisplay.innerText = gameDifficulty;
    durationDisplay.innerText = gameDuration;
    resultsDiv.style.display = 'block';
    userInput.disabled = true;
    gameStarted = false; // Reset gameStarted
    startButton.disabled = false; // Enable the start button
    durationButtons.forEach(btn => btn.disabled = false);
    difficultyButtons.forEach(btn => btn.disabled = false);
    userInput.disabled = true;
    gameStarted = false;
    startButton.disabled = false;
    durationButtons.forEach(btn => btn.disabled = false);
    difficultyButtons.forEach(btn => btn.disabled = false);
    userInput.disabled = true;
    gameStarted = false;
    startButton.disabled = false;
    durationButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
    });
    difficultyButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
    });
}

userInput.addEventListener('input', () => {
    if (!gameStarted) return;

    const enteredText = userInput.value;
    let highlightedText = "";

    for (let i = 0; i < text.length; i++) {
        if (i < enteredText.length) {
            if (enteredText[i] === text[i]) {
                highlightedText += `<span class="correct">${text[i]}</span>`;
            } else {
                highlightedText += `<span class="incorrect">${text[i]}</span>`;
            }
        } else {
            highlightedText += text[i];
        }
    }

    textDisplay.innerHTML = highlightedText;

    if (enteredText.length === text.length) {
        endGame();
    }
});


durationButtons.forEach(button => {
    button.addEventListener("click", () => {
        durationButtons.forEach(btn => btn.classList.remove('selected')); // Remove from ALL duration buttons
        button.classList.add('selected');
    });
});

difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
        difficultyButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    });
});

startButton.addEventListener('click', () => {
    const selectedDurationButton = document.querySelector('#duration-selection button.selected');
    const selectedDifficultyButton = document.querySelector('#difficulty-selection button.selected');

    if (selectedDurationButton && selectedDifficultyButton) {
        const duration = parseInt(selectedDurationButton.dataset.duration);
        const difficulty = selectedDifficultyButton.dataset.difficulty;
        startGame(duration, difficulty);
    } else {
        alert("Please select both duration and difficulty.");
    }
});

restartButton.addEventListener("click", () => {
    // Reset for restart (most important change)
    textDisplay.innerText = "";
    userInput.value = "";
    userInput.disabled = true;
    resultsDiv.style.display = "none";
    timerDisplay.style.display = "none";
    gameStarted = false;
    startButton.disabled = false;
    gameDuration = null; // Reset duration
    gameDifficulty = null; // Reset difficulty
    durationButtons.forEach(btn => btn.disabled = false);
    difficultyButtons.forEach(btn => btn.disabled = false);
});

homeButton.addEventListener("click", () => {
    // Reset the game state
    textDisplay.innerText = "";
    userInput.value = "";
    userInput.disabled = true;
    resultsDiv.style.display = "none";
    timerDisplay.style.display = "none";
    gameStarted = false;
    startButton.disabled = false;
    durationButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
    });
    difficultyButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
    });
});