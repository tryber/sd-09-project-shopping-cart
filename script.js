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

function addItemsToLocalStorage() {
  const cartList = document.querySelector('.cart__items').innerHTML;
  const totalPrice = document.querySelector('.total-price').innerText;
  localStorage.setItem('cart', cartList);
  localStorage.setItem('price', totalPrice);
}

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.clear();
  calculateTotalPrice();
  addItemsToLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getItemsStoraged() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  const cartItems = document.querySelectorAll('.cart__item');
  [...cartItems].forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
  calculateTotalPrice();
}

function calculateTotalPrice() {
  const li = document.getElementsByTagName('li');
  const price = document.querySelector('.total-price');
  let totalPrice = 0;
  [...li].forEach((item) => {
    totalPrice += +(item.innerText.split('$')[1]);
  })
  price.innerText = totalPrice;
}

async function fetchAddItemToCart(itemID) {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const object = await response.json();
  const items = document.querySelector('.cart__items');
  const { id, title, price } = object;
  const item = createCartItemElement({ sku: id, name: title, salePrice: price });
  items.appendChild(item);
  calculateTotalPrice();
  addItemsToLocalStorage();
}

function getSkuFromProductItem(item) {
  const id = item.querySelector('span.item__sku').innerText;
  fetchAddItemToCart(id);
}

function addToCart() {
  document.querySelectorAll('.item__add').forEach((button) => {
    button.addEventListener('click', function (event) {
      const selectedElement = event.target.parentElement;
      getSkuFromProductItem(selectedElement);
    });
  });
}

async function fetchSearch(searchTerm) {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  document.body.appendChild(loading);
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`);
  const object = await response.json();
  object.results.forEach((value) => {
    const { id, title, thumbnail } = value;
    const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
    document.querySelector('.items').appendChild(item);
  });
  document.body.removeChild(loading);
  addToCart();
}

function removeItems() {
  document.querySelector('.cart__items').innerHTML = '';
  localStorage.clear();
  calculateTotalPrice();
}

window.onload = function onload() {
  fetchSearch('computador');
  getItemsStoraged();
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', removeItems);
};
