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
  visibleHints: 0,
  printTime: new Date().toISOString()
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

const COLOR_MAP = {
  红: "#ef4444",
  黄: "#facc15",
  蓝: "#3b82f6",
  绿: "#22c55e",
  紫: "#8b5cf6",
  橙: "#fb923c",
  粉: "#ec4899"
};

const PLACE_COLORS = ["#6366f1", "#f97316", "#14b8a6", "#ec4899"];

function extractNumbers(text) {
  return [...String(text).matchAll(/\d+/g)].map((match) => Number(match[0]));
}

function colorValue(name, fallback = "#94a3b8") {
  return COLOR_MAP[name] ?? fallback;
}

function inferVisual(question) {
  const text = question.question;
  const nums = extractNumbers(text);

  const clockMatch = text.match(/时针刚过(\d+)，分针指向(\d+)/);
  if (clockMatch) {
    const hour = Number(clockMatch[1]);
    const minuteMark = Number(clockMatch[2]);
    return {
      type: "clock",
      hour,
      minute: minuteMark === 12 ? 0 : minuteMark * 5,
      label: "彩色钟面"
    };
  }

  const cycleMatch = text.match(/按“([^”]+)”/);
  if (cycleMatch) {
    return {
      type: "color-cycle",
      cycle: cycleMatch[1].split("、"),
      index: nums.at(-1),
      label: "颜色循环"
    };
  }

  if (question.chapterId === "remainder" || question.templateId === "review-open-reason") {
    return {
      type: "grouping",
      total: nums[0],
      groupSize: nums[1],
      label: "分组盒"
    };
  }

  if (question.chapterId === "numbers") {
    const number = nums.find((item) => item >= 100 && item <= 9999);
    return {
      type: "place-value",
      number,
      digits: number ? String(number).padStart(4, "0").split("") : [],
      label: "数位彩车"
    };
  }

  if (question.chapterId === "addsub" || question.templateId === "review-number-shopping") {
    return {
      type: "shopping",
      prices: nums.filter((item) => item >= 10).slice(0, 4),
      label: "彩色小票"
    };
  }

  if (question.chapterId === "time" || question.templateId === "review-route-plan" || question.templateId === "review-time-remainder") {
    return {
      type: "timeline",
      segments: nums.filter((item) => item > 0 && item <= 80).slice(0, 4),
      label: "时间路线"
    };
  }

  if (question.chapterId === "relations") {
    return {
      type: "bar-model",
      values: nums.slice(0, 4),
      label: "关系图"
    };
  }

  if (question.chapterId === "comics") {
    return {
      type: "story",
      values: nums.slice(0, 4),
      label: "故事分镜"
    };
  }

  return {
    type: "mission",
    label: "数学任务"
  };
}

function renderQuestionVisual(question, mode = "screen") {
  const visual = question.visual ?? inferVisual(question);
  const compact = mode === "print" ? " is-compact" : "";
  const renderer = {
    clock: renderClockVisual,
    "color-cycle": renderColorCycleVisual,
    grouping: renderGroupingVisual,
    "place-value": renderPlaceValueVisual,
    shopping: renderShoppingVisual,
    timeline: renderTimelineVisual,
    "bar-model": renderBarModelVisual,
    "number-line": renderNumberLineVisual,
    "choice-board": renderChoiceBoardVisual,
    "ticket-grid": renderTicketGridVisual,
    abacus: renderAbacusVisual,
    story: renderStoryVisual,
    mission: renderMissionVisual
  }[visual.type] ?? renderMissionVisual;

  return `<div class="math-scene${compact}">${renderer(visual, question, mode)}</div>`;
}

function renderSceneLabel(visual, question) {
  return `
    <div class="scene-label">
      <span>${escapeHtml(visual.label ?? "数学任务")}</span>
      <strong>${escapeHtml(question.title)}</strong>
    </div>
  `;
}

