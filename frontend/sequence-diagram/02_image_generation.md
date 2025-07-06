# 시퀀스 다이어그램: 이미지 생성 요청

> 최종 업데이트: 2025년 7월 5일

이 다이어그램은 SurfAI의 가장 핵심적인 기능인 이미지 생성 요청 및 비동기 처리 과정을 보여줍니다. 사용자의 최초 API 요청부터 WebSocket을 통한 실시간 피드백, 그리고 최종 결과물이 처리되어 사용자에게 전달되기까지의 복잡한 상호작용을 상세히 나타냅니다.

```mermaid
sequenceDiagram
    participant Browser as 프론트엔드
    participant Backend as 백엔드
    participant ComfyUI as 연산 서버
    participant R2 as Cloudflare R2
    participant DB as PostgreSQL

    Browser->>Backend: POST /api/generate (템플릿 ID, 파라미터 전송)
    
    activate Backend
    note right of Backend: 1. 요청 유효성 검사<br>2. (향후) 크레딧 차감
    Backend->>ComfyUI: 생성 작업 요청 (워크플로우, 파라미터 전달)
    Backend-->>Browser: 202 Accepted (작업 접수됨 응답)
    deactivate Backend

    par 
        ComfyUI-->>Backend: [WebSocket] "progress" 이벤트 전송 (생성 진행률)
        Backend-->>Browser: [WebSocket] "progress" 이벤트 브로드캐스트
    and
        ComfyUI-->>Backend: [WebSocket] "executed" 이벤트 전송 (생성 완료, 결과물 정보 포함)
        
        activate Backend
        note right of Backend: ComfyUI로부터 결과 파일 다운로드
        Backend->>R2: 결과 파일을 R2에 업로드
        activate R2
        R2-->>Backend: 업로드 성공 (파일 URL 반환)
        deactivate R2

        Backend->>DB: 생성 기록 저장 (사용자 ID, 파라미터, R2 URL 등)
        activate DB
        DB-->>Backend: 저장 성공
        deactivate DB

        Backend-->>Browser: [WebSocket] "generation_result" 이벤트 전송 (최종 결과 데이터)
        deactivate Backend
    end

    note left of Browser: 수신한 최종 결과 데이터를<br>SessionGallery에 즉시 표시
```
