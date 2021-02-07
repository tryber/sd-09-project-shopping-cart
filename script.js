function saveCart() {
  const cartList = document.querySelector('.cart__items');
  localStorage.setItem('cart', cartList.innerHTML);
}

function loadCart() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('cart');
}

function createLoading() {
  const loadingText = document.createElement('p');
  loadingText.className = 'loading';
  loadingText.innerText = 'loading...';
  document.body.appendChild(loadingText);
}
function stopLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
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

function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function addToCart() {
  const items = document.querySelector('.items');
  items.addEventListener('click', async (event) => {
    const mySku = getSkuFromProductItem(event.target.parentNode);
    const endpoint = `https://api.mercadolibre.com/items/${mySku}`;
    const response = await fetch(endpoint)
    .then(res => res.json());
    const item = {
      sku: mySku,
      name: response.title,
      salePrice: response.price,
    };
    const cartItems = document.querySelector('.cart__items');
    const cartItem = createCartItemElement(item);
    cartItems.appendChild(cartItem);
    saveCart();
  });
}

async function getMLResults() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  createLoading();
  const response = await fetch(endpoint);
  const object = await response.json();
  const results = object.results;
  const itemsElement = document.querySelector('.items');
  results.forEach((result) => {
    const obj = {
      sku: result.id,
      name: result.title,
      image: result.thumbnail,
    };
    const element = createProductItemElement(obj);
    itemsElement.appendChild(element);
  });
  stopLoading();
}
function emptyCart() {
  emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    saveCart();
  });
}

window.onload = function onload() {
  getMLResults();
  addToCart();
  emptyCart();
  loadCart();
};
