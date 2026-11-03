---
title: "Switch와 iPhone은 ARM64인데 왜 게임이 바로 실행되지 않을까"
description: "nxnative의 바이너리 재작성, Horizon 서비스 대체, Metal 변환과 AI 보조 개발 방식을 살펴본 개인 취미 스터디."
date: 2026-11-03T10:00:00+09:00
tags: ["개인 취미", "ARM64", "역공학", "AI 엔지니어링"]
draft: false
---

Switch와 iPhone이 ARM64 계열이라는 사실은 흥미로운 출발점이다. 같은 CPU 명령어를 활용할 수 있다면 게임을 다른 기기에서도 실행할 수 있지 않을까. nxnative는 이 가능성을 바이너리 재작성과 실행 환경 구현으로 연결한 프로젝트다.

이 프로젝트를 이해하는 핵심은 CPU의 언어와 플랫폼의 약속을 구분하는 데 있다. 연산 명령을 실행할 수 있어도 게임이 기대하는 운영체제 서비스, 메모리 관리, 그래픽 API가 없으면 프로그램은 동작하지 않는다. nxnative는 게임 코드의 일부를 고치고 Horizon 서비스를 대신하는 호스트와 Metal 그래픽 계층을 제공한다. [구조 설명](https://github.com/seedds/nxnative/blob/b1dee89c2114b89154a659b5af231fa98c1c6a1f/docs/development.md)

## 같은 명령어 위에 남아 있는 차이

예를 들어 Switch 게임이 사용하는 레지스터와 스레드 지역 저장소는 Apple 환경의 규칙과 충돌할 수 있다. `patch_nso.py`에는 `x18`, TLS, 시스템 서비스 호출, 스택 정렬을 다루는 재작성 규칙이 들어 있다. 단순히 실행 파일의 확장자를 바꾸는 것으로 해결되지 않는 이유다. [재작성 코드](https://github.com/seedds/nxnative/blob/b1dee89c2114b89154a659b5af231fa98c1c6a1f/dm/tools/patch_nso.py)

여기서 네이티브 실행이란 원래 AArch64 코드를 활용한다는 뜻이다. Horizon의 동작을 대신하는 고수준 구현까지 사라지는 것은 아니다. 소스 코드를 Swift로 옮기는 전통적인 포팅과도 방식이 다르다.

## 그래픽에는 또 하나의 다리가 필요하다

CPU가 명령을 실행하더라도 Switch GPU용 셰이더를 Apple GPU가 그대로 사용하는 것은 아니다. nxnative에는 NVN을 Metal로 구현하는 계층이 있고, 셰이더를 SPIR-V와 MSL을 거쳐 Apple용 라이브러리로 만드는 도구가 있다. 게임에 따라 Vulkan·OpenGL 대응 경로도 사용한다. [셰이더 빌드](https://github.com/seedds/nxnative/blob/b1dee89c2114b89154a659b5af231fa98c1c6a1f/dm/gfx/tools/dmsh_build.py), [그래픽 구성](https://github.com/seedds/nxnative/blob/b1dee89c2114b89154a659b5af231fa98c1c6a1f/docs/development.md)

그래서 화면 한 장이 나왔다는 사실과 게임이 끝까지 정확하게 동작한다는 사실은 다르다. 다른 장면, 저장과 재시작, 오디오, 메모리 사용까지 확인해야 호환성을 이야기할 수 있다.

## AI가 맡는 일은 조사와 수정의 반복이다

이 저장소의 에이전트 가이드는 게임 분석, 누락된 서비스 조사, 기동, 첫 프레임, 메모리 점검, 실기기 검증을 단계별로 안내한다. AI가 소스와 로그를 읽고 작은 수정을 제안하는 개발 절차로 볼 수 있다. 확인한 자료로 모든 게임의 무인 자동 포팅이나 AI 작성 비율까지 단정할 수는 없다. [에이전트 가이드](https://github.com/seedds/nxnative/blob/b1dee89c2114b89154a659b5af231fa98c1c6a1f/docs/agents/README.md)

개인적으로 학습할 만한 지점은 문제를 잘게 나누는 방식이다. CPU 실행, 시스템 서비스, 그래픽, 패키징의 실패를 구분하고 각 단계의 증거를 남기면, AI가 제시한 수정도 무엇을 해결했는지 검토하기 쉬워진다.

## 직접 실험하기 전에 볼 조건

검토한 버전은 Apple silicon Mac과 특정 iPhone·iPad 세대를 지원 대상으로 제시한다. ARM64라는 이유만으로 모든 A시리즈 기기에서 실행되는 것은 아니다. 완성된 IPA도 서명·설치와 기기별 테스트가 필요하다. [지원 범위](https://github.com/seedds/nxnative/blob/b1dee89c2114b89154a659b5af231fa98c1c6a1f/CONTRIBUTING.md), [프로젝트 안내](https://github.com/seedds/nxnative/blob/b1dee89c2114b89154a659b5af231fa98c1c6a1f/README.md)

이번 글은 공개 소스 구조를 검토한 기록이며, 직접 iPhone에서 게임을 구동하거나 성능을 측정한 후기는 아니다. 게임 파일과 키는 포함하지 않는다. 첫 개인 실습으로는 직접 만든 작은 AArch64 예제에서 호출 규약과 스레드 저장소의 차이를 관찰하는 접근이 적절하다.

검토 기준은 nxnative 커밋 `b1dee89c2114b89154a659b5af231fa98c1c6a1f`다. 구현과 지원 범위는 이후 바뀔 수 있다. 원본: [seedds/nxnative](https://github.com/seedds/nxnative).
