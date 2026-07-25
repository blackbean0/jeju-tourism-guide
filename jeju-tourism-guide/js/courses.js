// 코스 목록 페이지 로직 (데이터 로드, 카드 렌더링)

async function loadAllCourses() {
  const courses = await Promise.all(
    COURSE_IDS.map(async (id) => {
      const response = await fetch(`data/courses/${id}.md`);
      const markdown = await response.text();
      const course = parseCourseMarkdown(markdown);
      course.id = id;
      return course;
    })
  );
  return courses;
}

function createCourseCard(course) {
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

async function renderCourseList() {
  const listEl = document.querySelector('.course-list');
  if (!listEl) return;

  const courses = await loadAllCourses();

  listEl.innerHTML = '';
  courses.forEach((course) => {
    listEl.appendChild(createCourseCard(course));
  });
}

document.addEventListener('DOMContentLoaded', renderCourseList);
