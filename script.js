// Brenno Calado Project

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

function toLocalStorage({ sku, name, salePrice }) {
  const storage = localStorage.getItem(sku);
  localStorage.setItem(sku, JSON.stringify({ sku, name, salePrice }));
  return storage;
}

function sumCartPrices() {
  let cartPrice = 0;
  if (localStorage.length) {
    const storageObjects = Object.keys(localStorage);
    storageObjects.forEach((key) => {
      cartPrice += parseFloat(JSON.parse(localStorage.getItem(key)).salePrice);
    });
    document.querySelector('.total-price').innerText = `${Math.round(cartPrice * 100) / 100}`;
  } else {
    document.querySelector('.total-price').innerText = 'Carrinho vazio';
  }
  return cartPrice;
}

function emptyCart() {
  localStorage.clear();
  document.querySelector('.cart__items').innerHTML = '';
  sumCartPrices();
}

function cartItemClickListener(evt) {
  evt.target.remove();
  localStorage.removeItem(evt.target.id);
  sumCartPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = `${sku}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
  toLocalStorage({ sku, name, salePrice });
  sumCartPrices();
  return li;
}

function retrieveLocalStorage() {
  if (localStorage.length) {
    storageObjects = Object.keys(localStorage);
    storageObjects.forEach((key) => {
      const { sku, name, salePrice } = JSON.parse(localStorage.getItem(key));
      createCartItemElement({ sku, name, salePrice });
    });
  }
}

function getInfoFromProductItem(item) {
  const name = item.querySelector('span.item__title').innerText;
  const sku = item.querySelector('span.item__sku').innerText;
  const salePrice = item.querySelector('span.item__price').innerText;
  return { sku, name, salePrice };
}

function loader() {
  const load = document.createElement('span');
  load.className = 'loading';
  load.innerHTML = 'loading...';
  document.querySelector('.items').appendChild(load);
}

function addToCart(evt) {
  const parentNode = evt.target.parentNode;
  const { sku, name, salePrice } = getInfoFromProductItem(parentNode);
  createCartItemElement({ sku, name, salePrice });
}

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', price));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addToCart);

  return section;
}

function productsToItemsSection(marketList) {
  const itemsSection = document.querySelector('section .items');
  marketList.forEach((product) => {
    const { id, title, thumbnail, price } = product;
    itemsSection.appendChild(createProductItemElement({
      sku: id, name: title, image: thumbnail, price,
    }));
  });
}

async function getProductList(productName) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productName}`)
    .then(response => response.json())
    .then(data => data.results)
    .catch(reason => console.log(reason));
}

async function searchAPI(evt) {
  if (evt === 'computador' || evt.keyCode === 13 || evt.type === 'click') {
    document.querySelector('section .items').innerHTML = '';
    loader();
    const productList = await getProductList(document.querySelector('#search-input').value);
    productsToItemsSection(productList);
    document.querySelector('.loading').remove();
  }
}

function inputListeners() {
  document.querySelector('#search-input').addEventListener('keyup', searchAPI);
  document.querySelector('#search-button').addEventListener('click', searchAPI);
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
}

window.onload = function onload() {
  searchAPI('computador');
  retrieveLocalStorage();
  inputListeners();
};
