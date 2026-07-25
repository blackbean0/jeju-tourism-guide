# 제주 관광 안내 사이트

제주도 관광지와 추천 코스를 마크다운 데이터로 관리하고, 순수 HTML/CSS/JS로 보여주는 정적 웹사이트입니다.

## 주요 기능

- 홈: 검색창, 인기 관광지 4개, 추천 코스 2개
- 관광지 목록: 카테고리 필터(전체/자연/문화/음식/액티비티), 이름·설명 검색, 카드 클릭 시 상세 이동
- 관광지 상세: 위치/개방시간/입장료/카테고리/설명/방문 팁
- 코스 목록: 카드 클릭 시 상세 이동
- 코스 상세: Day별 오전/오후 일정과 이용 팁을 순서대로 표시
- 모바일(1열)/태블릿(2열)/데스크톱(3열) 반응형 카드 레이아웃

## 실행 방법

정적 파일이지만 `fetch`로 `data/` 아래의 `.md` 파일을 불러오기 때문에 `file://`로 직접 열면 브라우저 CORS 정책에 막힙니다. 로컬 서버로 실행해 주세요.

```
# 이 폴더(jeju-tourism-guide)에서 실행
python -m http.server 8000
```

이후 브라우저에서 `http://localhost:8000/index.html` 접속. (VS Code Live Server 등 다른 로컬 서버도 무관합니다.)

## 페이지 구성

- `index.html` — 홈
- `attractions.html` — 관광지 목록 (`?search=검색어`로 검색어를 넘겨받을 수 있음)
- `attraction-detail.html` — 관광지 상세 (`?id=관광지-id`)
- `courses.html` — 코스 목록
- `course-detail.html` — 코스 상세 (`?id=코스-id`)

## 데이터 추가/수정 방법

새 관광지나 코스를 추가하려면:

1. `data/attractions/` 또는 `data/courses/`에 기존 파일과 같은 형식으로 `.md` 파일을 추가합니다.
2. `js/attractionIds.js` 또는 `js/courseIds.js`의 목록에 새 파일명(확장자 제외)을 추가합니다. (정적 사이트라 디렉터리 목록을 직접 읽을 수 없어 수동으로 관리합니다.)

## 폴더 구조

```
jeju-tourism-guide/
├── index.html                  # 홈
├── attractions.html            # 관광지 목록
├── attraction-detail.html      # 관광지 상세
├── courses.html                # 코스 목록
├── course-detail.html          # 코스 상세
├── css/
│   ├── global.css              # 전역 리셋
│   ├── components.css          # 카드/필터/검색창 등 컴포넌트 스타일
│   └── responsive.css          # 모바일/태블릿/데스크톱 미디어 쿼리
├── js/
│   ├── main.js                 # 공통 스크립트(확장용)
│   ├── home.js                 # 홈 페이지 로직
│   ├── attractions.js          # 관광지 목록(필터·검색) 로직
│   ├── attractionDetail.js     # 관광지 상세 로직
│   ├── attractionIds.js        # 관광지 데이터 파일 목록
│   ├── courses.js              # 코스 목록 로직
│   ├── courseDetail.js         # 코스 상세 로직
│   ├── courseIds.js            # 코스 데이터 파일 목록
│   └── utils/
│       ├── markdownParser.js   # 관광지/코스 마크다운 파서
│       ├── filterUtils.js      # 카테고리 필터 유틸
│       └── searchUtils.js      # 검색 유틸
├── data/
│   ├── attractions/            # 관광지 마크다운 데이터
│   └── courses/                # 코스 마크다운 데이터
└── README.md
```
