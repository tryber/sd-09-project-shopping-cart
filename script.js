let array = [];

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

async function sumSalePrice() {
  let sum = 0;
  const salePrice = document.querySelector('.total-price');
  const ol = document.querySelector('.cart__items').childNodes;
  ol.forEach((item) => { sum += +item.innerText.split('$')[1]; });
  salePrice.innerText = sum;
}

function cartItemClickListener(event) {
  event.target.remove();
  sumSalePrice();
  const idDoEvento = event.target.innerText.split(' ')[1];
  array = array.filter(item => item.sku !== idDoEvento);
  localStorage.setItem('products', JSON.stringify(array));
}

function removeItems() {
  const btnRemove = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  btnRemove.addEventListener('click', function () {
    ol.innerHTML = '';
    sumSalePrice();
    array = [];
    localStorage.setItem('products', JSON.stringify(array));
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function localStorageSave() {
  const cartItems = document.querySelector('.cart__items');
  const itemsLocalStorage = JSON.parse(localStorage.getItem('products'));
  if (itemsLocalStorage === null) {
    localStorage.setItem('products', JSON.stringify([]));
  } else {
    itemsLocalStorage.forEach((item) => {
      cartItems.appendChild(createCartItemElement(item));
    });
  }
  sumSalePrice();
}

async function addItemCartApi(itemId) {
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  const cartItem = document.querySelector('.cart__items');
  try {
    const response = await fetch(endpoint);
    const objResponse = await response.json();
    const { id: sku, title: name, price: salePrice } = objResponse;
    cartItem.appendChild(createCartItemElement({ sku, name, salePrice }));
    array.push({ sku, name, salePrice });
    localStorage.setItem('products', JSON.stringify(array));
    sumSalePrice();
  } catch (error) {
    window.alert(error);
  }
}

function addItemCart() {
  const buttonCards = document.querySelectorAll('.item__add');
  buttonCards.forEach((card) => {
    card.addEventListener('click', function (event) {
      const id = getSkuFromProductItem(event.target.parentNode);
      return addItemCartApi(id);
    });
  });
}

function createLoading() {
  const load = document.querySelector('.items');
  const loadingElem = document.createElement('section');
  loadingElem.className = 'loading';
  loadingElem.innerText = 'Loading...';
  loadingElem.style.fontSize = '30px';
  loadingElem.style.fontFamily = 'sans-serif';
  loadingElem.style.alignSelf = 'center';
  loadingElem.style.margin = '200px 0';
  loadingElem.style.padding = '100px';
  load.appendChild(loadingElem);
}

function removeLoading() {
  const cartItem = document.querySelector('.items');
  const load = document.querySelector('.loading');
  cartItem.removeChild(load);
}

async function dataSearch(current) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${current}`;

  try {
    const response = await fetch(endpoint);
    const objResponse = await response.json();
    const results = objResponse.results;
    const item = document.querySelector('.items');
    removeLoading();
    results.forEach((result) => {
      const { id: sku, title: name, thumbnail: image } = result;
      item.appendChild(createProductItemElement({ sku, name, image }));
    });
  } catch (error) {
    window.alert(error);
  }
  addItemCart();
}

window.onload = function onload() {
  createLoading();
  setTimeout(() => {
    dataSearch('computador');
  }, 1500);
  sumSalePrice();
  removeItems();
  localStorageSave();
};
