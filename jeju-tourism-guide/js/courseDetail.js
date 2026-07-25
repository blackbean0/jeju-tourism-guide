// 코스 상세 페이지 로직 (URL의 id 파라미터로 Day별 일정 로드)

function getIdFromQueryString() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function createItemElement(item) {
  const li = document.createElement('li');
  li.className = 'course-item';

  const header = document.createElement('div');
  header.className = 'course-item__header';

  const name = document.createElement('strong');
  name.className = 'course-item__name';
  name.textContent = item.name;

  const time = document.createElement('span');
  time.className = 'course-item__time';
  time.textContent = item.time;

  header.append(name, time);
  li.appendChild(header);

  if (item.tip) {
    const tip = document.createElement('p');
    tip.className = 'course-item__tip';
    tip.textContent = item.tip;
    li.appendChild(tip);
  }

  return li;
}

function createPeriodElement(period) {
  const periodEl = document.createElement('div');
  periodEl.className = 'course-period';

  const periodTitle = document.createElement('h4');
  periodTitle.className = 'course-period__title';
  periodTitle.textContent = period.label;
  periodEl.appendChild(periodTitle);

  const itemList = document.createElement('ul');
  itemList.className = 'course-period__items';
  period.items.forEach((item) => {
    itemList.appendChild(createItemElement(item));
  });
  periodEl.appendChild(itemList);

  return periodEl;
}

function createDayElement(day) {
  const section = document.createElement('section');
  section.className = 'course-day';

  const dayTitle = document.createElement('h3');
  dayTitle.className = 'course-day__title';
  dayTitle.textContent = `Day ${day.dayNumber}`;
  section.appendChild(dayTitle);

  day.periods.forEach((period) => {
    section.appendChild(createPeriodElement(period));
  });

  return section;
}

function createCourseDetailElement(course) {
  const wrapper = document.createElement('article');
  wrapper.className = 'course-detail__content';

  const title = document.createElement('h2');
  title.textContent = course.title;

  const duration = document.createElement('span');
  duration.className = 'course-detail__duration';
  duration.textContent = course.duration;

  const theme = document.createElement('p');
  theme.className = 'course-detail__theme';
  theme.textContent = course.theme;

  wrapper.append(title, duration, theme);

  course.days.forEach((day) => {
    wrapper.appendChild(createDayElement(day));
  });

  return wrapper;
}

function renderNotFound(container) {
  const message = document.createElement('p');
  message.textContent = '코스 정보를 찾을 수 없습니다.';
  container.appendChild(message);
}

async function renderCourseDetail() {
  const container = document.querySelector('.course-detail');
  if (!container) return;

  const id = getIdFromQueryString();

  if (!id || !COURSE_IDS.includes(id)) {
    renderNotFound(container);
    return;
  }

  const response = await fetch(`data/courses/${id}.md`);
  const markdown = await response.text();
  const course = parseCourseMarkdown(markdown);

  container.innerHTML = '';
  container.appendChild(createCourseDetailElement(course));

  document.title = `제주 관광 안내 - ${course.title}`;
}

document.addEventListener('DOMContentLoaded', renderCourseDetail);
