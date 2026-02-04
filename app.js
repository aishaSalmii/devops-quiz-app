let allQuestions = [];
let filteredQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

const topicSelect = document.getElementById("topicSelect");
const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const feedbackDiv = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("scoreText");

async function loadQuestions() {
  try {
    const res = await fetch("data/questions.json");
    allQuestions = await res.json();
    setupTopics(allQuestions);
    applyFilter();
    renderQuestion();
  } catch (e) {
    questionText.textContent = "Error: Could not load data/questions.json";
    progressText.textContent = "Check file path and run with Live Server.";
  }
}

function setupTopics(questions) {
  const topics = Array.from(new Set(questions.map(q => q.topic))).sort();
  topics.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    topicSelect.appendChild(opt);
  });
}

function applyFilter() {
  const selected = topicSelect.value;
  filteredQuestions = (selected === "ALL")
    ? [...allQuestions]
    : allQuestions.filter(q => q.topic === selected);

  currentIndex = 0;
  score = 0;
  answered = false;
  nextBtn.disabled = true;
  feedbackDiv.className = "feedback hidden";
  updateHeader();
}

function updateHeader() {
  const total = filteredQuestions.length;
  const shown = total === 0 ? 0 : (currentIndex + 1);
  progressText.textContent = `Question ${shown} / ${total}`;
  scoreText.textContent = `Score: ${score}`;
}

function renderQuestion() {
  if (filteredQuestions.length === 0) {
    questionText.textContent = "No questions for this topic.";
    optionsDiv.innerHTML = "";
    nextBtn.disabled = true;
    updateHeader();
    return;
  }

  const q = filteredQuestions[currentIndex];
  questionText.textContent = q.question;

  optionsDiv.innerHTML = "";
  q.options.forEach((optText, idx) => {
    const btn = document.createElement("button");
    btn.className = "optionBtn";
    btn.textContent = optText;
    btn.onclick = () => chooseAnswer(idx);
    optionsDiv.appendChild(btn);
  });

  answered = false;
  feedbackDiv.className = "feedback hidden";
  feedbackDiv.textContent = "";
  nextBtn.disabled = true;
  updateHeader();
}

function chooseAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const q = filteredQuestions[currentIndex];
  const isCorrect = selectedIndex === q.answerIndex;

  // disable all options and highlight
  const buttons = Array.from(document.querySelectorAll(".optionBtn"));
  buttons.forEach((b, idx) => {
    b.disabled = true;
    if (idx === q.answerIndex) b.style.border = "2px solid #2bb673";
    if (idx === selectedIndex && !isCorrect) b.style.border = "2px solid #ff4d4d";
  });

  if (isCorrect) score++;

  feedbackDiv.classList.remove("hidden");
  feedbackDiv.classList.add(isCorrect ? "correct" : "wrong");
  feedbackDiv.textContent =
    (isCorrect ? "✅ Correct! " : "❌ Wrong. ") + q.explanation;

  nextBtn.disabled = false;
  updateHeader();
}

function nextQuestion() {
  if (filteredQuestions.length === 0) return;

  if (currentIndex < filteredQuestions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    questionText.textContent = `Finished! Final score: ${score} / ${filteredQuestions.length}`;
    optionsDiv.innerHTML = "";
    feedbackDiv.className = "feedback correct";
    feedbackDiv.textContent = "You reached the end. Press Restart to try again.";
    nextBtn.disabled = true;
    updateHeader();
  }
}

function restartQuiz() {
  applyFilter();
  renderQuestion();
}

topicSelect.addEventListener("change", () => {
  applyFilter();
  renderQuestion();
});

nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);

loadQuestions();
