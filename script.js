function displayLoadingText() {
  const father = document.querySelector('.text__container');
  const displayLoading = document.createElement('div');
  displayLoading.className = 'loading';
  displayLoading.innerText = 'LOADING...';
  father.appendChild(displayLoading);
}

function hideLoadingText() {
  const father = document.querySelector('.text__container');
  father.firstChild.remove();
}

async function retrieveProductsList() {
  displayLoadingText();
  try {
    const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    const response = await fetch(endpoint);
    const object = await response.json();
    return object.results;
  } finally {
    hideLoadingText();
  }
}

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

function saveLocalStorage() {
  const shoppingCart = document.querySelector('.cart__items');
  localStorage.setItem('shoppingCart', shoppingCart.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalStorage();
}

function restoreLocalStorage() {
  const cart = document.querySelector('.cart__items');
  if (localStorage.length !== 0) {
    cart.innerHTML = localStorage.getItem('shoppingCart');
  }
  cart.addEventListener('click', cartItemClickListener);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function sumCart(price) {
  const localTotal = document.querySelector('.total');
  let sum = Number(localTotal.innerText);
  if (sum) {
    sum += price;
    localTotal.innerText = sum.toFixed(0);
  } else {
    localTotal.innerText = price.toFixed(0);
  }
}

async function addProductToShoppingCart(event) {
  const selectItem = event.target.parentNode.firstElementChild.innerText;
  const endpoint = `https://api.mercadolibre.com/items/${selectItem}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const { id: sku, title: name, price: salePrice } = object;
  father = document.querySelector('.cart__items');
  father.appendChild(createCartItemElement({ sku, name, salePrice }));
  saveLocalStorage();
  sumCart(salePrice);
}

function addEventListenerToButton() {
  const allButtons = document.querySelectorAll('.item__add');
  allButtons.forEach((button) => {
    button.addEventListener('click', addProductToShoppingCart);
  });
}

async function displayProductList() {
  const results = await retrieveProductsList();
  const itemsElement = document.querySelector('.items');
  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(element);
    addEventListenerToButton();
  });
}

function clearAllShoppingCart() {
  const buttonClearAll = document.querySelector('.empty-cart');
  buttonClearAll.addEventListener('click', function () {
    const itemsCart = document.querySelectorAll('.cart__item');
    itemsCart.forEach((item) => {
      item.remove();
    });
    saveLocalStorage();
  });
}

window.onload = function onload() {
  displayProductList();
  clearAllShoppingCart();
  restoreLocalStorage();
};
