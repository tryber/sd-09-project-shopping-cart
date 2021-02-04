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

let totalPrice = 0;

function saveCart() {
  const cartList = document.querySelector('ol.cart__items');
  localStorage.setItem('cart', cartList.innerHTML);
  localStorage.setItem('total', totalPrice);
}

function cartItemClickListener(event) {
  const productPrice = event.target.innerText.split('$')[1];
  totalPrice -= +(productPrice);
  document.querySelector('.total-price').innerText = totalPrice;
  event.target.remove();
  if (!document.getElementsByTagName('li').length) {
    totalPrice = 0;
    document.querySelector('.total-price').innerText = totalPrice;
  }
  localStorage.clear();
  saveCart();
}

function getCart() {
  const cartList = document.querySelector('ol.cart__items');
  cartList.innerHTML = localStorage.getItem('cart');
  const cartItems = document.querySelectorAll('li.cart__item');
  cartItems.forEach(item => item.addEventListener('click', cartItemClickListener));
  totalPrice = +(localStorage.getItem('total'));
  document.querySelector('.total-price').innerText = totalPrice;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchAddToCartRequest = async (itemId) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const object = await response.json();
  const { id, title, price } = object;
  const item = createCartItemElement({ sku: id, name: title, salePrice: price });
  totalPrice += price;
  document.querySelector('.total-price').innerText = totalPrice;
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(item);
  saveCart();
};

function getProductId(event) {
  const id = event.target.parentNode.firstChild.innerText;
  fetchAddToCartRequest(id);
}

function addToCart() {
  document.querySelectorAll('.item__add').forEach((button) => {
    button.addEventListener('click', getProductId);
  });
}

async function fetchProducts(query) {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  document.body.appendChild(loading);
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  object.results.forEach((result) => {
    const { id, title, thumbnail } = result;
    const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
    document.querySelector('.items').appendChild(item);
  });
  document.body.removeChild(loading);
  addToCart();
}

function emptyCart() {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    totalPrice = 0;
    document.querySelector('.total-price').innerText = totalPrice;
    localStorage.clear();
    saveCart();
  });
}

window.onload = function onload() {
  fetchProducts('computador');
  emptyCart();
  getCart();
};
