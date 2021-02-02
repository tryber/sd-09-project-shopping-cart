// Brenno Calado Project

let resultList = [];
let cartPrice = 0;

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

function toLocalStorage(sku, name, salePrice) {
  const cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
  cartProducts[sku] = { name, salePrice };
  localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
}

async function sumCartPrices(item) {
  cartPrice += item;
  document.querySelector('.total-price').innerHTML = `${Math.round(cartPrice * 100) / 100}`;
}

function emptyCart() {
  localStorage.setItem('cartProducts', '{}');
  document.querySelector('.cart__items').innerText = '';
  document.querySelector('.total-price').innerText = '';
}

async function cartItemClickListener(evt) {
  const cartStorage = JSON.parse(localStorage.getItem('cartProducts'));
  const clickedCartItem = Object.entries(cartStorage).find(entry => entry[0] === evt.target.id);
  await sumCartPrices(-(clickedCartItem[1].salePrice));
  delete cartStorage[`${evt.target.id}`];
  localStorage.setItem('cartProducts', JSON.stringify(cartStorage));
  evt.target.parentNode.removeChild(evt.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = `${sku}`;
  li.addEventListener('click', cartItemClickListener);
  toLocalStorage(sku, name, salePrice);
  return li;
}

async function getSingleItem(item) {
  const endpoint = `https://api.mercadolibre.com/items/${item}`;
  await fetch(endpoint).then(response => response.json())
    .then((data) => {
      const { id: sku, title: name, base_price: salePrice } = data;
      document.querySelector('.cart__items')
        .appendChild(createCartItemElement({ sku, name, salePrice }));
      sumCartPrices(salePrice);
    })
    .catch(reason => console.log(reason));
}

function retrieveLocalStorage() {
  const cartStorage = JSON.parse(localStorage.getItem('cartProducts'));
  if (!cartStorage) {
    localStorage.setItem('cartProducts', '{}');
  } else {
    Object.keys(cartStorage).forEach((id) => {
      getSingleItem(id);
    });
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addToCart(evt) {
  const parentNode = evt.target.parentNode;
  getSingleItem(getSkuFromProductItem(parentNode));
}

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addToCart);

  return section;
}

function productsToItemsSection(marketList) {
  marketList.forEach(({ id, title, thumbnail }) => {
    document.querySelector('section .items')
      .appendChild(createProductItemElement(id, title, thumbnail));
  });
}

async function getProductList(productName) {
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productName}`)
    .then(response => response.json().then((data) => {
      resultList = data.results;
      productsToItemsSection(resultList);
    }))
    .catch(reason => console.log(reason));
}

function searchAPI(evt) {
  if (evt === undefined || evt.keyCode === 13 || evt.type === 'click') {
    document.querySelector('section .items').innerHTML = '';
    getProductList(document.querySelector('#search-input').value);
  }
}

function inputListeners() {
  document.querySelector('#search-input').addEventListener('keyup', searchAPI);
  document.querySelector('#search-button').addEventListener('click', searchAPI);
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
}

window.onload = function onload() {
  inputListeners();
  searchAPI();
  retrieveLocalStorage();
};
