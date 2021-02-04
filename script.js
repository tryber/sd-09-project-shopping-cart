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

function toLocalStorage(sku, name, salePrice) {
  localStorage.setItem(sku, JSON.stringify({ sku, name, salePrice }));
}

async function sumCartPrices() {
  let cartPrice = 0;
  await Object.values(localStorage).forEach((product) => {
    cartPrice += JSON.parse(product).salePrice;
  });
  document.querySelector('.total-price').innerHTML = `${Math.round(cartPrice * 100) / 100}`;
}

function removeFromLocalStorage(evt) {
  localStorage.removeItem(evt.target.id);
  sumCartPrices();
}

function emptyCart() {
  localStorage.clear();
  document.querySelector('.cart__items').innerText = '';
  document.querySelector('.total-price').innerText = '';
}

function cartItemClickListener(evt) {
  evt.target.parentNode.removeChild(evt.target);
  removeFromLocalStorage(evt);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = `${sku}`;
  li.addEventListener('click', cartItemClickListener);
  toLocalStorage(sku, name, salePrice);
  document.querySelector('.cart__items').appendChild(li);
  return li;
}

async function getSingleItem(item) {
  const endpoint = `https://api.mercadolibre.com/items/${item}`;
  await fetch(endpoint).then(response => response.json())
    .then((data) => {
      const { id: sku, title: name, base_price: salePrice } = data;
      createCartItemElement({ sku, name, salePrice });
      sumCartPrices();
    })
    .catch(reason => console.log(reason));
}

async function retrieveLocalStorage() {
  if (localStorage.length) {
    Object.values(localStorage).forEach((id) => {
      getSingleItem(JSON.parse(id).sku);
    });
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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

function loader() {
  const load = document.createElement('span');
  load.className = 'loading';
  load.innerHTML = 'loading...';
  document.querySelector('.items').appendChild(load);
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

window.onload = async function onload() {
  inputListeners();
  getProductList('computador');
  retrieveLocalStorage();
};
