const fs = require("node:fs");
const assert = require("node:assert/strict");
const html = fs.readFileSync("index.html", "utf8");
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
assert.equal(scripts.length, 2, "Expected main app and Today bridge scripts");
scripts.forEach((source, i) => assert.doesNotThrow(() => new Function(source), "Script " + i + " must parse"));
const bankStart = html.indexOf("const pcmDetailedBank=");
const bankEnd = html.indexOf("\n};\nObject.keys(pcmSupplementBank)", bankStart);
assert.ok(bankStart >= 0 && bankEnd > bankStart, "PCM lesson bank must be present");
const bankDeclaration = html.slice(bankStart, bankEnd + 3);
const pcmBank = new Function(bankDeclaration + "; return pcmDetailedBank;")();
for (const [subject, chapters] of Object.entries(pcmBank)) {
  assert.ok(Object.keys(chapters).length > 0, subject + " must have chapters");
  for (const [chapter, lesson] of Object.entries(chapters)) {
    assert.ok(lesson.c && lesson.c.length > 40, subject + "/" + chapter + " needs a concept");
    assert.ok(Array.isArray(lesson.f) && lesson.f.length, subject + "/" + chapter + " needs formulas/key points");
    assert.ok(Array.isArray(lesson.e) && lesson.e.length, subject + "/" + chapter + " needs worked examples");
    assert.ok(Array.isArray(lesson.q) && lesson.q.length, subject + "/" + chapter + " needs practice");
  }
}
const bridgeMarker = html.indexOf("<!-- NEXORA_TODAY_COURSE_BRIDGE_START");
const bridgeStart = html.indexOf("(function(){", bridgeMarker);
const bridgeEnd = html.indexOf("})();", bridgeStart) + 5;
assert.ok(bridgeMarker >= 0 && bridgeStart >= 0 && bridgeEnd > bridgeStart, "Today bridge must be present");
const bridgeSource = html.slice(bridgeStart, bridgeEnd);
const elements = { todayTasks: { innerHTML: "" }, todayProgress: { style: {} }, todayProgressText: { textContent: "" } };
const documentMock = { readyState: "complete", getElementById: id => elements[id] || null, addEventListener() {} };
const windowMock = {};
const profileProvider = () => ({ goalKey: "competitive", exam: "JEE Main", currentSubject: "Physics", currentTopic: "Kinematics", time: 60, weak: "Physics" });
const subjectProvider = () => ["Physics", "Chemistry", "Mathematics"];
const dayProvider = () => 1;
const mutationObserverMock = function () { this.observe = () => {}; };
const factorySource = "const profile = () => profileProvider();\n" +
  "const subjects = () => subjectProvider();\n" +
  "const userData = () => ({ tasks: {}, sessions: [] });\n" +
  "const cycleDay = () => dayProvider();\n" +
  "const minutes = () => 60;\n" +
  "const knowledgeBank = {};\nconst saveState = () => {};\nconst completeStudyTask = () => {};\nconst setTimer = () => {};\n" +
  bankDeclaration + "\nwindow.nexoraPCMContent = pcmDetailedBank;\n" + bridgeSource + "\nreturn window.nexoraTodayCourseBridge;";
