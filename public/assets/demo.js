"use strict";
(() => {
  const app = document.getElementById("demo-app");
  if (!app) return;
  const form = document.getElementById("demo-form");
  const request = document.getElementById("request");
  const scenario = document.getElementById("scenario");
  const error = document.getElementById("request-error");
  const next = document.getElementById("next");
  const steps = [...document.querySelectorAll(".stepper li")];
  const flows = {
    success: [
      ["요청을 접수합니다", "연결된 프로젝트의 스레드에서 요청을 시작합니다. 이 체험에서는 입력한 문장을 화면에만 표시합니다.", "예시 · 요청 접수"],
      ["프로젝트 맥락을 확인합니다", "프로젝트 지침과 기존 변경을 확인하고, 요청의 범위와 완료 조건을 정하는 단계를 보여줍니다.", "예시 · 맥락 확인"],
      ["구현하고 검증합니다", "요청한 기능을 구현하고 완료 조건에 따라 정상 동작과 오류 상황을 확인하는 예시입니다. 실제 구현이나 테스트를 실행한 결과는 아닙니다.", "예시 · 검증 통과"],
      ["결과를 같은 스레드에 남깁니다", "변경 내용, 검증 결과, 남은 항목을 보고합니다. 코드와 변경 이력은 GitHub, 과정과 결정은 Notion에 작업 범위에 맞게 정리합니다.", "예시 · 결과 보고"]
    ],
    failure: [
      ["요청을 접수합니다", "가상 요청에서 검증이 실패하는 경우를 살펴봅니다. 실제 작업을 시작하지 않습니다.", "예시 · 요청 접수"],
      ["완료 조건을 정합니다", "입력과 기대 결과, 정상·오류 상황의 확인 방법을 정하는 예시입니다.", "예시 · 맥락 확인"],
      ["검증 실패를 확인합니다", "기대 결과와 실제 결과가 다른 가상의 실패 사례입니다. 실패 조건을 기록하고 수정 대상으로 남깁니다.", "예시 · 검증 실패"],
      ["수정 후 재검증이 필요합니다", "실패를 완료로 처리하지 않습니다. 같은 조건으로 재검증하고 정상 동작에 영향이 없는지 확인한 뒤 실제 결과를 보고해야 합니다.", "예시 · 재검증 대기"]
    ]
  };
  let index = 0;
  let activeScenario = scenario.value;
  const render = () => {
    const [title, description, status] = flows[activeScenario][index];
    document.getElementById("step-title").textContent = title;
    document.getElementById("step-description").textContent = description;
    document.getElementById("step-status").textContent = status;
    document.getElementById("step-status").classList.toggle("warning", activeScenario === "failure" && index >= 2);
    document.getElementById("step-count").textContent = (index + 1) + " / 4";
    steps.forEach((step, n) => {
      step.classList.toggle("done", n < index);
      if (n === index) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });
    next.textContent = index === 3 ? "다시 체험하기 ↺" : "다음 단계 →";
  };
  const restart = () => {
    const text = request.value.trim();
    if (!text) {
      error.hidden = false;
      request.setAttribute("aria-invalid", "true");
      request.focus();
      return;
    }
    error.hidden = true;
    request.removeAttribute("aria-invalid");
    document.getElementById("request-preview").textContent = text;
    activeScenario = scenario.value;
    index = 0;
    render();
  };
  form.addEventListener("submit", event => { event.preventDefault(); restart(); });
  scenario.addEventListener("change", restart);
  request.addEventListener("input", () => {
    if (request.value.trim()) { error.hidden = true; request.removeAttribute("aria-invalid"); }
  });
  next.addEventListener("click", () => { index = (index + 1) % 4; render(); });
  document.getElementById("reset").addEventListener("click", restart);
  restart();
  app.hidden = false;
})();
