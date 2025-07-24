const TOTAL_QUESTIONS = 3638;
const QUIZ_SIZE = 10;
const QUESTIONS_DIR = 'static/questions/';
const TOPICS_FILE = 'static/topics.json';

let topics = [];
let questions = [];
let currentIndex = 0;
let correctAnswers = 0;

function pad(num) {
  return num.toString().padStart(4, '0');
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function loadTopics() {
  const res = await fetch(TOPICS_FILE);
  return await res.json();
}

async function loadRandomQuestions() {
  const randomIds = shuffle([...Array(TOTAL_QUESTIONS).keys()].map(i => i + 1)).slice(0, QUIZ_SIZE);
  const filenames = randomIds.map(id => `${QUESTIONS_DIR}${pad(id)}.json`);
  const promises = filenames.map(path => fetch(path).then(r => r.json()));
  return await Promise.all(promises);
}

function saveStats() {
  const prev = JSON.parse(localStorage.getItem('stats') || '{}');
  const timestamp = Date.now();
  localStorage.setItem('stats', JSON.stringify({
    correct: correctAnswers,
    total: QUIZ_SIZE,
    date: timestamp,
    prev
  }));
}

function renderQuestion() {
  const container = document.getElementById('quiz');
  if (!container) return;

  if (currentIndex >= questions.length) {
    saveStats();
    container.innerHTML = `
      <h2>Done! 🎉</h2>
      <p>You got ${correctAnswers} out of ${questions.length} correct.</p>
    `;
    return;
  }

  const q = questions[currentIndex];
  const correctSlug = q.topicTags[0]?.slug || '';
  const distractors = shuffle(topics.filter(t => t !== correctSlug)).slice(0, 3);
  const options = shuffle([correctSlug, ...distractors]);

  container.innerHTML = `
    <div class="question">
      <h3>${q.title}</h3>
      <div class="description">${q.content}</div>
      <div class="options">
        ${options.map(opt => `<button class="answer-button" data-topic="${opt}">${opt}</button>`).join('')}
      </div>
    </div>
  `;

  const buttons = container.querySelectorAll('.answer-button');

  buttons.forEach(btn => {
    btn.addEventListener('click', e => {
      if (btn.disabled) return;

      const selected = e.target.dataset.topic;

      if (selected === correctSlug) {
        e.target.classList.add('correct');
        correctAnswers++;
      } else {
        e.target.classList.add('wrong');
        const correctButton = [...buttons].find(b => b.dataset.topic === correctSlug);
        if (correctButton) correctButton.classList.add('correct');
      }

      buttons.forEach(b => b.disabled = true);

      setTimeout(() => {
        currentIndex++;
        renderQuestion();
      }, 500);
    });
  });
}

async function startQuiz() {
  topics = await loadTopics();
  questions = await loadRandomQuestions();
  renderQuestion();
}

document.addEventListener('DOMContentLoaded', startQuiz);
