window.onload = function onload() { };

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
  eventTextIDproduct = event.target.innerText.split('').splice(5,13).join('');
  const obj = Object.entries(localStorage).find(value => value[1] = eventTextIDproduct);
  localStorage.removeItem(obj[0]);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function itemListClickListener() {
  const buttons = document.querySelectorAll('.item__add');
  const cartList = document.querySelector('.cart');
  buttons.forEach((button) => button.addEventListener('click', async function(event) {
    const itemID = getSkuFromProductItem(event.target.parentNode);
    const itemSearched = await fetchItemsById(itemID);
    const object = { sku: itemSearched.id, name: itemSearched.title, salePrice: itemSearched.price };
    cartList.appendChild(createCartItemElement(object));
    // local storage save
    localStorage.setItem(Math.random()*100, JSON.stringify(object));
  }));
}

async function fetchItemsByType(query = 'computador') {
  const URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`
  const response = await fetch(URL);
  const jsonItemsResponse = await response.json();
  return jsonItemsResponse;
}

async function fetchItemsById(ItemID) {
  const URL = `https://api.mercadolibre.com/items/${ItemID}`;
  const response = await fetch(URL);
  const jsonItemIDResponse = await response.json();
  return jsonItemIDResponse;
}

function fillSectiomItems(data) {
  const sectionItems = document.querySelector('.items');
  data.results.forEach((item) => {
    const element = createProductItemElement({ sku : item.id, name: item.title, image: item.thumbnail });
    sectionItems.appendChild(element);
  });
}

function fillCartLoadItems() {
  Object.values(localStorage).forEach((item) => {
    const value = JSON.parse(item);
    const cartList = document.querySelector('.cart');
    cartList.appendChild(createCartItemElement({ sku: value.sku, name: value.name, value: value.salePrice }));
  });
}

async function start() {
  try {
    await fetchItemsByType().then(data => fillSectiomItems(data));
    itemListClickListener();
    fillCartLoadItems();
  } catch (error) {
    alert(error)
  }
}

start();
