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

function saveToLocalStorage(element) {
  localStorage.savedItems = element.innerHTML;
}

async function sumPrices() {
  let sum = 0;
  const totalPrice = document.querySelector('.total-price');
  const li = document.querySelectorAll('.cart__item');
  li.forEach(item => (sum += +item.innerText.split('$')[1]));
  totalPrice.innerText = sum;
}

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  event.target.remove();
  saveToLocalStorage(cartItems);
  sumPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function startLoading() {
  const container = document.querySelector('.container');
  const loadingText = createCustomElement('span', 'loading', 'loading...');
  container.appendChild(loadingText);
  console.log(loadingText)
}

function endLoading() {
  document.querySelector('.loading').remove();
}

async function fetchCartItemElement(ItemID) {
  const endpoint = `https://api.mercadolibre.com/items/${ItemID}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const { id: sku, title: name, price: salePrice } = object;
  const elementHTM = createCartItemElement({ sku, name, salePrice });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(elementHTM);
  saveToLocalStorage(cartItems);
  sumPrices();
}

async function fetchProductList(QUERY) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const productObj = object.results;
  endLoading();

  productObj.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const item = createProductItemElement({ sku, name, image });
    listItems = document.querySelector('.items');
    listItems.appendChild(item);
  });

  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach(button => button
    .addEventListener('click', (event) => {
      const productId = getSkuFromProductItem(event.target.parentNode);
      fetchCartItemElement(productId);
    }));
}

function loadFromLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = localStorage.savedItems;
  const li = document.querySelectorAll('.cart__item');
  li.forEach(el => el.addEventListener('click', cartItemClickListener));
  sumPrices();
}

function removeCartItemElements() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  saveToLocalStorage(cartItems);
  sumPrices();
}

window.onload = function onload() {
  fetchProductList('computador');
  loadFromLocalStorage();
  startLoading();

  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', removeCartItemElements);


};
