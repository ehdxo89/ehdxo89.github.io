---
title: "GitHub Pages 구성과 서버 연동 계획"
description: "정적 사이트로 시작하고, 서버 기능은 별도 API로 연결."
date: 2026-11-02
tags: ["웹", "설계"]
draft: false
---

## 현재 구성

필요한 기능은 세 가지다. **학습 글, 웹 시연, GitHub 코드 연결.** 첫 버전은 Astro 정적 사이트로 구성했다.

Markdown을 HTML로 빌드하고 GitHub Pages에서 제공한다. 현재 로그인, 서버 저장, 실제 AI 호출 기능은 없다.

## 글 작성

글은 `src/content/studies/`에 Markdown으로 작성한다. 제목·설명·날짜·태그·초안 여부를 기록하면 목록과 본문이 생성된다.

```yaml
---
title: "학습한 주제"
description: "해결한 문제와 핵심 내용"
date: 2026-11-02
tags: ["웹"]
draft: true
---
```

작성 중에는 `draft: true`로 두고, 공개 준비가 끝나면 `false`로 바꾼다. 초안은 사이트 목록·본문·RSS에서 제외한다. **공개 저장소에 커밋된 원본은 초안 여부와 관계없이 읽을 수 있다.** 비공개 메모는 Notion이나 비공개 작업 저장소에 유지해야 한다.

## 서버 연동 계획

서버 기능이 필요하면 별도 HTTPS API를 연결한다.

```text
방문자 → GitHub Pages의 화면
                  ↓ HTTPS 요청
             별도 백엔드 API → 데이터 저장소
```

GitHub Pages는 서버 프로그램이나 DB를 실행하지 않는다. 백엔드는 별도 환경에 배포해야 한다. 현재 모의 시연에는 API 연결이 없다.

다른 출처의 API를 브라우저에서 호출하려면 서버의 CORS 정책을 맞춰야 한다. CORS는 API 인증을 대신하지 않는다. 비밀키와 DB 접속정보는 브라우저 코드에 포함하지 않고 서버에서 관리한다.

## 글·시연·코드 연결

글에는 문제와 결정 이유를 기록한다. 프로젝트 페이지에는 구현 범위와 검증 결과를 정리한다. 코드는 공개 GitHub 저장소에 연결한다.

웹 시연 코드와 실제 연동 소스는 구분한다. 현재 공개 대상은 모의 웹 시연 코드다. Slack–Codex 브리지 소스는 공개하지 않았다.

## 후속 검증

API 연결 후 정상 응답, 로딩, 오류, 지연, 무응답 상태를 검증한다. 호출 비용이 발생한다면 사용량과 한도도 정한다.

서버 도입 여부는 필요한 기능이 정해진 뒤 결정한다.

## 참고 자료

- [Astro Content collections](https://docs.astro.build/en/guides/content-collections/)
- [GitHub Pages 소개](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [MDN CORS 설명](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
