
function removeLoading() {
  const loadingElement = document.querySelector('.loading');
  loadingElement.remove();
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

async function sumItems() {
  let sum = 0;
  const totalPrice = document.querySelector('.total-price');
  const findInLi = document.querySelectorAll('.cart__item');
  findInLi.forEach(priceItem =>
    (sum += +priceItem.innerText.split('$')[1]));
  totalPrice.innerText = sum;
}

function saveInStorage(elemento) {
  localStorage.teste = elemento.innerHTML;
}

function cartItemClickListener(event) {
  event.target.remove();
  const priceElement = document.querySelector('.cart__items');
  saveInStorage(priceElement);
  sumItems();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function adcItem(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const { id: sku, title: name, price: salePrice } = object;
  const itemList = createCartItemElement({ sku, name, salePrice });
  const priceElement = document.querySelector('.cart__items');
  priceElement.appendChild(itemList);
  saveInStorage(priceElement);
  sumItems();
}


async function fetchInit() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(endpoint);
  const object = await response.json();
  removeLoading();
  const results = object.results;
  const createItens = document.querySelector('.items');
  results.forEach((obj) => {
    const { id: sku, title: name, thumbnail: image } = obj;
    const desc = createProductItemElement({ sku, name, image });
    createItens.appendChild(desc);
  });
  document.querySelectorAll('.item__add')
  .forEach((button) => {
    const sku = getSkuFromProductItem(button.parentNode);
    button.addEventListener('click', () => {
      adcItem(sku);
    });
  })
}

function loadingInStorage() {
  const priceElement = document.querySelector('.cart__items');
  priceElement.innerHTML = localStorage.teste;
  const recuperarLi = document.querySelectorAll('.cart__item');
  recuperarLi.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
    sumItems();
  });
}

function removeItemsCart() {
  const toEmpty = document.querySelector('.cart__items');
  toEmpty.innerText = '';
  sumItems();
}

window.onload = function onload() {
  fetchInit();
  const deflateCart = document.querySelector('.empty-cart');
  deflateCart.addEventListener('click', removeItemsCart);
  loadingInStorage();
};
