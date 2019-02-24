const { h, app } = hyperapp;

const state = {
  title: 'Remote Jobs',
  items: [],
  tags: [],
  searchBy: [],
  search: [],
  client: null,
}

const actions = {
  setFilter: tag => (state, actions) => {
    const searchBy = state.searchBy.includes(tag) ? state.searchBy.filter(item => item !== tag) : [...state.searchBy, tag];
    const search = state.client ? state.client.getJobsByTags(searchBy) : [];
    return { searchBy, search };
  }
}

// components:

const title = state => h('h1', { className: 'title' }, `${state.title} (${state.items.length})`);

const tagElement = tag => (state, actions) => h('button', { className: state.searchBy.includes(tag) ? 'tag tag--selected' : 'tag', onclick: () => actions.setFilter(tag) }, tag);
const itemTagList = item => (state, actions) => h('li', { className: 'list__item' }, tagElement(item));
const tagsList = (state, actions) => h('ul', { className: 'list' }, state.tags.map(itemTagList));
const tagsContainer = (state, actions) => h('div', { className: 'side-menu' }, tagsList);


const jobTitle = job => h('h3', { className: 'job__title' }, job.position);
const jobLabel = text => h('label', { className: 'job__label' }, text);
const jobData = text => h('span', { className: 'job__info' }, text);
const jobLine = (label, content) => h('p', { className: 'job__line', }, [ label, content ]);
const jobContent = job => h('div', { className: 'job__content' }, [
  jobLine(
    jobLabel('Company:'),
    jobData(job.company),
  ),
  jobLine(
    jobLabel('Tags:'),
    jobData(job.tags.join(', ')),
  ),
  jobLine(
    jobLabel('Link:'),
    jobData(h('a', { className: 'job__link', href: job.url, target: '_blank' }, job.url)),
  ),
]);
const jobElement = job => (state, actions) => h('div', { className: 'job', 'data-jobId': job.id }, [
  jobTitle(job),
  jobContent(job),
]);
const itemJobList = item => (state, actions) => h('li', { className: 'list__item' }, jobElement(item));
const jobsList = (state, actions) => h('ul', { className: 'list' }, state.search.map(itemJobList));
const jobsContainer = (state, actions) => h('div', { className: 'content' }, jobsList);


const view = (state, actions) => h('div', {}, [
  title,
  tagsContainer,
  jobsContainer,
]);
