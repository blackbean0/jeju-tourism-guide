// 관광지 상세 페이지 로직 (URL의 id 파라미터로 상세 데이터 로드)

function getIdFromQueryString() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function createInfoItem(label, value) {
  const li = document.createElement('li');

  const strong = document.createElement('strong');
  strong.textContent = `${label}: `;

  li.appendChild(strong);
  li.appendChild(document.createTextNode(value));

  return li;
}

function createAttractionDetailElement(attraction) {
  const wrapper = document.createElement('article');
  wrapper.className = 'attraction-detail__content';

  const title = document.createElement('h2');
  title.textContent = attraction.name;

  const category = document.createElement('span');
  category.className = 'attraction-detail__category';
  category.textContent = attraction.category;

  const infoList = document.createElement('ul');
  infoList.className = 'attraction-detail__info';
  infoList.appendChild(createInfoItem('위치', attraction.location));
  infoList.appendChild(createInfoItem('개방시간', attraction.hours));
  infoList.appendChild(createInfoItem('입장료', attraction.fee));

  const description = document.createElement('p');
  description.className = 'attraction-detail__description';
  description.textContent = attraction.description;

  const tipsTitle = document.createElement('h3');
  tipsTitle.textContent = '방문 팁';

  const tipsList = document.createElement('ul');
  tipsList.className = 'attraction-detail__tips';
  attraction.tips.forEach((tip) => {
    const li = document.createElement('li');
    li.textContent = tip;
    tipsList.appendChild(li);
  });

  wrapper.append(title, category, infoList, description, tipsTitle, tipsList);

  return wrapper;
}

function renderNotFound(container) {
  const message = document.createElement('p');
  message.textContent = '관광지 정보를 찾을 수 없습니다.';
  container.appendChild(message);
}

async function renderAttractionDetail() {
  const container = document.querySelector('.attraction-detail');
  if (!container) return;

  const id = getIdFromQueryString();

  if (!id || !ATTRACTION_IDS.includes(id)) {
    renderNotFound(container);
    return;
  }

  const response = await fetch(`data/attractions/${id}.md`);
  const markdown = await response.text();
  const attraction = parseAttractionMarkdown(markdown);

  container.innerHTML = '';
  container.appendChild(createAttractionDetailElement(attraction));

  document.title = `제주 관광 안내 - ${attraction.name}`;
}

document.addEventListener('DOMContentLoaded', renderAttractionDetail);
