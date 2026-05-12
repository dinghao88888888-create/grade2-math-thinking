import {
  LEVELS,
  chapters,
  chapterTemplateSummary,
  generateFromTemplate,
  generatePractice,
  getChapter
} from "./data.js";

const STORAGE = {
  wrongs: "math-thinking-wrongs-v1",
  history: "math-thinking-history-v1",
  settings: "math-thinking-settings-v1"
};

const state = {
  view: "practice",
  selectedChapter: "all",
  selectedLevel: "thinking",
  selectedCount: 8,
  questions: [],
  currentIndex: 0,
  revealedAnswer: false,
  visibleHints: 0
};

const chapterPicker = document.querySelector("#chapterPicker");
const levelSelect = document.querySelector("#levelSelect");
const countSelect = document.querySelector("#countSelect");
const sessionStats = document.querySelector("#sessionStats");
const viewRoot = document.querySelector("#viewRoot");
const wrongCount = document.querySelector("#wrongCount");

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function getSettings() {
  return readJSON(STORAGE.settings, {
    selectedChapter: "all",
    selectedLevel: "thinking",
    selectedCount: 8
  });
}

function saveSettings() {
  writeJSON(STORAGE.settings, {
    selectedChapter: state.selectedChapter,
    selectedLevel: state.selectedLevel,
    selectedCount: state.selectedCount
  });
}

function getWrongs() {
  return readJSON(STORAGE.wrongs, []);
}

function saveWrongs(items) {
  writeJSON(STORAGE.wrongs, items);
  updateWrongCount();
}

function getHistory() {
  return readJSON(STORAGE.history, []);
}

function saveHistory(items) {
  writeJSON(STORAGE.history, items.slice(-500));
}

function currentQuestion() {
  return state.questions[state.currentIndex] ?? null;
}

function levelClass(level) {
  if (level === "thinking") return "thinking";
  if (level === "variant") return "variant";
  if (level === "mixed") return "mixed";
  return "";
}

function levelLabel(level) {
  return LEVELS.find((item) => item.id === level)?.name ?? "练习";
}

function makeSnapshot(question, result = "needs") {
  return {
    wrongId: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    questionId: question.id,
    templateId: question.templateId,
    chapterId: question.chapterId,
    chapterName: question.chapterName,
    level: question.level,
    levelName: question.levelName,
    skill: question.skill,
    title: question.title,
    question: question.question,
    answer: question.answer,
    hints: question.hints,
    steps: question.steps,
    extension: question.extension,
    userAnswer: question.userAnswer,
    result,
    date: new Date().toISOString()
  };
}

function addHistory(result) {
  const question = currentQuestion();
  if (!question) return;
  const history = getHistory();
  history.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    templateId: question.templateId,
    chapterId: question.chapterId,
    chapterName: question.chapterName,
    level: question.level,
    skill: question.skill,
    result,
    date: new Date().toISOString()
  });
  saveHistory(history);
}

function addWrong(question = currentQuestion()) {
  if (!question) return;
  const wrongs = getWrongs();
  const exists = wrongs.some((item) => item.questionId === question.id);
  if (!exists) {
    wrongs.unshift(makeSnapshot(question));
    saveWrongs(wrongs.slice(0, 200));
  }
}

function removeWrong(wrongId) {
  saveWrongs(getWrongs().filter((item) => item.wrongId !== wrongId));
}

function clearPracticeState() {
  state.currentIndex = 0;
  state.revealedAnswer = false;
  state.visibleHints = 0;
}

function createPractice() {
  state.questions = generatePractice({
    chapterId: state.selectedChapter,
    level: state.selectedLevel,
    count: state.selectedCount
  });
  clearPracticeState();
  saveSettings();
  state.view = "practice";
  render();
}

function renderControls() {
  chapterPicker.innerHTML = chapters
    .map((chapter) => {
      const active = chapter.id === state.selectedChapter ? " is-active" : "";
      return `
        <button class="chapter-button${active}" type="button" data-chapter="${chapter.id}">
          <strong>${chapter.order}. ${escapeHtml(chapter.title)}</strong>
          <span>${escapeHtml(chapter.focus)}</span>
        </button>
      `;
    })
    .join("");

  levelSelect.innerHTML = LEVELS.map(
    (level) => `<option value="${level.id}">${escapeHtml(level.name)}｜${escapeHtml(level.note)}</option>`
  ).join("");

  levelSelect.value = state.selectedLevel;
  countSelect.value = String(state.selectedCount);
}

