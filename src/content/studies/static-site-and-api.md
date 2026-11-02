---
title: "블로그와 웹 시연을 정적 사이트로 시작하는 이유"
description: "GitHub Pages에 글과 화면을 두고, 서버가 필요한 기능은 나중에 API로 연결하는 구조를 정리한다."
date: 2026-11-02
tags: ["웹", "설계"]
draft: false
---

## 지금 필요한 것부터 나누기

이 사이트의 첫 목적은 스터디 글을 읽고, 프로젝트를 살펴보고, 브라우저에서 구현을 체험할 수 있게 하는 것이다. 글을 보여주는 일에는 항상 실행 중인 백엔드나 데이터베이스가 필요하지 않다.

그래서 첫 버전은 Markdown 글을 빌드할 때 HTML로 변환하는 Astro 정적 사이트로 구성했다. GitHub Pages는 생성된 HTML·CSS·JavaScript를 제공한다. 현재 사이트에는 로그인, 서버 저장, 실제 AI 호출 기능이 없다.

## Markdown에서 공개 페이지까지

공개 글은 `src/content/studies/`의 Markdown 파일로 작성한다. 제목·설명·날짜·태그·초안 여부를 frontmatter에 기록하면 목록과 본문 페이지가 생성된다.

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

## 화면과 백엔드를 분리하면

나중에 서버가 필요한 기능을 만들면 브라우저 화면에서 별도 HTTPS API를 호출할 수 있다.

```text
방문자 → GitHub Pages의 화면
                  ↓ HTTPS 요청
             별도 백엔드 API → 데이터 저장소
```

GitHub Pages에서는 서버 프로그램이나 데이터베이스를 실행하지 않는다. 서버 구현은 AWS, Google Cloud 등의 별도 실행 환경에 배포하는 후속 과제다. 현재 모의 시연에 실제 API가 연결된 것은 아니다.

다른 출처의 API를 브라우저에서 호출하려면 서버의 CORS 정책을 맞춰야 한다. CORS는 API 인증을 대신하지 않는다. 비밀키와 DB 접속정보는 브라우저 코드에 포함하지 않고 서버에서 관리한다.

## 글·프로젝트·코드를 서로 연결하기

글은 문제와 선택의 이유를 설명한다. 프로젝트 페이지는 구현 범위와 검증 상태를 보여준다. 공개 GitHub 링크는 방문자가 코드를 읽고 실행 방법을 확인하는 입구다.

웹 시연 코드와 실제 시스템 소스의 범위는 구분해서 소개한다. 예를 들어 Slack–Codex 프로젝트의 브라우저 시연을 공개했다고 해서 내부 연동 브리지 전체를 공개한 것은 아니다.

## 다음에 검증할 것

첫 실제 API를 붙일 때는 정상 응답뿐 아니라 로딩, 오류, 지연, 서버가 응답하지 않는 상황도 화면에서 확인해야 한다. 공개 호출이 비용을 만드는 경우에는 사용량과 호출 한도를 함께 설계한다.

서비스를 추가하기 전에, “이 기능에 정말 서버가 필요한가?”부터 확인하는 습관을 가져가려 한다.

## 참고 자료

- [Astro Content collections](https://docs.astro.build/en/guides/content-collections/)
- [GitHub Pages 소개](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [MDN CORS 설명](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
