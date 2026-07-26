const form = document.querySelector("#plannerForm");
const output = document.querySelector("#output");
const aiStatus = document.querySelector("#aiStatus");
const planSubtitle = document.querySelector("#planSubtitle");
const copyBtn = document.querySelector("#copyBtn");
const sampleBtn = document.querySelector("#sampleBtn");
const clearBtn = document.querySelector("#clearBtn");
const deadlineInput = document.querySelector("#deadline");
const todayLabel = document.querySelector("#todayLabel");

let latestPlan = "";

const defaultDeadline = new Date("2026-07-27T23:59:00");
deadlineInput.value = toLocalInputValue(defaultDeadline);
todayLabel.textContent = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit"
}).format(new Date());

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  setStatus("Building plan...", "loading");
  output.innerHTML = `<div class="empty-state"><strong>Thinking through the safest order...</strong><span>This usually takes a few seconds.</span></div>`;

  try {
    const response = await fetch("/api/ai-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("AI endpoint unavailable");

    const result = await response.json();
    latestPlan = result.plan || createLocalPlan(data);
    renderPlan(latestPlan);
    setStatus(result.usedAI ? "AI generated" : "Smart fallback", result.usedAI ? "" : "error");
  } catch (error) {
    latestPlan = createLocalPlan(data);
    renderPlan(latestPlan);
    setStatus("Smart fallback", "error");
  }
});

copyBtn.addEventListener("click", async () => {
  if (!latestPlan) return;
  await navigator.clipboard.writeText(latestPlan);
  planSubtitle.textContent = "Copied to clipboard.";
});

sampleBtn.addEventListener("click", () => {
  document.querySelector("#title").value = "Final Project - Ship Your AI App";
  document.querySelector("#description").value = "Build a complete AI-powered app, deploy it live, publish the code on GitHub, and write an excellent README with screenshots.";
  document.querySelector("#hours").value = "14";
  document.querySelector("#progress").value = "Some notes";
  document.querySelector("#energy").value = "Medium";
  document.querySelector("#worry").value = "Choosing a small enough idea and proving it works";
  deadlineInput.value = toLocalInputValue(defaultDeadline);
  planSubtitle.textContent = "Sample project loaded.";
});

clearBtn.addEventListener("click", () => {
  latestPlan = "";
  output.innerHTML = `<div class="empty-state"><strong>No plan yet</strong><span>Fill the form and generate a plan. You can edit the details anytime.</span></div>`;
  planSubtitle.textContent = "Your plan will appear here.";
  setStatus("AI ready", "");
});

function setStatus(message, state) {
  aiStatus.textContent = message;
  aiStatus.className = `status-pill ${state || ""}`.trim();
}

function renderPlan(plan) {
  output.innerHTML = `<div class="plan-content">${markdownLite(plan)}</div>`;
  planSubtitle.textContent = "Built from your deadline, time, progress, and worry.";
}

function markdownLite(text) {
  const html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .split("\n")
    .map((line) => {
      if (line.startsWith("## ")) return `<h4>${line.slice(3)}</h4>`;
      if (line.startsWith("- ")) return `<li>${line.slice(2)}</li>`;
      if (!line.trim()) return "";
      return `<p>${line}</p>`;
    })
    .join("");

  return html.replace(/(<li>.*?<\/li>)+/g, (match) => `<ul>${match}</ul>`);
}

function createLocalPlan(data) {
  const hours = Number(data.hours || 10);
  const buildHours = Math.max(2, Math.round(hours * 0.42));
  const aiHours = Math.max(1, Math.round(hours * 0.18));
  const readmeHours = Math.max(1, Math.round(hours * 0.2));
  const deployHours = Math.max(1, hours - buildHours - aiHours - readmeHours);

  return `## Rescue Summary
- Main goal: finish "${data.title}" before ${formatDeadline(data.deadline)} ${data.timezone}.
- Current state: ${data.progress}; energy level: ${data.energy}.
- Biggest risk: ${data.worry || "running out of time"}.

## Work Order
- Build the smallest complete version first: input screen, saved output, and a clear result page.
- Spend about ${buildHours} hours on the core app experience.
- Spend about ${aiHours} hours on the AI feature and write the exact system prompt in the README.
- Spend about ${deployHours} hours deploying, testing the public link, and fixing obvious issues.
- Spend about ${readmeHours} hours on screenshots and the report-style README.

## AI Feature Plan
- Ask the AI to act like a strict but kind project coach for students.
- Give it the assignment, deadline, available hours, progress, and worry.
- Require it to return priorities, a schedule, risks, and a final submission checklist.

## Final Checklist
- Public GitHub repository opens in an incognito window.
- Live app URL opens without login.
- README includes name, problem, features, AI prompt, tools, screenshots, and run steps.
- No API keys are committed.
- Submit only the public GitHub repository link.`;
}

function toLocalInputValue(date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

function formatDeadline(value) {
  if (!value) return "your deadline";
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}