const todayFactory = new Function("window", "document", "MutationObserver", "setTimeout", "profileProvider", "subjectProvider", "dayProvider", factorySource);
const bridge = todayFactory(windowMock, documentMock, mutationObserverMock, () => {}, profileProvider, subjectProvider, dayProvider);
assert.ok(bridge && typeof bridge.buildTodayTasks === "function", "Today bridge must initialize");
const tasks = bridge.buildTodayTasks();
assert.equal(tasks.length, 3, "JEE profile should produce Physics, Chemistry, Mathematics tasks");
for (const task of tasks) {
  assert.ok(task.lesson, task.subject + " must have a lesson");
  assert.equal(task.lesson.detailLevel, "chapter-specific", task.subject + "/" + task.topic + " must resolve a chapter lesson");
  assert.ok(task.lesson.concept && task.lesson.concept.length > 40, task.subject + "/" + task.topic + " needs a substantive concept");
  assert.ok(task.lesson.practice && task.lesson.practice.length, task.subject + "/" + task.topic + " needs practice");
  assert.ok(!task.lesson.concept.includes("does not yet have a verified chapter-specific lesson"), task.subject + "/" + task.topic + " must not show the missing-lesson fallback");
  assert.ok(!(task.lesson.formulas || []).some(x => String(x).includes("copy the exact formula")), task.subject + "/" + task.topic + " must not show generic formula placeholders");
}
for (const [subject, topic] of [["Physics", "Newton's Laws"], ["Chemistry", "Atomic Structure"], ["Mathematics", "Sequences and Series"], ["Maths", "Quadratic Equations"]]) {
  const lesson = bridge.makePcmLesson(subject, topic);
  assert.ok(lesson && lesson.practice.length, "Alias/topic resolution must work for " + subject + "/" + topic);
}
const generatorStart = html.indexOf("function generateQuestions(){");
const generatorEnd = html.indexOf("\nwindow.generateQuestions=generateQuestions;", generatorStart);
const smallBankStart = html.indexOf("const bank={", 140000);
assert.ok(generatorStart > 0 && generatorEnd > generatorStart && smallBankStart > 0, "Question generator must exist");
const smallBankSource = html.slice(smallBankStart, generatorStart).trim();
const generatorSource = html.slice(generatorStart, generatorEnd);
function runGenerator(topic, subject, count) {
  const mock = { qTopic: { value: topic, focus() {} }, qSubject: { value: subject }, qCount: { value: String(count) }, qLevel: { value: "JEE Main" }, qStatus: { textContent: "" }, questions: { innerHTML: "" } };
  const window = { nexoraPCMContent: pcmBank };
  const source = "const $ = id => mock[id] || null;\n" +
    "const esc = s => String(s ?? \"\" ).replace(/[&<>]/g, c => ({\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\"}[c]));\n" +
    "const toast = x => { window.__toast = x; };\nconst updateUserData = fn => { window.__saved = fn({}); };\n" +
    smallBankSource + "\n" + generatorSource + "\nreturn generateQuestions;";
  new Function("window", "document", "Math", "mock", source)(window, { getElementById: id => mock[id] }, Math, mock)();
  return mock;
}
for (const [topic, subject, count] of [["Kinematics", "Physics", 5], ["Quadratic Equations", "Mathematics", 15], ["My completely new topic", "Chemistry", 10]]) {
  const mock = runGenerator(topic, subject, count);
  assert.equal((mock.questions.innerHTML.match(/class="question"/g) || []).length, count, topic + " should render requested question count");
  assert.ok(mock.qStatus.textContent.length, topic + " should report result");
}

const clickHandlerStart = html.indexOf('document.addEventListener("click",function(e){\n const btn=e.target&&e.target.closest?e.target.closest("#generateQuestionsBtn"):null;');
const clickHandlerEnd = html.indexOf('},true);', clickHandlerStart) + 7;
assert.ok(clickHandlerStart > 0 && clickHandlerEnd > clickHandlerStart, "Question Lab click handler must exist");
assert.match(html, /id="generateQuestionsBtn"[^>]*onclick="[^"]*window\\.generateQuestions/, "Generate button must have a direct inline fallback");
assert.match(html, /aria-label="Back to Today" onclick="closeStudySession\\(\\)">← Back/, "Lesson modal must provide a visible Back button");
assert.match(html, /\\.study-modal-head\\{position:sticky/, "Lesson header must stay visible while scrolling");
const clickHandlerSource = html.slice(clickHandlerStart, clickHandlerEnd);
const clickMock = {
  qTopic: { value: "Kinematics", focus() {} },
  qSubject: { value: "Physics" },
  qCount: { value: "5" },
  qLevel: { value: "JEE Main" },
  qStatus: { textContent: "" },
  questions: { innerHTML: "" }
};
const clickWindow = { nexoraPCMContent: pcmBank };
const clickHandlers = [];
const clickDocument = {
  getElementById: id => clickMock[id] || null,
  addEventListener: (name, fn) => { if (name === "click") clickHandlers.push(fn); }
};
const clickSource = "const $ = id => clickMock[id] || null;\n" +
  "const esc = s => String(s ?? \"\").replace(/[&<>]/g, c => ({\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\"}[c]));\n" +
  "const toast = x => { clickWindow.__toast = x; };\nconst updateUserData = fn => { clickWindow.__saved = fn({}); };\n" +
  smallBankSource + "\n" + generatorSource + "\nwindow.generateQuestions = generateQuestions;\n" + clickHandlerSource + "\nreturn window.generateQuestions;";
new Function("window", "document", "Math", "clickMock", "clickWindow", "clickHandlers", clickSource)(
  clickWindow, clickDocument, Math, clickMock, clickWindow, clickHandlers
);
assert.equal(clickHandlers.length, 1, "Question Lab should register one delegated click handler");
clickHandlers[0]({
  target: { closest: selector => selector === "#generateQuestionsBtn" ? { dataset: {} } : null },
  preventDefault() {}
});
assert.equal((clickMock.questions.innerHTML.match(/class="question"/g) || []).length, 5, "Clicking Generate Questions should render questions");
assert.ok(clickMock.qStatus.textContent.length, "Clicking Generate Questions should update status");

console.log("NEXORA regression checks passed: script syntax, PCM lesson bank, Today lesson resolution, and Question Lab click and generation.");
