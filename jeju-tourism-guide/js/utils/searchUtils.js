// 검색 유틸

function searchAttractions(attractions, query) {
  const trimmedQuery = (query || '').trim().toLowerCase();
  if (!trimmedQuery) {
    return attractions;
  }

  return attractions.filter((attraction) => {
    const name = (attraction.name || '').toLowerCase();
    const description = (attraction.description || '').toLowerCase();
    return name.includes(trimmedQuery) || description.includes(trimmedQuery);
  });
}
