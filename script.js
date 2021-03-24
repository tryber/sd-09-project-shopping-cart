// const fetch = require('node-fetch');

// WORK STORAGE
function saveData() {
  if (localStorage.TOTAL_PRICE === undefined) {
    localStorage.setItem('TOTAL_PRICE', 0);
  }
  if (localStorage.ITEM_COUNT === undefined) {
    localStorage.setItem('ITEM_COUNT', 0);
  }
}

function loadingScreen() {
  const load = document.createElement('p');
  const container = document.querySelector('.container');
  load.className = 'loading';
  load.innerText = 'loading...';
  container.appendChild(load);
}

function LoadingEnd() {
  const load = document.querySelector('.loading');
  load.remove();
}

// INITIAL FUNCTIONS -----------------------------------------------------------
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

// SOMA ----------------------------------------------------------------------
async function sum() {
  const lis = document.querySelectorAll('.cart__item');
  let totalValue = 0;
  lis.forEach((cartItem) => {
    const textContent = cartItem.innerText;
    const value = parseFloat(textContent.substring(textContent.indexOf('$') + 1), 10);
    totalValue = +totalValue + value;
  });
  console.log(lis);
  return totalValue;
}

async function TotalPriceUnreal() {
  try {
    const totalPrice = await sum();
    const totalPriceTag = document.querySelector('.total-price');
    totalPriceTag.innerText = totalPrice;
  } catch (error) {
    window.alert(error);
  }
}

function loadTotalPrice() {
  TotalPriceUnreal();
}

// async function sum() {
//   const sumTotal = parseInt(localStorage.TOTAL_PRICE, 10);
//   return sumTotal;
// }

// async function TotalPriceUnreal() {
//   try {
//     const totalPrice = await sum();
//     const totalPriceTag = document.querySelector('.total-price');
//     totalPriceTag.innerText = totalPrice;
//   } catch (error) {
//     window.alert(error);
//   }
// }

// function loadTotalPrice() {
//   TotalPriceUnreal();
// }

async function cartItemClickListener(event) {
  // cole seu codigo aqui

  // drop item in cart shop
  event.target.remove();
  const key = event.target.id;
  localStorage.removeItem(key);
  const textItem = event.target.innerText;
  const itemPrice = parseInt(textItem.substring(textItem.indexOf('$') + 1), 10);
  const total = parseInt(localStorage.TOTAL_PRICE, 10) - itemPrice;
  localStorage.setItem('TOTAL_PRICE', total);
  loadTotalPrice();
}

function createCartItemElement({ sku, name, salePrice, elementId }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.id = `item_cart_${elementId}`;
  return li;
}

// ADD ITEM TO CART --------------------------------------------------------------
async function fechApiMlItem(sku) {
  loadingScreen();
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  return fetch(endpoint)
    .then(product => product.json());
}

async function selectToCart(event) {
  const targetId = event.target.id;
  const resultKey = targetId.replace('button', 'sku');
  const product = await fechApiMlItem(document.getElementById(resultKey).innerText);
  const { id: sku, title: name, price: salePrice } = product;
  const item = createCartItemElement({ sku, name, salePrice });
  // gabira add cart
  const ol = document.querySelector('.cart__items');
  ol.appendChild(item);

  // TRABALHANDO STORAGE
  const itemCount = parseInt(localStorage.ITEM_COUNT, 10) + 1;
  localStorage.setItem('ITEM_COUNT', itemCount);
  localStorage.setItem(`ITEM_${itemCount}`, item.innerText);
  const totalPrice = salePrice + parseInt(localStorage.TOTAL_PRICE, 10);
  localStorage.setItem('TOTAL_PRICE', totalPrice);

  // ATUALIZAÇOEs
  LoadingEnd();
  // cartListUpdate();
  loadTotalPrice();
}

// ATUALIZANDO CARINHO ----------------------------------------------------------------
function cartListUpdate() {
  count = localStorage.ITEM_COUNT;
  for (let index = 0; index < count; index += 1) {
    const key = `ITEM_${index + 1}`;
    if (localStorage.getItem(key) !== null && localStorage.getItem(key) !== undefined) {
      const itemStorage = localStorage.getItem(key);
      const sku = itemStorage.substring(5, itemStorage.indexOf(' | NAME:'));
      const name = itemStorage.substring(26, itemStorage.indexOf(' | PRICE:'));
      const salePrice = itemStorage.substring(itemStorage.indexOf('$') + 1);
      const loadElement = createCartItemElement({ sku, name, salePrice });
      loadElement.id = key;
      const sectionSelect = document.querySelector('.cart__items');
      sectionSelect.appendChild(loadElement);
    }
    loadTotalPrice();
  }
}

// SEARCH-------------------------------------------------------------------------------
async function fechApiMlSearch() {
  loadingScreen();
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
  LoadingEnd();
  loadTotalPrice();
}

// CLEAR LIST
function clearCart() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    const li = document.querySelectorAll('.cart__item');
    li.forEach((itemCart) => {
      localStorage.removeItem(itemCart.id);
      itemCart.remove();
    });
    localStorage.setItem('TOTAL_PRICE', 0);
    loadTotalPrice();
  });
}

window.onload = function onload() {
  createProdutctsList();
  saveData();
  cartListUpdate();
  clearCart();
  loadTotalPrice();
};
