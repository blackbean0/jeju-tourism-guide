// 카테고리 필터 유틸

const ALL_CATEGORIES_LABEL = '전체';

function filterAttractionsByCategory(attractions, category) {
  if (!category || category === ALL_CATEGORIES_LABEL) {
    return attractions;
  }
  return attractions.filter((attraction) => attraction.category === category);
}
