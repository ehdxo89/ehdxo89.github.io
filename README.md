# DEVLOG — 스터디와 웹 쇼케이스

공개 스터디 글, 프로젝트 소개, 브라우저 시연을 연결하는 개인 사이트입니다.

- 예정 운영 주소: https://ehdxo89.github.io/
- Astro 7.4.4, 정적 HTML 출력. Node 24 LTS 사용.
- 런타임 서버·DB·AI 호출은 없습니다.
- 첫 프로젝트의 Slack–Codex 체험은 브라우저 안에서 동작하는 모의 시연입니다. 실제 연동 브리지 소스나 실행 로그가 아닙니다.

## 개발과 검증

```sh
npm ci
npm run dev
npm run build
npm test
npm run preview
```

## 글 작성

1. `src/content/studies/`에 Markdown 파일을 추가합니다.
2. 제목·설명·날짜·태그·draft를 작성합니다. `writing-template.md`는 공개 가능한 작성 예시입니다.
3. `draft: false`인 글만 목록·본문·RSS로 생성됩니다.
4. 글과 프로젝트를 연결하려면 `project: slack-codex`를 지정합니다.
5. 빌드와 검증 후 main 변경을 게시하면 GitHub Actions가 Pages로 배포합니다.

공개 저장소에는 초안 파일도 보입니다. 비공개 메모·비밀값은 이 저장소에 넣지 않습니다. Markdown에 삽입하는 HTML도 공개 코드로 취급하고 검토합니다.

## 구성

- `src/layouts/`: 공통 탐색과 메타데이터
- `src/content/studies/`: 글 원본
- `src/pages/studies/`: 목록·검색·본문
- `src/pages/projects/`: 프로젝트 목록·상세·웹 시연
- `public/assets/demo.js`: Slack–Codex 모의 흐름
- `tests/`: 배포 결과의 링크·초안 제외·공개 파일 경계 검사

## 배포

GitHub Pages 설정에서 Source를 GitHub Actions로 선택합니다. `.github/workflows/deploy.yml`이 빌드·검사를 통과한 정적 산출물만 게시합니다. main push는 공개 배포를 일으키므로 변경 범위를 검토한 뒤 수행합니다.

서버가 필요한 기능은 추후 별도 HTTPS API로 연결합니다. 홈페이지 코드에 서버 비밀키를 넣지 않습니다.
