export function initUI() {
  const moods = ['happy', 'sad', 'angry', 'anxious', 'excited', 'nostalgic'];
  const app = document.querySelector('#app');
  app.innerHTML = `
  <div class="container">
    <section class="mood-selector" id="by-select">
      <label for="mood">How are you feeling today?</label>
      <select id="mood">
        <option value="">Choose a mood</option>
        ${moods.map((m) => `<option value="${m}">${m}</option>`).join('')}
      </select>
    </section>
    <section class="mood-text" id="by-text">
      <div>
        <label for="textMood">Or describe how you feel:</label>
        <input type="text" id="textMood" placeholder="e.g. I feel drained and tired..." />
      </div>
      <button class="analyze" type="submit" id="analyze">Done</button>
    </section>
  </div>

  <div id="results"></div>
  `;
}

export function renderResultsHTML(html) {
  document.getElementById('results').innerHTML = html;
}

export function appendResultsHTML(html) {
  document.getElementById('results').innerHTML += html;
}
