const getScoreClass = (score) => {
  if (score >= 70) return 'good';
  if (score >= 40) return 'average';
  return 'poor';
};

const getScoreBadgeClass = (priority) => {
  if (priority === 'high') return 'badge-danger';
  if (priority === 'medium') return 'badge-warning';
  return 'badge-success';
};

const renderScoreCircle = (id, score) => {
  const el = document.getElementById(id);
  el.querySelector('span').textContent = score;
  el.classList.add(getScoreClass(score));
};

const renderSectionScores = (sectionScores) => {
  const container = document.getElementById('sectionScores');
  const sections = {
    workExperience: 'Work Experience',
    skills: 'Skills',
    projects: 'Projects',
    summary: 'Summary',
    education: 'Education',
  };

  container.innerHTML = Object.entries(sections).map(([key, label]) => {
    const score = sectionScores[key] || 0;
    const cls = getScoreClass(score);
    return `
      <div class="section-bar">
        <div class="bar-header">
          <span>${label}</span>
          <span>${score}/100</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill ${cls}" style="width: ${score}%"></div>
        </div>
      </div>
    `;
  }).join('');
};

const renderKeywords = (keywords) => {
  const presentEl = document.getElementById('presentKeywords');
  const missingEl = document.getElementById('missingKeywords');

  presentEl.innerHTML = keywords.present.map(kw =>
    `<span class="badge badge-success">${kw}</span>`
  ).join('');

  missingEl.innerHTML = keywords.missing.map(kw =>
    `<span class="badge badge-danger">${kw}</span>`
  ).join('');
};

const renderSuggestions = (suggestions) => {
  const container = document.getElementById('suggestions');
  container.innerHTML = suggestions.map(s => `
    <div class="suggestion-item">
      <div class="suggestion-priority">
        <span class="badge ${getScoreBadgeClass(s.priority)}">${s.priority}</span>
      </div>
      <div>
        <p class="suggestion-title">${s.title}</p>
        <p class="suggestion-desc">${s.description}</p>
      </div>
    </div>
  `).join('');
};

const loadReport = () => {
  const report = JSON.parse(localStorage.getItem('latestReport'));

  if (!report) {
    window.location.href = 'analyzer.html';
    return;
  }

  renderScoreCircle('overallScoreCircle', report.overallScore);
  renderScoreCircle('atsScoreCircle', report.atsScore);
  renderScoreCircle('jdScoreCircle', report.jdMatchScore);
  renderSectionScores(report.sectionScores);
  renderKeywords(report.keywords);
  renderSuggestions(report.suggestions);

  if (!isLoggedIn()) {
    document.getElementById('guestBanner').style.display = 'flex';
  } else {
    document.getElementById('dashboardBtn').style.display = 'inline-block';
  }
};