function updateWrongCount() {
  wrongCount.textContent = String(getWrongs().length);
}

function renderSessionStats() {
  const chapterName = state.selectedChapter === "all" ? "全部单元" : getChapter(state.selectedChapter)?.title;
  const question = currentQuestion();
  sessionStats.innerHTML = `
    <div class="stat-line"><span>单元</span><strong>${escapeHtml(chapterName)}</strong></div>
    <div class="stat-line"><span>类型</span><strong>${escapeHtml(levelLabel(state.selectedLevel))}</strong></div>
    <div class="stat-line"><span>题量</span><strong>${state.questions.length || state.selectedCount}题</strong></div>
    <div class="stat-line"><span>当前</span><strong>${question ? `${state.currentIndex + 1}/${state.questions.length}` : "未生成"}</strong></div>
  `;
}

function setActiveTab() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === state.view);
  });
}

function renderPractice() {
  if (state.questions.length === 0) {
    createPractice();
    return;
  }

  const question = currentQuestion();
  const progress = Math.round(((state.currentIndex + 1) / state.questions.length) * 100);
  const hintsToShow = question.hints.slice(0, state.visibleHints);

  viewRoot.innerHTML = `
    <div class="view-stack">
      <section class="summary-panel">
        <div>
          <div class="pill-row">
            <span class="pill">${escapeHtml(question.chapterName)}</span>
            <span class="tag ${levelClass(question.level)}">${escapeHtml(question.levelName)}</span>
            <span class="tag">${escapeHtml(question.skill)}</span>
          </div>
          <h2>${escapeHtml(question.title)}</h2>
          <p>第${state.currentIndex + 1}题，共${state.questions.length}题。做完后可自评，系统会记录薄弱点。</p>
        </div>
        <div class="progress-wrap" aria-label="练习进度">
          <div class="progress-text"><span>进度</span><strong>${progress}%</strong></div>
          <div class="progress-bar"><span style="width: ${progress}%"></span></div>
        </div>
      </section>

      <article class="question-card">
        <div class="question-meta">
          <h2>${escapeHtml(question.title)}</h2>
          <div class="tag-row">
            <span class="tag ${levelClass(question.level)}">${escapeHtml(question.levelName)}</span>
            <span class="tag">${escapeHtml(question.skill)}</span>
          </div>
        </div>

        <div class="question-text">${escapeHtml(question.question)}</div>

        <div class="answer-box">
          <label for="userAnswer">孩子的想法或答案</label>
          <textarea id="userAnswer" placeholder="可以写算式、画图思路或一句解释。">${escapeHtml(question.userAnswer)}</textarea>
        </div>

        <div class="question-actions">
          <button class="secondary-button" type="button" data-action="show-hint">提示</button>
          <button class="secondary-button" type="button" data-action="show-answer">答案解析</button>
          <button class="ghost-button" type="button" data-action="mark-correct">做对了</button>
          <button class="danger-button" type="button" data-action="mark-needs">还要练</button>
          <button class="ghost-button" type="button" data-action="add-wrong">加入错题本</button>
        </div>

        ${hintsToShow.length > 0 ? renderHints(hintsToShow) : ""}
        ${state.revealedAnswer ? renderSolution(question) : ""}

        <div class="navigator">
          <button class="ghost-button" type="button" data-action="prev-question" ${state.currentIndex === 0 ? "disabled" : ""}>上一题</button>
          <button class="secondary-button" type="button" data-action="next-question">${state.currentIndex === state.questions.length - 1 ? "回到第1题" : "下一题"}</button>
        </div>
      </article>

      ${renderWorksheetList()}
    </div>
  `;
}

function renderHints(hints) {
  return `
    <div class="hint-box">
      <h3>提示</h3>
      <ol>${hints.map((hint) => `<li>${escapeHtml(hint)}</li>`).join("")}</ol>
    </div>
  `;
}

function renderSolution(question) {
  return `
    <div class="solution-box">
      <h3>参考答案</h3>
      <p class="reference-answer">${escapeHtml(question.answer)}</p>
      <ol>${question.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
      <p class="extension">${escapeHtml(question.extension)}</p>
    </div>
  `;
}

function renderWorksheetList() {
  return `
    <section class="worksheet-list">
      <h3>本套题目</h3>
      ${state.questions
        .map(
          (question, index) => `
            <div class="mini-question">
              <span class="mini-index">${index + 1}</span>
              <div>
                <p><strong>${escapeHtml(question.chapterName)}｜${escapeHtml(question.skill)}</strong></p>
                <p>${escapeHtml(question.question)}</p>
              </div>
            </div>
          `
        )
        .join("")}
    </section>
  `;
}

