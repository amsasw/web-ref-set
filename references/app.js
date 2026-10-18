const topics = { all: '全部', oral: '牙膏与口腔', baby: '母婴产品' };
const search = document.querySelector('#search');
const works = document.querySelector('#works');
const filterButtons = [...document.querySelectorAll('[data-topic]')];
const template = document.querySelector('#work-template');
let selectedTopic = 'all';

function createLink(label, url, name) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = `${label} ↗`;
  link.setAttribute('aria-label', `${name}：${label}（新标签页）`);
  return link;
}

function createCard(work) {
  const card = template.content.cloneNode(true);
  const article = card.querySelector('article');
  article.id = work.id;
  article.style.setProperty('--cover', work.colors[0]);
  article.style.setProperty('--ink', work.colors[1]);
  const text = (selector, value) => { card.querySelector(selector).textContent = value; };
  text('.work-number', String(productReferences.indexOf(work) + 1).padStart(2, '0'));
  text('.work-topic', topics[work.topic]);
  text('.work-name', work.name);
  text('.work-product', work.product);
  text('.work-style', work.style);
  text('.source-kind', work.kind);
  text('.work-structure', work.structure);
  text('.work-evidence', work.evidence);
  text('.work-idea', work.idea);
  card.querySelectorAll('.palette i').forEach((swatch, i) => { swatch.style.background = work.colors[i]; });
  work.tags.forEach(tag => {
    const item = document.createElement('li');
    item.textContent = tag;
    card.querySelector('.tags').append(item);
  });
  const links = card.querySelector('.work-links');
  links.append(createLink(work.kind === 'Framer 模板' ? '官方模板页' : '访问原站', work.url, work.name));
  if (work.detailUrl) links.append(createLink(work.detailLabel, work.detailUrl, work.name));
  return card;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const list = productReferences.filter(work => {
    const text = [work.name, work.product, work.style, work.kind, topics[work.topic], work.structure, work.evidence, work.idea, ...work.tags].join(' ').toLocaleLowerCase();
    return (selectedTopic === 'all' || work.topic === selectedTopic) && text.includes(query);
  });
  works.replaceChildren(...list.map(createCard));
  filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === selectedTopic)));
  document.querySelector('#result-count').textContent = `显示 ${list.length} / ${productReferences.length} 个作品`;
  document.querySelector('#empty').hidden = list.length > 0;
}

document.querySelectorAll('[data-count]').forEach(counter => {
  counter.textContent = productReferences.filter(work => counter.dataset.count === 'all' || work.topic === counter.dataset.count).length;
});
filterButtons.forEach(button => button.addEventListener('click', () => {
  selectedTopic = button.dataset.topic;
  render();
}));
search.addEventListener('input', render);
document.querySelector('#reset').addEventListener('click', () => {
  selectedTopic = 'all';
  search.value = '';
  render();
  search.focus();
});
render();
