function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

async function fetchItemById(itemId) {
  const endPoint = `https://api.mercadolibre.com/items/${itemId}`;
  const response = await fetch(endPoint);
  return response.json();
}

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

function ClearCart() {
  const buttomClear = document.querySelector('.empty-cart');
  buttomClear.addEventListener('click', () => {
    document.querySelectorAll('li')
    .forEach(li => li.remove());
  });
}

async function sumAllItemPricesOnCart() {
  let sumPrices = 0;
  const allCartItens = document.querySelectorAll('.cart__item');
  allCartItens.forEach(item => sumPrices += +item.innerText.split('$')[1]);
  document.querySelector('.total-price').innerText = `Total: $${sumPrices} BRL`;
}

async function sendItemToCart(event) {
  const section = event.target.parentNode;
  const productId = getSkuFromProductItem(section);
  const { id, title, price } = await fetchItemById(productId);
  const cartElement = createCartItemElement({ sku: id, name: title, salePrice: price });
  document.querySelector('.cart__items').appendChild(cartElement);
  sumAllItemPricesOnCart();
}

function addItem() {
  const buttonAdd = document.querySelectorAll('button.item__add');
  buttonAdd.forEach((button) => {
    button.addEventListener('click', sendItemToCart);
  });
}

async function fetchAllProducts(productType) {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${productType}`;
  const response = await fetch(endPoint);
  const object = await response.json();
  const results = object.results;
  results.forEach((result) => {
    const { id, title, thumbnail } = result;
    const structure = createProductItemElement({ sku: id, name: title, image: thumbnail });
    document.querySelector('.items').appendChild(structure);
  });
  addItem();
}

window.onload = function onload() {
  fetchAllProducts('computador');
  ClearCart();
};
