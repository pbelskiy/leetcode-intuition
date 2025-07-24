async function loadRandomQuestions() {
  const container = document.getElementById("question-container");
  container.innerHTML = "Loading...";

  const total = 3700;
  const numbers = Array.from({length: 20}, () => {
    const num = Math.floor(Math.random() * total) + 1;
    return num.toString().padStart(4, '0');
  });

  const questions = [];

  for (const n of numbers) {
    try {
      const res = await fetch(`static/questions/${n}.json`);
      if (!res.ok) continue;
      const data = await res.json();
      questions.push(data);
    } catch (e) {
      console.warn("Error loading", n, e);
    }
  }

  container.innerHTML = questions.map(q => `
    <div style="border:1px solid #ccc; margin:1em; padding:1em">
      <h2>${q.title} (${q.difficulty})</h2>
      <div>${q.content}</div>
      <p><strong>Topics:</strong> ${q.topicTags.map(t => t.name).join(', ')}</p>
    </div>
  `).join("");
}

loadRandomQuestions();