function renderClockVisual(visual, question) {
  const hour = Number(visual.hour ?? 8);
  const minute = Number(visual.minute ?? 0);
  const minuteAngle = minute * 6 - 90;
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;
  const minuteX = 60 + 42 * Math.cos((minuteAngle * Math.PI) / 180);
  const minuteY = 60 + 42 * Math.sin((minuteAngle * Math.PI) / 180);
  const hourX = 60 + 30 * Math.cos((hourAngle * Math.PI) / 180);
  const hourY = 60 + 30 * Math.sin((hourAngle * Math.PI) / 180);
  const ticks = Array.from({ length: 12 }, (_, index) => {
    const n = index + 1;
    const angle = n * 30 - 90;
    const x = 60 + 48 * Math.cos((angle * Math.PI) / 180);
    const y = 60 + 48 * Math.sin((angle * Math.PI) / 180);
    return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}">${n}</text>`;
  }).join("");

  return `
    ${renderSceneLabel(visual, question)}
    <div class="clock-scene">
      <svg class="clock-svg" viewBox="0 0 120 120" role="img" aria-label="钟面图">
        <circle cx="60" cy="60" r="56" class="clock-face" />
        <circle cx="60" cy="60" r="48" class="clock-ring" />
        <g class="clock-numbers">${ticks}</g>
        <line x1="60" y1="60" x2="${hourX.toFixed(1)}" y2="${hourY.toFixed(1)}" class="hour-hand" />
        <line x1="60" y1="60" x2="${minuteX.toFixed(1)}" y2="${minuteY.toFixed(1)}" class="minute-hand" />
        <circle cx="60" cy="60" r="4" class="clock-pin" />
      </svg>
      <div class="scene-note">
        <span class="color-key teal">时针</span>
        <span class="color-key coral">分针</span>
        <p>先看短短的时针，再看长长的分针。</p>
      </div>
    </div>
  `;
}

function renderColorCycleVisual(visual, question) {
  const cycle = visual.cycle?.length ? visual.cycle : ["红", "黄", "蓝"];
  const bulbs = [...cycle, ...cycle].map((name, index) => {
    const color = colorValue(name);
    return `<span class="cycle-bulb" style="--bulb:${color}"><i>${escapeHtml(name)}</i><em>${index + 1}</em></span>`;
  }).join("");

  return `
    ${renderSceneLabel(visual, question)}
    <div class="cycle-scene">
      <div class="cycle-strip">${bulbs}</div>
      <div class="target-badge">找第 ${escapeHtml(visual.index ?? "?")} 盏</div>
    </div>
  `;
}

function renderGroupingVisual(visual, question) {
  const total = Number(visual.total ?? 24);
  const groupSize = Math.max(2, Number(visual.groupSize ?? 5));
  const fullGroups = Math.min(5, Math.floor(total / groupSize));
  const remainder = total % groupSize;
  const boxes = Array.from({ length: fullGroups }, (_, boxIndex) => `
    <div class="group-box">
      <span>第${boxIndex + 1}组</span>
      <div>${Array.from({ length: Math.min(groupSize, 8) }, (_, index) => `<i style="--dot:${PLACE_COLORS[index % PLACE_COLORS.length]}"></i>`).join("")}</div>
    </div>
  `).join("");
  const remainderDots = Array.from({ length: Math.min(remainder, 8) }, (_, index) => `<i style="--dot:${COLOR_MAP.橙}"></i>`).join("");

  return `
    ${renderSceneLabel(visual, question)}
    <div class="grouping-scene">
      ${boxes}
      <div class="group-box remainder-box">
        <span>剩下</span>
        <div>${remainderDots || "<b>正好分完</b>"}</div>
      </div>
    </div>
  `;
}

