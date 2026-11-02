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
      ["요청 접수", "프로젝트 스레드에서 요청 접수. 입력한 문장은 이 화면에만 표시.", "예시 · 요청 접수"],
      ["프로젝트 확인", "프로젝트 지침과 기존 변경 확인. 작업 범위와 완료 조건 정의.", "예시 · 맥락 확인"],
      ["구현·검증", "구현 후 정상·오류 동작을 확인하는 예시. 실제 테스트 결과 아님.", "예시 · 검증 통과"],
      ["결과 보고", "같은 스레드에 변경 내용, 검증 결과, 남은 작업 보고. 코드는 GitHub, 과정은 Notion에 기록.", "예시 · 결과 보고"]
    ],
    failure: [
      ["요청 접수", "검증 실패 상황의 예시. 실제 작업 실행 없음.", "예시 · 요청 접수"],
      ["완료 조건 정의", "입력, 기대 결과, 정상·오류 조건 정의.", "예시 · 맥락 확인"],
      ["검증 실패", "기대 결과와 다른 결과 발생. 실패 조건 기록 후 수정 대상으로 분류.", "예시 · 검증 실패"],
      ["재검증 필요", "수정 후 같은 조건으로 재검증. 기존 동작도 확인한 뒤 결과 보고.", "예시 · 재검증 대기"]
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
    next.textContent = index === 3 ? "다시 시작 ↺" : "다음 단계 →";
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
