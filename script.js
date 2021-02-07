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

async function retriveMercadoLivreResults(term) {
  carregaLoading();
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;

  const response = await fetch(endpoint);
  const object = await response.json();

  const results = object.results;
  const itemsElement = document.querySelector('.items');

  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(element);
  });
  descarregaLoading();
}

function carregaLoading() {
  sectionSpan = document.querySelector('.cart');
  spanLoading = document.createElement('span');
  spanLoading.className = 'loading';
  sectionSpan.appendChild(spanLoading);
  spanLoading.innerText = 'loading';
}

function descarregaLoading() {
  sectionSpan = document.querySelector('.cart');
  spanLoading = document.querySelector('.loading');
  sectionSpan.removeChild(spanLoading);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  document.querySelector('.cart__items').removeChild(event.target);
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function saveCart() {
  localStorage.setItem('cartItems', document.querySelectorAll('.cart__item'));
}

async function apiId(itemId) {
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;

  const response = await fetch(endpoint);
  const object = await response.json();

  const param = { sku: object.id, name: object.title, salePrice: object.price };
  document.querySelector('.cart_items')
  .appendChild(createCartItemElement(param));
  saveCart();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  retriveMercadoLivreResults('computador');
  apiId(itemId)
};
