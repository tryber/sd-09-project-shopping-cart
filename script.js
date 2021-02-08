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

// My Functions
async function calculateTotalCost() {
  const cartItems = document.querySelectorAll('li.cart__item');
  const totalCost = Array.from(cartItems).reduce((total, cartItem) => {
    const priceIndex = cartItem.innerText.lastIndexOf('PRICE: ') + 8;
    return (total + Number(cartItem.innerText.substr(priceIndex)));
  }, 0);

  const totalPriceSpan = document.querySelector('span.total-price');
  totalPriceSpan.innerText = totalCost;
}

function updateCartListStorage(cartList) {
  localStorage.setItem('savedItems', cartList.innerHTML);
  calculateTotalCost();
}

// Project Functions
function cartItemClickListener(event) {
  const cartList = event.target.parentNode;
  event.target.remove();
  updateCartListStorage(cartList);
  calculateTotalCost();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// My Functions
function apiLoadingMessage() {
  const loadingText = document.createElement('span');
  loadingText.className = 'loading';
  loadingText.innerText = 'loading...';
  return loadingText;
}

async function fetchProductSearch() {
  document.querySelector('section.items').appendChild(apiLoadingMessage());
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  await document.querySelector('span.loading').remove();
  return response.json();
}

async function fetchItemId(itemID) {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  return response.json();
}

async function addItemToCart(clickedItem) {
  const clickedItemId = getSkuFromProductItem(clickedItem.target.parentNode);
  const clickedItemInfo = await fetchItemId(clickedItemId);
  const cartList = document.querySelector('ol.cart__items');
  const output = {
    sku: clickedItemInfo.id,
    name: clickedItemInfo.title,
    salePrice: clickedItemInfo.price,
  };

  cartList.appendChild(createCartItemElement(output));
  updateCartListStorage(cartList);
  calculateTotalCost();
}

function clearCartEvent() {
  document.querySelector('ol.cart__items').innerHTML = '';
  document.querySelector('span.total-price').innerText = '';
  localStorage.clear();
}

async function generateProductList() {
  const productListContainer = document.querySelector('.items');
  const productsList = await fetchProductSearch();
  const { results } = productsList;
  results.forEach((product) => {
    const output = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };

    productListContainer.appendChild(createProductItemElement(output));
  });

  const buttons = document.querySelectorAll('button.item__add');
  buttons.forEach(button => button.addEventListener('click', addItemToCart));

  const clearCartButton = document.querySelector('button.empty-cart');
  clearCartButton.addEventListener('click', clearCartEvent);
}

function loadCart() {
  const cartList = document.querySelector('ol.cart__items');
  cartList.innerHTML = localStorage.getItem('savedItems');
  const storedItems = document.querySelectorAll('li.cart__item');
  storedItems.forEach(currentItem => currentItem.addEventListener('click', cartItemClickListener));
  calculateTotalCost();
}

window.onload = function onload() {
  generateProductList();
  loadCart();
};