function renderWrongbook() {
  const wrongs = getWrongs();
  if (wrongs.length === 0) {
    viewRoot.innerHTML = `
      <div class="empty-state">
        <h2>错题本还是空的</h2>
        <p>在练习页点击“还要练”或“加入错题本”，这里会自动保存题目和解析。</p>
      </div>
    `;
    return;
  }

  viewRoot.innerHTML = `
    <div class="view-stack">
      <section class="summary-panel">
        <div>
          <h2>错题本</h2>
          <p>共${wrongs.length}道题。建议先复述思路，再点“再练相似题”。</p>
        </div>
        <button class="danger-button" type="button" data-action="clear-wrongs">清空错题本</button>
      </section>
      <div class="wrong-list">
        ${wrongs.map(renderWrongCard).join("")}
      </div>
    </div>
  `;
}

function renderWrongCard(item) {
  return `
    <article class="wrong-card">
      <div class="tag-row">
        <span class="pill">${escapeHtml(item.chapterName)}</span>
        <span class="tag ${levelClass(item.level)}">${escapeHtml(item.levelName)}</span>
        <span class="tag">${escapeHtml(item.skill)}</span>
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${formatDate(item.date)}</p>
      <div class="wrong-question">${escapeHtml(item.question)}</div>
      <p><strong>参考答案：</strong>${escapeHtml(item.answer)}</p>
      <p><strong>关键思路：</strong>${escapeHtml(item.steps?.[0] ?? "")}</p>
      <div class="wrong-actions">
        <button class="secondary-button" type="button" data-action="practice-similar" data-template="${escapeHtml(item.templateId)}">再练相似题</button>
        <button class="ghost-button" type="button" data-action="remove-wrong" data-wrong="${escapeHtml(item.wrongId)}">移除</button>
      </div>
    </article>
  `;
}

function renderParent() {
  const history = getHistory();
  const wrongs = getWrongs();
  const total = history.length;
  const correct = history.filter((item) => item.result === "correct").length;
  const needs = history.filter((item) => item.result === "needs").length;
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);
  const rows = chapters.map((chapter) => {
    const chapterHistory = history.filter((item) => item.chapterId === chapter.id);
    const chapterNeeds = chapterHistory.filter((item) => item.result === "needs").length;
    const chapterWrongs = wrongs.filter((item) => item.chapterId === chapter.id).length;
    return {
      chapter,
      practiced: chapterHistory.length,
      needs: chapterNeeds,
      wrongs: chapterWrongs,
      score: chapterNeeds + chapterWrongs * 2
    };
  });
  const weak = [...rows].sort((a, b) => b.score - a.score)[0];

  viewRoot.innerHTML = `
    <div class="view-stack">
      <div class="metric-grid">
        <div class="metric"><strong>${total}</strong><span>已记录题次</span></div>
        <div class="metric"><strong>${correct}</strong><span>做对</span></div>
        <div class="metric"><strong>${needs}</strong><span>还要练</span></div>
        <div class="metric"><strong>${accuracy}%</strong><span>自评正确率</span></div>
      </div>

      <section class="summary-panel">
        <div>
          <h2>薄弱建议</h2>
          <p>${weak && weak.score > 0 ? `优先练“${escapeHtml(weak.chapter.title)}”，从思维拓展题开始，每次5题。` : "还没有明显薄弱点，先做一套综合练习建立记录。"}</p>
        </div>
        <button class="secondary-button" type="button" data-action="practice-weak" data-chapter="${weak?.chapter.id ?? "review"}">生成推荐练习</button>
      </section>

      <table class="chapter-table">
        <thead>
          <tr>
            <th>单元</th>
            <th>已练</th>
            <th>还要练</th>
            <th>错题本</th>
            <th>建议</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>
                  <td>${row.chapter.order}. ${escapeHtml(row.chapter.title)}</td>
                  <td>${row.practiced}</td>
                  <td>${row.needs}</td>
                  <td>${row.wrongs}</td>
                  <td>${row.score > 0 ? "做5道思维拓展，再讲一遍思路" : "保持每周滚动复习"}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>

      <div class="button-row">
        <button class="danger-button" type="button" data-action="clear-history">清空练习记录</button>
      </div>
    </div>
  `;
}

