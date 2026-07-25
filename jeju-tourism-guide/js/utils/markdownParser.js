// 마크다운(.md) 데이터 파싱 유틸
// data/attractions/*.md 템플릿(# 이름 / ## 기본정보 / ## 설명 / ## 방문 팁)을 객체로 변환한다.

function parseAttractionMarkdown(markdown) {
  const attraction = {
    name: '',
    location: '',
    hours: '',
    fee: '',
    category: '',
    description: '',
    tips: [],
  };

  const descriptionLines = [];
  let currentSection = null;

  const lines = markdown.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('# ')) {
      attraction.name = line.replace(/^#\s*/, '').trim();
      continue;
    }

    if (line.startsWith('## ')) {
      currentSection = line.replace(/^##\s*/, '').trim();
      continue;
    }

    if (!line) {
      continue;
    }

    if (currentSection === '기본정보' && line.startsWith('-')) {
      const match = line.match(/-\s*\*\*(.+?)\*\*\s*:\s*(.+)/);
      if (!match) continue;

      const key = match[1].trim();
      const value = match[2].trim();

      if (key === '위치') attraction.location = value;
      else if (key === '개방시간') attraction.hours = value;
      else if (key === '입장료') attraction.fee = value;
      else if (key === '카테고리') attraction.category = value;
    } else if (currentSection === '설명') {
      descriptionLines.push(line);
    } else if (currentSection === '방문 팁' && line.startsWith('-')) {
      attraction.tips.push(line.replace(/^-\s*/, '').trim());
    }
  }

  attraction.description = descriptionLines.join(' ').trim();

  return attraction;
}

function getShortText(text, maxLength = 80) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// data/courses/*.md 템플릿(# 코스명 / ## 코스정보 / ## Day N / ### 오전·오후 / - **관광지** (시간))을 객체로 변환한다.
function parseCourseMarkdown(markdown) {
  const course = { title: '', duration: '', theme: '', days: [] };

  let currentTopSection = null;
  let currentDay = null;
  let currentPeriod = null;
  let lastItem = null;

  const lines = markdown.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('# ') && !line.startsWith('## ')) {
      course.title = line.replace(/^#\s*/, '').trim();
      continue;
    }

    const dayMatch = line.match(/^##\s*Day\s*(\d+)/i);
    if (dayMatch) {
      currentDay = { dayNumber: Number(dayMatch[1]), periods: [] };
      course.days.push(currentDay);
      currentTopSection = 'day';
      currentPeriod = null;
      lastItem = null;
      continue;
    }

    if (line.startsWith('## ')) {
      currentTopSection = line.replace(/^##\s*/, '').trim();
      currentDay = null;
      currentPeriod = null;
      lastItem = null;
      continue;
    }

    if (line.startsWith('### ')) {
      if (currentDay) {
        currentPeriod = { label: line.replace(/^###\s*/, '').trim(), items: [] };
        currentDay.periods.push(currentPeriod);
        lastItem = null;
      }
      continue;
    }

    if (!line) {
      continue;
    }

    if (currentTopSection === '코스정보' && line.startsWith('-')) {
      const match = line.match(/-\s*\*\*(.+?)\*\*\s*:\s*(.+)/);
      if (!match) continue;

      const key = match[1].trim();
      const value = match[2].trim();

      if (key === '기간') course.duration = value;
      else if (key === '테마') course.theme = value;
      continue;
    }

    if (currentPeriod && line.startsWith('-')) {
      const itemMatch = line.match(/-\s*\*\*(.+?)\*\*\s*\((.+?)\)/);
      if (itemMatch) {
        lastItem = { name: itemMatch[1].trim(), time: itemMatch[2].trim(), tip: '' };
        currentPeriod.items.push(lastItem);
      } else if (lastItem) {
        lastItem.tip = line.replace(/^-\s*/, '').trim();
      }
    }
  }

  return course;
}
