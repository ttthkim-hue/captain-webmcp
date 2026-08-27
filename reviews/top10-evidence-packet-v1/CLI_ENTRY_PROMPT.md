# Codex CLI entry prompt

다음 GitHub 작업을 이어서 완수한다.

- Repository: `ttthkim-hue/captain-webmcp` (private)
- Branch: `agent/top10-evidence-packet-v1`
- Draft PR: `#1`
- Stable baseline commit: `2f621ca`
- WIP implementation commit: `6dee5c6` (use the current remote branch tip; later commits may contain handoff documentation only)
- Mode: bounded edit and verification only; no release

먼저 현재 checkout, branch, remote, `git status`, HEAD를 확인하고 루트
`AGENTS.md`를 읽는다. 이어서 아래 파일을 모두 읽는다.

1. `reviews/top10-evidence-packet-v1/WORK_EXECUTION_DIRECTIVE.md`
2. `reviews/top10-evidence-packet-v1/evaluator/competition-rubric-v1.json`
3. `reviews/top10-evidence-packet-v1/evaluator/evaluate-competition-readiness.mjs`
4. `reviews/top10-evidence-packet-v1/evaluator/baseline-evaluator.json`
5. `reviews/top10-evidence-packet-v1/evaluator/candidate-starting-evaluator.json`

`$bounded-agent-improvement`와 `sites:sites-building`을 사용한다. 다만 이
요청은 CLI 구현·검증 단계이므로 hosting은 명시적으로 보류한다. 전역 설정,
credentials, evaluator, rubric, baseline commit, `AGENTS.md`,
`.openai/hosting.json`, `public/og.png`, LICENSE를 수정하지 않는다.

현재 WIP는 `app/captain-console.tsx`에만 증거패킷 흐름이 부분 구현된
상태다. build와 lint는 통과하지만, unit test는 3/5, WebMCP validator는
14/17, 내부 readiness proxy는 67/100으로 KEEP 기준에 못 미친다. 이 수치를
동일 evaluator로 먼저 재현하라. evaluator나 성공 기준을 후보에 맞춰
바꾸면 안 된다.

목표는 한 가지다. 다음 흐름을 완결한다.

`inspect mission -> compare/focus/stage -> human approves route -> deterministic packet generation -> agent inspects/verifies -> human approves packet -> human downloads JSON`

다음 미완성 범위만 구현한다.

- `app/globals.css`: evidence packet UI의 desktop/mobile 반응형 스타일,
  상태·검증·버튼의 명확한 시각 구분 및 접근성 보완
- `tests/webmcp-contract.test.mjs`: 정확히 7개 도구, 7개 closed schema,
  optional signal 7개, human-only download/approval 경계, deterministic packet
  contract 검증
- `scripts/validate-webmcp.mjs`: 7개 도구와 4개 read-only 도구,
  verification receipt side effect, evidence-packet-contract, forbidden
  agent authority 검증
- `README.md`와 관련 `docs/`: 7개 도구와 완결된 evidence packet flow로
  사실에 맞게 갱신. 내부 점수는 judge score나 top-10 예측으로 과장하지 말 것

제품 범위를 넓히지 않는다. 실모델 호출, 로그인, DB, analytics, telemetry,
외부 API, fetch/WebSocket/sendBeacon, 실제 release 실행, 민감 데이터는 추가하지
않는다. 에이전트 도구에는 approve/download/publish/release 권한을 절대 만들지
않는다. download는 passing verification receipt와 명시적 human packet approval
뒤에만 가능해야 한다. digest mismatch 또는 contract fail이면 승인·다운로드가
열리면 안 된다.

한 가지 후보 변경으로 끝내고 다음을 모두 실행한다.

```text
pnpm test
pnpm run validate:webmcp
pnpm run lint
pnpm run build
node reviews/top10-evidence-packet-v1/evaluator/evaluate-competition-readiness.mjs .
git diff --check
```

readiness proxy가 baseline 64 대비 최소 +10이고, 모든 deterministic gate와
직접 소스 검사가 통과할 때만 KEEP한다. 아니면 현재 후보만 REVERT하고 실패
원인을 보고한다. 최대 3회, 연속 2회 비개선 시 중단한다.

CLI에서 소스 테스트만 통과했다고 WebMCP 실동작 합격이라 하지 않는다.
ChatGPT 인앱 브라우저의 실제 7개 도구 discovery/call, 공유 packet state,
human-only packet approval, 다운로드 JSON/hash readback은 남은 데스크톱 QA로
명시한다.

KEEP이면 변경 파일과 검증 증거를 다시 확인하고 이 브랜치에만 커밋·푸시한다.
Draft PR #1은 open/draft/unmerged로 유지한다. main merge, hosting, public 전환,
영상 공개, Devpost 제출은 하지 않는다. 마지막에는 정확한 commit SHA, 점수
전후, 테스트 결과, 변경 파일, 보호 대상, 남은 데스크톱 QA를 간단히 보고한다.
