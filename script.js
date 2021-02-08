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

async function sumPrices() {
  let sum = 0;
  const totalPrice = document.querySelector('.total-price');
  const li = document.querySelectorAll('.cart__item');
  li.forEach(item => (sum += +item.innerText.split('$')[1]));
  totalPrice.innerText = sum;
}

function saveToLocalStorage(element) {
  localStorage.savedItems = element.innerHTML;
}

function loadFromLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  if (localStorage.savedItems) {
    cartItems.innerHTML = localStorage.savedItems;
  }
  sumPrices();
}

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  event.target.remove();
  saveToLocalStorage(cartItems);
  sumPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchCartItemElement(ItemID) {
  const endpoint = `https://api.mercadolibre.com/items/${ItemID}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const { id: sku, title: name, price: salePrice } = object;
  const elementHTM = createCartItemElement({ sku, name, salePrice });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(elementHTM);
  saveToLocalStorage(cartItems);
  sumPrices();
}

async function fetchProductList(QUERY) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const productObj = object.results;
  document.querySelector('.loading').remove();

  productObj.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const item = createProductItemElement({ sku, name, image });
    listItems = document.querySelector('.items');
    listItems.appendChild(item);
  });

  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach(button => button
    .addEventListener('click', (event) => {
      const productId = getSkuFromProductItem(event.target.parentNode);
      fetchCartItemElement(productId);
    }));
}

function removeCartItemElements() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  saveToLocalStorage(cartItems);
  sumPrices();
}

function startLoading() {
  const items = document.querySelector('.items');
  const loadingText = createCustomElement('span', 'loading', 'loading...');
  items.appendChild(loadingText);
}

function searchBoxEvent(event) {
  const searchBox = document.querySelector('.search-box');
  listItems = document.querySelector('.items');
  if (event.keyCode === 13 && searchBox.value.length > 0) {
    listItems.innerHTML = '';
    startLoading();
    fetchProductList(searchBox.value);
  }
}

window.onload = function onload() {
  startLoading();
  fetchProductList('computador');
  loadFromLocalStorage();

  const searchBox = document.querySelector('.search-box');
  searchBox.addEventListener('keyup', event => searchBoxEvent(event));

  const li = document.querySelectorAll('.cart__item');
  li.forEach(el => el.addEventListener('click', cartItemClickListener));

  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', removeCartItemElements);
};
