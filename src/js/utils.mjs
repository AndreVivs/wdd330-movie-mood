export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeader() {
  const headerTemplate = await loadTemplate('/partials/header.html');
  const headerElement = document.querySelector('#main-header');

  renderWithTemplate(headerTemplate, headerElement);
}

// localStorageUtils.mjs
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

export function postLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
