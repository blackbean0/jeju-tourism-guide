// 관광지 목록 페이지 로직 (데이터 로드, 카드 렌더링, 카테고리 필터, 검색)

const CATEGORIES = [ALL_CATEGORIES_LABEL, '자연', '문화', '음식', '액티비티'];

let allAttractions = [];
let activeCategory = ALL_CATEGORIES_LABEL;
let searchQuery = '';

async function loadAllAttractions() {
  const attractions = await Promise.all(
    ATTRACTION_IDS.map(async (id) => {
      const response = await fetch(`data/attractions/${id}.md`);
      const markdown = await response.text();
      const attraction = parseAttractionMarkdown(markdown);
      attraction.id = id;
      return attraction;
    })
  );
  return attractions;
}

function createAttractionCard(attraction) {
  const card = document.createElement('a');
  card.className = 'attraction-card';
  card.href = `attraction-detail.html?id=${attraction.id}`;

  const title = document.createElement('h3');
  title.className = 'attraction-card__title';
  title.textContent = attraction.name;

  const summary = document.createElement('p');
  summary.className = 'attraction-card__summary';
  summary.textContent = getShortText(attraction.description);

  card.appendChild(title);
  card.appendChild(summary);

  return card;
}

function renderAttractionCards(attractions) {
  const listEl = document.querySelector('.attraction-list');
  if (!listEl) return;

  listEl.innerHTML = '';

  if (attractions.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'attraction-list__empty';
    emptyMessage.textContent = '검색 결과가 없습니다.';
    listEl.appendChild(emptyMessage);
    return;
  }

  attractions.forEach((attraction) => {
    listEl.appendChild(createAttractionCard(attraction));
  });
}

function updateFilterButtonsState() {
  const buttons = document.querySelectorAll('.category-filter__button');
  buttons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.category === activeCategory);
  });
}

function applyFilters() {
  const byCategory = filterAttractionsByCategory(allAttractions, activeCategory);
  const bySearch = searchAttractions(byCategory, searchQuery);
  renderAttractionCards(bySearch);
}

function setActiveCategory(category) {
  activeCategory = category;
  updateFilterButtonsState();
  applyFilters();
}

function createFilterButton(category) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'category-filter__button';
  button.dataset.category = category;
  button.textContent = category;
  button.addEventListener('click', () => setActiveCategory(category));
  return button;
}

function renderCategoryFilter() {
  const filterEl = document.querySelector('.category-filter');
  if (!filterEl) return;

  filterEl.innerHTML = '';
  CATEGORIES.forEach((category) => {
    filterEl.appendChild(createFilterButton(category));
  });
}

function initSearchBox() {
  const searchInput = document.querySelector('.search-box');
  if (!searchInput) return;

  searchInput.addEventListener('input', (event) => {
    searchQuery = event.target.value;
    applyFilters();
  });

  const initialQuery = new URLSearchParams(window.location.search).get('search');
  if (initialQuery) {
    searchInput.value = initialQuery;
    searchQuery = initialQuery;
  }
}

async function initAttractionListPage() {
  const listEl = document.querySelector('.attraction-list');
  if (!listEl) return;

  allAttractions = await loadAllAttractions();
  renderCategoryFilter();
  initSearchBox();
  setActiveCategory(ALL_CATEGORIES_LABEL);
}

document.addEventListener('DOMContentLoaded', initAttractionListPage);