function renderPlaceValueVisual(visual, question) {
  const number = visual.number;
  const digits = visual.digits?.length ? visual.digits : String(number ?? "0000").padStart(4, "0").slice(-4).split("");
  const labels = ["千位", "百位", "十位", "个位"];
  return `
    ${renderSceneLabel(visual, question)}
    <div class="place-scene">
      ${labels.map((label, index) => `
        <div class="place-car" style="--place:${PLACE_COLORS[index]}">
          <span>${label}</span>
          <strong>${escapeHtml(digits[index] ?? "□")}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderShoppingVisual(visual, question) {
  const prices = visual.prices?.length ? visual.prices : extractNumbers(question.question).filter((item) => item >= 10).slice(0, 3);
  const items = visual.items?.length
    ? visual.items
    : prices.map((price, index) => ({ name: `物品${index + 1}`, price, color: ["粉", "蓝", "黄", "绿"][index % 4] }));
  return `
    ${renderSceneLabel(visual, question)}
    <div class="shopping-scene">
      <div class="receipt">
        <strong>彩色小票</strong>
        ${items.map((item) => `<p><span><i style="--tag:${colorValue(item.color)}"></i>${escapeHtml(item.name)}</span><b>${escapeHtml(item.price)}元</b></p>`).join("")}
      </div>
      <div class="coin-stack">
        <span>100</span><span>50</span><span>10</span>
      </div>
    </div>
  `;
}

function renderTimelineVisual(visual, question) {
  const segments = visual.segments?.length ? visual.segments : [10, 20, 15];
  return `
    ${renderSceneLabel(visual, question)}
    <div class="timeline-scene">
      ${segments.map((minutes, index) => `
        <div class="time-block" style="--time:${PLACE_COLORS[index % PLACE_COLORS.length]}">
          <span>${index + 1}</span>
          <strong>${minutes}分</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderBarModelVisual(visual, question) {
  const values = visual.values?.length ? visual.values : [1, 2, 3];
  return `
    ${renderSceneLabel(visual, question)}
    <div class="bar-scene">
      ${values.slice(0, 3).map((value, index) => `
        <div class="relation-row">
          <span>数量${index + 1}</span>
          <div style="--bar:${PLACE_COLORS[index % PLACE_COLORS.length]}; width:${Math.min(92, 36 + value * 7)}%"></div>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderNumberLineVisual(visual, question) {
  const start = Number(visual.start ?? 0);
  const end = Number(visual.end ?? 100);
  const marker = Number(visual.marker ?? Math.round((start + end) / 2));
  const percent = Math.max(6, Math.min(94, ((marker - start) / (end - start || 1)) * 100));
  return `
    ${renderSceneLabel(visual, question)}
    <div class="numberline-scene">
      <div class="numberline-track">
        <span>${escapeHtml(start)}</span>
        <i style="left:${percent}%"></i>
        <span>${escapeHtml(end)}</span>
      </div>
      <div class="numberline-marker" style="left:${percent}%">${escapeHtml(marker)}</div>
    </div>
  `;
}

function renderChoiceBoardVisual(visual, question) {
  const cards = visual.cards?.length ? visual.cards : ["A", "B", "C", "D"].map((label) => ({ label, text: "?" }));
  return `
    ${renderSceneLabel(visual, question)}
    <div class="choice-board">
      ${cards.map((card, index) => `
        <div class="choice-card" style="--choice:${PLACE_COLORS[index % PLACE_COLORS.length]}">
          <span>${escapeHtml(card.label)}</span>
          <strong>${escapeHtml(card.text)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderTicketGridVisual(visual, question) {
  const rows = Math.max(1, Number(visual.rows ?? 3));
  const cols = Math.max(1, Number(visual.cols ?? 4));
  const filled = Math.min(rows * cols, Number(visual.filled ?? rows * cols));
  return `
    ${renderSceneLabel(visual, question)}
    <div class="ticket-grid" style="--cols:${cols}">
      ${Array.from({ length: rows * cols }, (_, index) => `<span class="${index < filled ? "is-filled" : ""}">${index + 1}</span>`).join("")}
    </div>
  `;
}

function renderAbacusVisual(visual, question) {
  const digits = visual.digits?.length ? visual.digits : ["0", "0", "0", "0"];
  const labels = ["千", "百", "十", "个"];
  return `
    ${renderSceneLabel(visual, question)}
    <div class="abacus-scene">
      ${digits.map((digit, index) => `
        <div class="abacus-rod" style="--rod:${PLACE_COLORS[index % PLACE_COLORS.length]}">
          <span>${labels[index]}</span>
          <div>${Array.from({ length: Number(digit) || 0 }, () => "<i></i>").join("")}</div>
          <strong>${escapeHtml(digit)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderStoryVisual(visual, question) {
  const values = visual.values?.length ? visual.values : [1, 2, 3];
  return `
    ${renderSceneLabel(visual, question)}
    <div class="story-scene">
      ${[0, 1, 2].map((index) => `
        <div class="story-frame">
          <span>图${index + 1}</span>
          <strong>${escapeHtml(values[index] ?? "?")}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderMissionVisual(visual, question) {
  return `
    ${renderSceneLabel(visual, question)}
    <div class="mission-scene">
      <span>观察</span>
      <span>画图</span>
      <span>计算</span>
      <span>说明</span>
    </div>
  `;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatPrintTime(value) {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(new Date(value));
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.year}-${byType.month}-${byType.day} ${byType.hour}:${byType.minute}`;
}

function currentChapterName() {
  return state.selectedChapter === "all" ? "全部单元" : getChapter(state.selectedChapter)?.title ?? "练习";
}

function makeWorksheetTitle() {
  return `${currentChapterName()}｜${levelLabel(state.selectedLevel)}｜${state.questions.length || state.selectedCount}题`;
}

function makePrintDocumentTitle() {
  return `二年级数学_${currentChapterName()}_${levelLabel(state.selectedLevel)}_${formatPrintTime(state.printTime).replaceAll(":", "-").replace(" ", "_")}`;
}

function needsWrittenWork(question) {
  const text = `${question.title} ${question.skill} ${question.question}`;
  const compactPatterns = ["选", "填", "口算", "比较大小", "排序", "读写", "换算", "可能是", "是多少？", "是多少?"];
  const workPatterns = ["解决", "应用", "思维", "解释", "说明", "理由", "规划", "综合", "开放", "提出", "反推", "纠错", "至少", "来得及", "够不够", "还剩", "找回", "多用", "相差"];
  if (workPatterns.some((pattern) => text.includes(pattern))) return true;
  if (question.level === "thinking" || question.level === "mixed") {
    return !compactPatterns.some((pattern) => text.includes(pattern));
  }
  return false;
}

function shouldPrintVisual(question) {
  const visualType = (question.visual ?? inferVisual(question)).type;
  const usefulTypes = ["clock", "color-cycle", "grouping", "place-value", "shopping", "timeline", "number-line", "choice-board", "ticket-grid", "abacus", "story"];
  return usefulTypes.includes(visualType);
}

const EXAM_SECTION_TITLES = {
  fill: "填一填",
  choice: "选一选",
  time: "写时间 / 按要求做",
  calc: "算一算",
  solve: "解决问题",
  bonus: "附加题"
};

const CHINESE_SECTION_NUMBERS = ["一", "二", "三", "四", "五", "六", "七"];

function worksheetSectionFor(question) {
  const text = `${question.title} ${question.skill} ${question.question}`;
  const visualType = (question.visual ?? inferVisual(question)).type;

  if (text.includes("数独") || text.includes("附加") || text.includes("反推") || text.includes("逻辑推理")) {
    return "bonus";
  }

  if (text.includes("选择") || text.includes("选") || text.includes("哪种") || text.includes("哪一个") || text.includes("正确的是") || /A[.．]/.test(text)) {
    return "choice";
  }

  if (text.includes("画") || text.includes("圈") || text.includes("连") || text.includes("钟面") || visualType === "clock" || visualType === "abacus" || visualType === "ticket-grid") {
    return "time";
  }

  if (text.includes("计算") || text.includes("验算") || text.includes("算一算") || text.includes("口算") || /[+\-×÷]/.test(question.title)) {
    return "calc";
  }

  if (needsWrittenWork(question)) {
    return "solve";
  }

  return "fill";
}

function groupWorksheetQuestions() {
  const groups = {
    fill: [],
    choice: [],
    time: [],
    calc: [],
    solve: [],
    bonus: []
  };

  state.questions.forEach((question) => {
    groups[worksheetSectionFor(question)].push(question);
  });

  return Object.entries(groups)
    .filter(([, questions]) => questions.length > 0)
    .map(([id, questions], index) => ({
      id,
      title: `${CHINESE_SECTION_NUMBERS[index]}、${EXAM_SECTION_TITLES[id]}。`,
      questions
    }));
}

function sectionScore(section) {
  const points = {
    fill: 2,
    choice: 2,
    time: 4,
    calc: 4,
    solve: 6,
    bonus: 10
  }[section.id] ?? 4;
  return section.id === "bonus" ? 10 : section.questions.length * points;
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
  state.printTime = new Date().toISOString();
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

        ${renderQuestionVisual(question)}

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
  const worksheetTitle = makeWorksheetTitle();
  const printTime = formatPrintTime(state.printTime);
  return `
    <section class="worksheet-list">
      <div class="worksheet-title">
        <div>
          <h3>${escapeHtml(worksheetTitle)}</h3>
          <p>打印时间：${escapeHtml(printTime)}</p>
        </div>
        <span>姓名：__________</span>
      </div>
      ${state.questions
        .map(
          (question, index) => {
            const hasWorkBox = needsWrittenWork(question);
            const hasVisual = shouldPrintVisual(question);
            return `
            <div class="mini-question ${hasWorkBox ? "needs-work" : "compact-work"}">
              <span class="mini-index">${index + 1}</span>
              <div>
                <p><strong>${escapeHtml(question.chapterName)}｜${escapeHtml(question.skill)}</strong></p>
                ${hasVisual ? renderQuestionVisual(question, "print") : ""}
                <p>${escapeHtml(question.question)}</p>
                ${hasWorkBox ? `<div class="answer-space ${question.level === "thinking" || question.level === "mixed" ? "is-large" : ""}" aria-label="答题区域">
                  <span>答：</span>
                  <div class="answer-frame"></div>
                </div>` : ""}
              </div>
            </div>
          `;
          }
        )
        .join("")}
    </section>
  `;
}

function renderWorksheetList() {
  const worksheetTitle = makeWorksheetTitle();
  const printTime = formatPrintTime(state.printTime);
  const sections = groupWorksheetQuestions();
  const normalScore = sections
    .filter((section) => section.id !== "bonus")
    .reduce((total, section) => total + sectionScore(section), 0);
  const bonusScore = sections.some((section) => section.id === "bonus") ? 10 : 0;

  return `
    <section class="worksheet-list exam-paper">
      <div class="worksheet-title exam-title">
        <div>
          <h3>${escapeHtml(worksheetTitle)}</h3>
          <p>考试时间：40分钟　满分：${normalScore}${bonusScore ? `+${bonusScore}` : ""}分　打印时间：${escapeHtml(printTime)}</p>
        </div>
        <span>姓名：_________</span>
      </div>
      <table class="score-table" aria-label="得分表">
        <tbody>
          <tr>
            <th>题序</th>
            ${sections.map((section, index) => `<td>${CHINESE_SECTION_NUMBERS[index]}</td>`).join("")}
            <td>总分</td>
          </tr>
          <tr>
            <th>得分</th>
            ${sections.map(() => "<td></td>").join("")}
            <td></td>
          </tr>
        </tbody>
      </table>
      <div class="exam-columns">
        ${sections.map(renderExamSection).join("")}
      </div>
    </section>
  `;
}

function renderExamSection(section) {
  const score = sectionScore(section);
  return `
    <section class="exam-section exam-section-${section.id}">
      <h4>${escapeHtml(section.title)}<span>（共${score}分）</span></h4>
      ${section.questions.map((question, index) => renderExamQuestion(question, index + 1, section.id)).join("")}
    </section>
  `;
}

function renderExamQuestion(question, index, sectionId) {
  const hasWorkBox = needsWrittenWork(question) && (sectionId === "solve" || sectionId === "bonus");
  const hasVisual = shouldPrintVisual(question);
  return `
    <div class="mini-question exam-question ${hasWorkBox ? "needs-work" : "compact-work"} ${hasVisual ? "has-visual" : ""}">
      <span class="mini-index">${index}.</span>
      <div class="exam-question-body">
        <p class="exam-skill">${escapeHtml(question.skill)}</p>
        <p class="exam-question-text">${escapeHtml(question.question)}</p>
        ${hasVisual ? renderQuestionVisual(question, "print") : ""}
        ${hasWorkBox ? `<div class="answer-space ${question.level === "thinking" || question.level === "mixed" ? "is-large" : ""}" aria-label="答题区域">
          <span>答：</span>
          <div class="answer-frame"></div>
        </div>` : renderCompactBlank(sectionId)}
      </div>
    </div>
  `;
}

function renderCompactBlank(sectionId) {
  if (sectionId === "choice") return "";
  if (sectionId === "calc") return `<div class="compact-lines"><span></span><span></span></div>`;
  if (sectionId === "time") return `<div class="compact-answer-row">____时____分　　____:____</div>`;
  return "";
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
    state.printTime = new Date().toISOString();
    document.title = makePrintDocumentTitle();
    render();
    requestAnimationFrame(() => window.print());
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