function renderLibrary() {
  const summary = chapterTemplateSummary();
  viewRoot.innerHTML = `
    <div class="view-stack">
      <section class="summary-panel">
        <div>
          <h2>目录题型库</h2>
          <p>第一版已按课本目录覆盖7个单元，每个单元含基础、变式或思维题模板。</p>
        </div>
        <button class="secondary-button" type="button" data-action="generate">生成练习</button>
      </section>
      <div class="library-list">
        ${summary
          .map(
            (chapter) => `
              <article class="library-row">
                <div>
                  <h3>${chapter.order}. ${escapeHtml(chapter.title)}</h3>
                  <p>${escapeHtml(chapter.page)}｜${escapeHtml(chapter.focus)}</p>
                  <div class="point-list">
                    ${chapter.points.map((point) => `<span>${escapeHtml(point)}</span>`).join("")}
                  </div>
                </div>
                <div>
                  <p><strong>思维重点：</strong>${escapeHtml(chapter.thinkingFocus)}</p>
                  <p><strong>题型模板：</strong>${chapter.totalTemplates}个</p>
                  <div class="skill-list">
                    ${chapter.skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}
                  </div>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function render() {
  renderControls();
  renderSessionStats();
  updateWrongCount();
  setActiveTab();

  if (state.view === "practice") renderPractice();
  if (state.view === "wrongbook") renderWrongbook();
  if (state.view === "parent") renderParent();
  if (state.view === "library") renderLibrary();
}

document.addEventListener("click", (event) => {
  const chapterButton = event.target.closest("[data-chapter]");
  if (chapterButton && chapterButton.classList.contains("chapter-button")) {
    state.selectedChapter = chapterButton.dataset.chapter;
    saveSettings();
    render();
    return;
  }

  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    state.view = viewButton.dataset.view;
    render();
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.action;
  if (action === "select-all-chapters") {
    state.selectedChapter = "all";
    saveSettings();
    render();
  }
  if (action === "generate") {
    createPractice();
  }
  if (action === "print") {
    window.print();
  }
  if (action === "show-hint") {
    const question = currentQuestion();
    state.visibleHints = Math.min((question?.hints.length ?? 0), state.visibleHints + 1);
    render();
  }
  if (action === "show-answer") {
    state.revealedAnswer = !state.revealedAnswer;
    render();
  }
  if (action === "mark-correct") {
    addHistory("correct");
    nextQuestion();
  }
  if (action === "mark-needs") {
    addHistory("needs");
    addWrong();
    nextQuestion();
  }
  if (action === "add-wrong") {
    addWrong();
    state.view = "wrongbook";
    render();
  }
  if (action === "prev-question") {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      state.revealedAnswer = false;
      state.visibleHints = 0;
      render();
    }
  }
  if (action === "next-question") {
    nextQuestion();
  }
  if (action === "remove-wrong") {
    removeWrong(actionButton.dataset.wrong);
    render();
  }
  if (action === "clear-wrongs") {
    saveWrongs([]);
    render();
  }
  if (action === "practice-similar") {
    const question = generateFromTemplate(actionButton.dataset.template);
    if (question) {
      state.questions = [question];
      state.currentIndex = 0;
      state.revealedAnswer = false;
      state.visibleHints = 0;
      state.view = "practice";
      render();
    }
  }
  if (action === "practice-weak") {
    state.selectedChapter = actionButton.dataset.chapter;
    state.selectedLevel = "thinking";
    state.selectedCount = 5;
    createPractice();
  }
  if (action === "clear-history") {
    saveHistory([]);
    render();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "userAnswer") {
    const question = currentQuestion();
    if (question) question.userAnswer = event.target.value;
  }
});

levelSelect.addEventListener("change", () => {
  state.selectedLevel = levelSelect.value;
  saveSettings();
  renderSessionStats();
});

countSelect.addEventListener("change", () => {
  state.selectedCount = Number(countSelect.value);
  saveSettings();
  renderSessionStats();
});

function nextQuestion() {
  if (state.questions.length === 0) return;
  state.currentIndex = (state.currentIndex + 1) % state.questions.length;
  state.revealedAnswer = false;
  state.visibleHints = 0;
  render();
}

function boot() {
  const settings = getSettings();
  state.selectedChapter = settings.selectedChapter ?? "all";
  state.selectedLevel = settings.selectedLevel ?? "thinking";
  state.selectedCount = Number(settings.selectedCount ?? 8);
  state.questions = generatePractice({
    chapterId: state.selectedChapter,
    level: state.selectedLevel,
    count: state.selectedCount
  });
  render();
}

boot();
