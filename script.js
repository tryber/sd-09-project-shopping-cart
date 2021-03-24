// window.onload = async function onload() {
//   await cartItemClickListener();
// };

// const fetch = require('node-fetch');

// WORK STORAGE

// function saveData() {
//   localStorage.setItem('item_cart_id', 0);
//   localStorage.setItem('total_price', 0);
// }

// INITIAL FUNCTIONS
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
  // cole seu codigo aqui
  // drop value in total price
  const texto = event.target.innerText;
  const slaceIndex = texto.substring(texto.indexOf('$') + 1);
  const totalPrice = parseInt(localStorage.getItem('total_price'), 10);
  // console.log(totalPrice);
  localStorage.setItem('total_price', totalPrice - slaceIndex);
  // console.log(localStorage.total_price);

  // drop item in cart shop
  // event.target.remove();

  // drop list cart
  event.target.clearCart();
}

function createCartItemElement({ sku, name, salePrice, elementId }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.id = `item_cart_${elementId}`;
  return li;
}

// ADD ITEM TO CART

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
  const elementId = parseInt(localStorage.item_cart_id, 10) + 1;
  localStorage.setItem('item_cart_id', elementId);
  const createElement = createCartItemElement({ sku, name, salePrice, elementId });
  sectionSelect[0].appendChild(createElement);
  // somando preço total
  const totalPrice = parseInt(localStorage.total_price, 10) + salePrice;
  localStorage.setItem('total_price', totalPrice);
}

// SEARCH

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

// SHOW CART LIS PRICE

// ----- pausa for other thins------

async function listTotalPrice() {
  const totalPriceSpan = document.getElementById('total-price-span');
  // console.log(totalPriceSpan);
  const totalPrice = localStorage.total_price;
  totalPriceSpan.innerText = `Preço total: $${totalPrice}`;
  // setTimeout(() => {
  //   console.log(total_Price)
  // }, 3000);
}

function cartListUpdate() {
  window.addEventListener('click', listTotalPrice);
}

// async function testedocaraio(){
//   console.log('asdfasd')
// }

// window.addEventListener('storage', () => {
//   // When local storage changes, dump the list to
//   // the console.
//   testedocaraio();
//   console.log('sampleList');
// });

// window.onstorage = () => {
//   // When local storage changes, dump the list to
//   // the console.
//   console.log('sampleList');
// };

// window.localStorage = cartListUpdate

// CLEAR LIST
function clearCart() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    console.log('limpou ');
    const li = document.querySelectorAll('.cart__item');
    li.forEach((itemCart) => {
      itemCart.remove();
    });
    localStorage.setItem('total_price', 0);
  });
}

window.onload = function onload() {
  fechApiMlSearch();
  createProdutctsList();
  // saveData();
  cartListUpdate();
  clearCart();
};
