const getScoreClass = (score) => {
  if (score >= 70) return 'good';
  if (score >= 40) return 'average';
  return 'poor';
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const renderAnalysisCard = (analysis) => {
  const { report, createdAt, _id } = analysis;
  const overall = report.overallScore;
  const ats = report.atsScore;
  const jd = report.jdMatchScore;

  return `
    <div class="analysis-card" onclick="viewReport('${_id}')">
      <div class="analysis-card-header">
        <span class="badge badge-info">Resume Analysis</span>
        <span class="analysis-date">${formatDate(createdAt)}</span>
      </div>
      <div class="analysis-scores">
        <div class="analysis-score-item">
          <div class="analysis-score-val ${getScoreClass(overall)}">${overall}</div>
          <div class="analysis-score-label">Overall</div>
        </div>
        <div class="analysis-score-item">
          <div class="analysis-score-val ${getScoreClass(ats)}">${ats}</div>
          <div class="analysis-score-label">ATS</div>
        </div>
        <div class="analysis-score-item">
          <div class="analysis-score-val ${getScoreClass(jd)}">${jd}</div>
          <div class="analysis-score-label">JD Match</div>
        </div>
      </div>
      <div class="analysis-card-footer">
        <span>${report.suggestions.length} suggestions</span>
        <span class="view-report-btn">View Report →</span>
      </div>
    </div>
  `;
};

const viewReport = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/analyze/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    const data = await res.json();

    if (!res.ok) {
      alert('Could not load report.');
      return;
    }

    localStorage.setItem('latestReport', JSON.stringify(data.report));
    window.location.href = 'report.html';
  } catch (err) {
    alert('Something went wrong.');
  }
};

const loadDashboard = async () => {
  const user = getUser();
  if (user) {
    document.getElementById('welcomeMsg').textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
  }

  try {
    const res = await fetch(`${API_BASE}/analyze/history`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    const data = await res.json();

    document.getElementById('loadingState').style.display = 'none';

    if (!res.ok || data.length === 0) {
      document.getElementById('emptyState').style.display = 'block';
      return;
    }

    const grid = document.getElementById('analysesGrid');
    grid.style.display = 'grid';
    grid.innerHTML = data.map(renderAnalysisCard).join('');
  } catch (err) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
  }
};