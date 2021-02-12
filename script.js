function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function localStorage() {
  const itensList = document.querySelector('.cart__items');
  localStorage.setItem('products', itensList.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  localStorage();
}
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  return section;
}
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function mercadoLivreResults(term) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  const response = await fetch(endpoint);
  const obj = await response.json();
  const results = obj.results;
  const itemsElement = document.querySelector('.items');
  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(element);
  });
}

function createCartListItem(itemList) {
  const cartItem = document.querySelector('.cart__items');
  cartItem.appendChild(itemList);
}

function searchID(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(response => response.json())
  .then((object) => {
    const { id: sku, title: name, price: salePrice } = object;
    const itemList = createCartItemElement({ sku, name, salePrice });
    createCartListItem(itemList);
  })
  .catch(error => window.alert(error));
}

function getId(button) {
  if (button.target.className === 'item__add') {
    const id = button.target.parentNode.firstChild.innerText;
    searchID(id);
  }
}

function addList() {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', getId);
}

function SaveLocalStorage() {
  const items = document.querySelector('.items');
  const listItems = localStorage.getItem('products');
  if (!listItems) {
    localStorage.setItem('products', '');
  }
  items.innerHTML = localStorage.getItem('products');
  items.childNodes.forEach((product => product.addEventListener('click', cartItemClickListener)));
}

window.onload = function onload() {
  mercadoLivreResults('computador');
  addList();
  SaveLocalStorage();
};
