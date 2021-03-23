// window.onload = async function onload() {
//   await cartItemClickListener();
// };

// const fetch = require('node-fetch');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, elementId) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  e.id = elementId;
  return e;
}

function createProductItemElement({ sku, name, image, elementId }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement(
    'span',
    'item__sku',
    sku,
    `sku_${elementId}`,
  ));
  section.appendChild(createCustomElement('span', 'item__title', name, 'name'));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
    `button_${elementId}`,
  ));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// adcionando item ao carrinho

async function fechApiMlItem(sku) {
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  return fetch(endpoint)
    .then(product => product.json());
}

async function selectToCart(event) {
  const keyID = event.target.id;
  const resultKey = keyID.replace('button', 'sku');
  const productID = document.getElementById(resultKey).innerText;
  const product = await fechApiMlItem(productID);
  const { id: sku, title: name, price: salePrice } = product;
  const sectionSelect = document.getElementsByClassName('cart__items');
  sectionSelect[0].appendChild(createCartItemElement({ sku, name, salePrice }));
}

// search

async function fechApiMlSearch() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return fetch(endpoint)
    .then(listProducts => listProducts.json())
    .then(listProducts => listProducts.results);
}

async function createProdutctsList() {
  const listProducts = await fechApiMlSearch();
  const sectionSelect = document.getElementsByClassName('items');
  listProducts.forEach((itemList, elementId) => {
    const { id: sku, title: name, thumbnail: image } = itemList;
    sectionSelect[0].appendChild(createProductItemElement({ sku, name, image, elementId }));
    const clickButtonToCart = document.getElementById(`button_${elementId}`);
    clickButtonToCart.addEventListener('click', selectToCart);
  });
}

window.onload = function onload() {
  fechApiMlSearch();
  createProdutctsList();
};
