// ✅ Get user and subject
const userName = localStorage.getItem("username");
const subject = localStorage.getItem("subject");

// ✅ Redirect to login if missing info
if (!userName || !subject) {
  window.location.href = "login.html";
}

// ✅ Display user name
const userNameElement = document.getElementById("user-name");
if (userNameElement) userNameElement.textContent = userName;
// Dynamically load the correct questions file
const script = document.createElement("script");
script.src = `questions/${subject}.js`;  // ✅ This is the line
document.body.appendChild(script);

// Call showQuestion only after the question file is fully loaded
script.onload = () => {
  if (!questions || !questions.length) {
    alert("No questions found for this subject.");
    return;
  }
  showQuestion();
};
// ✅ Themed background (optional)
const themeMap = {
  html: "linear-gradient(to right, #f6d365, #fda085)",
  java: "linear-gradient(to right, #a1c4fd, #c2e9fb)",
  python: "linear-gradient(to right, #d4fc79, #96e6a1)",
  dbms: "linear-gradient(to right, #ff9a9e, #fad0c4)",
  cn: "linear-gradient(to right, #a18cd1, #fbc2eb)"
};
document.body.style.background = themeMap[subject] || "#4a00e0";

// ✅ Quiz elements
const questionText = document.getElementById("question");
const optionsBox = document.getElementById("options");
const scoreDisplay = document.getElementById("score");
const timerElement = document.getElementById("timer");
const nextBtn = document.getElementById("next-btn");
const resultBox = document.getElementById("result-box");
const questionBox = document.getElementById("question-box");
const finalScore = document.getElementById("final-score");

// ✅ Quiz state
let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;

// ✅ Show question
function showQuestion() {
  resetState();

  if (currentQuestion >= questions.length) {
    endQuiz();
    return;
  }

  const q = questions[currentQuestion];
  questionText.textContent = q.question;

  q.options.forEach(option => {
    const button = document.createElement("button");
    button.classList.add("option-btn");
    button.textContent = option;
    button.onclick = () => selectOption(button, q.answer);
    optionsBox.appendChild(button);
  });

  startTimer();
}

// ✅ Handle option selection
function selectOption(button, correctAnswer) {
  clearInterval(timer);

  const allOptions = document.querySelectorAll(".option-btn");
  allOptions.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.classList.add("correct");
    } else if (btn === button) {
      btn.classList.add("wrong");
    }
  });

  if (button.textContent === correctAnswer) {
    score++;
    scoreDisplay.textContent = "Score: " + score;
  }
}

// ✅ Start countdown
function startTimer() {
  timeLeft = 10;
  timerElement.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      document.querySelectorAll(".option-btn").forEach(btn => btn.disabled = true);
    }
  }, 1000);
}

// ✅ Reset options + timer
function resetState() {
  optionsBox.innerHTML = "";
  clearInterval(timer);
}

// ✅ On Next button click
nextBtn.onclick = () => {
  currentQuestion++;
  showQuestion();
};

// ✅ End of quiz
function endQuiz() {
  questionBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  finalScore.textContent = `${score} / ${questions.length}`;
  document.getElementById("welcome-box").style.display = "none";
  // Optional: Clear login info after quiz
  localStorage.removeItem("username");
  localStorage.removeItem("subject");
}
