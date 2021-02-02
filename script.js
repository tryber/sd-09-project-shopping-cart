function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function saveCartStorage() {
  const getcart = document.querySelector('.cart__items');
  localStorage.setItem('cart', getcart.innerHTML);
}


function cartItemClickListener(event) {
  event.target.remove();
  saveCartStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSku(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addItemCart() {
  const itemsElement = document.querySelector('.items');
  itemsElement.addEventListener('click', async (event) => {
    const productSku = getSku(event.target.parentNode);
    const endpoint = `https://api.mercadolibre.com/items/${productSku}`;

    const results = await fetch(endpoint)
    .then(response => response.json());

    const item = {
      sku: productSku,
      name: results.title,
      salePrice: results.price,
    };
    const getCarElement = document.querySelector('.cart__items');
    const createItem = createCartItemElement(item);
    getCarElement.appendChild(createItem);
    saveCartStorage();
  });
}

function createLoading() {
  const loadingElement = document.createElement('h1');
  const getContainer = document.querySelector('.container');
  loadingElement.innerText = 'Loading...';
  loadingElement.className = 'loading';
  getContainer.appendChild(loadingElement);
}

function removeLoading() {
  const getloadingElement = document.querySelector('.loading');
  getloadingElement.remove();
}

async function fetchMercadoLivre(term) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const results = object.results;
  const itemsElement = document.querySelector('.items');

  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(element);
  });
  removeLoading();
}

function loadCartStorage() {
  const getcart = document.querySelector('.cart__items');
  getcart.innerHTML = localStorage.getItem('cart');
}
function emptyCartcheckout() {
  const emptyCartBtn = document.querySelector('.empty-cart');
  emptyCartBtn.addEventListener('click', () => {
    const checkout = document.querySelectorAll('.cart__item');
    checkout.forEach(item => item.remove());
    localStorage.removeItem('cart');
  });
}

window.onload = function onload() {
  createLoading();
  fetchMercadoLivre('computador');
  addItemCart();
  loadCartStorage();
  emptyCartcheckout();
};
