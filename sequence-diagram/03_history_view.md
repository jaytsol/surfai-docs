# 시퀀스 다이어그램: 생성 기록 조회

> 최종 업데이트: 2025년 7월 5일

이 다이어그램은 사용자가 '히스토리' 페이지에서 과거에 생성했던 결과물을 조회하고, 특정 결과물을 클릭하여 확대 보기하는 과정을 보여줍니다. 특히 결과물 표시를 위해 백엔드에서 미리 서명된(pre-signed) URL을 동적으로 생성하여 전달하는 흐름을 상세히 나타냅니다.

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Browser as 프론트엔드
    participant Backend as 백엔드
    participant DB as PostgreSQL
    participant R2 as Cloudflare R2

    User->>Browser: '히스토리' 페이지 방문
    Browser->>Backend: GET /my-outputs (나의 생성 기록 요청)
    
    activate Backend
    Backend->>DB: 해당 사용자의 생성 기록 목록 조회
    activate DB
    DB-->>Backend: 생성 기록 목록 응답 (파일 정보 포함)
    deactivate DB
    Backend-->>Browser: 200 OK (생성 기록 목록 반환)
    deactivate Backend

    note left of Browser: 생성 기록 목록을 화면에 렌더링
    User->>Browser: 특정 이미지 클릭 (확대 보기)
    
    Browser->>Backend: GET /my-outputs/:id/view-url (표시용 URL 요청)
    activate Backend
    note right of Backend: R2 파일에 대한 단기 유효<br>미리 서명된(pre-signed) URL 생성
    Backend->>R2: Pre-signed URL 생성 요청
    activate R2
    R2-->>Backend: 생성된 URL 반환
    deactivate R2
    Backend-->>Browser: 200 OK (viewUrl 포함)
    deactivate Backend

    note left of Browser: 받은 URL을 사용하여<br>ImageLightbox에 이미지 표시
```
