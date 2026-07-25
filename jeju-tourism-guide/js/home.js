// 홈페이지 로직 (검색창, 인기 관광지, 추천 코스)

const POPULAR_ATTRACTION_IDS = ['hallasan', 'seongsan-ilchulbong', 'udo-island', 'seongeup-folk-village'];
const FEATURED_COURSE_IDS = ['1day-seongsan-udo-course', '2day-hallasan-culture-course'];

function createHomeAttractionCard(attraction) {
  const card = document.createElement('a');
  card.className = 'attraction-card';
  card.href = `attraction-detail.html?id=${attraction.id}`;

  const title = document.createElement('h3');
  title.className = 'attraction-card__title';
  title.textContent = attraction.name;

  const summary = document.createElement('p');
  summary.className = 'attraction-card__summary';
  summary.textContent = getShortText(attraction.description);

  card.append(title, summary);

  return card;
}

function createHomeCourseCard(course) {
  const card = document.createElement('a');
  card.className = 'course-card';
  card.href = `course-detail.html?id=${course.id}`;

  const title = document.createElement('h3');
  title.className = 'course-card__title';
  title.textContent = course.title;

  const duration = document.createElement('span');
  duration.className = 'course-card__duration';
  duration.textContent = course.duration;

  const theme = document.createElement('p');
  theme.className = 'course-card__theme';
  theme.textContent = getShortText(course.theme, 60);

  card.append(title, duration, theme);

  return card;
}

async function renderPopularAttractions() {
  const listEl = document.querySelector('.home-attraction-list');
  if (!listEl) return;

  const attractions = await Promise.all(
    POPULAR_ATTRACTION_IDS.map(async (id) => {
      const response = await fetch(`data/attractions/${id}.md`);
      const markdown = await response.text();
      const attraction = parseAttractionMarkdown(markdown);
      attraction.id = id;
      return attraction;
    })
  );

  listEl.innerHTML = '';
  attractions.forEach((attraction) => {
    listEl.appendChild(createHomeAttractionCard(attraction));
  });
}

async function renderFeaturedCourses() {
  const listEl = document.querySelector('.home-course-list');
  if (!listEl) return;

  const courses = await Promise.all(
    FEATURED_COURSE_IDS.map(async (id) => {
      const response = await fetch(`data/courses/${id}.md`);
      const markdown = await response.text();
      const course = parseCourseMarkdown(markdown);
      course.id = id;
      return course;
    })
  );

  listEl.innerHTML = '';
  courses.forEach((course) => {
    listEl.appendChild(createHomeCourseCard(course));
  });
}

function goToAttractionSearch(query) {
  const trimmedQuery = (query || '').trim();
  window.location.href = trimmedQuery
    ? `attractions.html?search=${encodeURIComponent(trimmedQuery)}`
    : 'attractions.html';
}

function initHomeSearch() {
  const searchInput = document.querySelector('.home-search-box');
  if (!searchInput) return;

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      goToAttractionSearch(searchInput.value);
    }
  });
}

function initHomePage() {
  initHomeSearch();
  renderPopularAttractions();
  renderFeaturedCourses();
}

document.addEventListener('DOMContentLoaded', initHomePage);
