// Brenno Calado Project

let resultList = [];

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

function toLocalStorage({ sku, name, salePrice }) {
  const storage = localStorage.getItem(sku);
  localStorage.setItem(sku, JSON.stringify({ sku, name, salePrice }));
  return storage;
}

function sumCartPrices() {
  let cartPrice = 0;
  Object.values(localStorage).forEach((product) => {
    cartPrice += JSON.parse(product).salePrice;
  });
  if (cartPrice === 0) {
    document.querySelector('.total-price').innerHTML = 'Carrinho vazio';
  } else {
    document.querySelector('.total-price').innerHTML = `${Math.round(cartPrice * 100) / 100}`;
  }
  return cartPrice;
}

function emptyCart() {
  localStorage.clear();
  document.querySelector('.cart__items').innerHTML = '';
  sumCartPrices();
}

function cartItemClickListener(evt) {
  evt.target.remove();
  localStorage.removeItem(evt.target.id);
  sumCartPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = `${sku}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
  toLocalStorage({ sku, name, salePrice });
  sumCartPrices();
  return li;
}

async function getSingleItem(item) {
  const endpoint = `https://api.mercadolibre.com/items/${item}`;
  try {
    const { id: sku, title: name, base_price: salePrice } = await fetch(endpoint)
      .then(response => response.json());
    createCartItemElement({ sku, name, salePrice });
  } catch (reason) {
    console.log(reason);
  }
}

function retrieveLocalStorage() {
  if (localStorage.length) {
    Object.entries(localStorage).forEach((id) => {
      const { sku, name, salePrice } = JSON.parse(id[1]);
      createCartItemElement({ sku, name, salePrice });
    });
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function loader() {
  const load = document.createElement('span');
  load.className = 'loading';
  load.innerHTML = 'loading...';
  document.querySelector('.items').appendChild(load);
}

function addToCart(evt) {
  const parentNode = evt.target.parentNode;
  getSingleItem(getSkuFromProductItem(parentNode));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addToCart);

  return section;
}

function productsToItemsSection(marketList) {
  const itemsSection = document.querySelector('section .items');
  marketList.forEach((product) => {
    const { id, title, thumbnail } = product;
    itemsSection.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
}

async function getProductList(productName) {
  document.querySelector('section .items').innerHTML = '';
  loader();
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productName}`)
    .then(response => response.json().then((data) => {
      resultList = data.results;
      productsToItemsSection(resultList);
      document.querySelector('.loading').remove();
    }))
    .catch(reason => console.log(reason));
}

function searchAPI(evt) {
  if (evt.keyCode === 13 || evt.type === 'click') {
    getProductList(document.querySelector('#search-input').value);
  }
}

function inputListeners() {
  document.querySelector('#search-input').addEventListener('keyup', searchAPI);
  document.querySelector('#search-button').addEventListener('click', searchAPI);
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
}

window.onload = function onload() {
  getProductList('computador');
  retrieveLocalStorage();
  inputListeners();
};
