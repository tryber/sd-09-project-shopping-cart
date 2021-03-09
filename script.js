
function stopLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

function setLocalStorage() {
  const cartItemsList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartItemsList', cartItemsList);
}

function decreasePrices(event) {
  const getPrice = document.querySelector('.total-price').innerText;
  const searchNumber = event.target.innerText.indexOf('$');
  const number = event.target.innerText.slice(searchNumber + 1);
  const valueConvert = Number(number);
  const degree = Math.round((Number(getPrice) - valueConvert) * 100) / 100;
  document.querySelector('.total-price').innerHTML = Number(degree);
}

// consultei reposoitório do colega Layo para conseguir fazer a função decreasePrices

function cartItemClickListener(event) {
  event.target.remove();
  setLocalStorage();
  decreasePrices(event);
}

async function sumListItems(salePrice) {
  const stringPrice = document.querySelector('.total-price').innerText;
  const numberPrice = Number(stringPrice);
  const totalPrice = await Math.round((Number(salePrice) + numberPrice) * 100) / 100;
  document.querySelector('.total-price').innerHTML = Number(totalPrice);
  setLocalStorage();
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
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumListItems(salePrice);
  return li;
}

async function mercadoLivreResults(term) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  const response = await fetch(endpoint);
  const obj = await response.json();
  const results = obj.results;
  const itemsElement = document.querySelector('.items');
  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(element);
  });
  stopLoading();
}

function createCartListItem(itemList) {
  const cartItem = document.querySelector('.cart__items');
  cartItem.appendChild(itemList);
}

function searchID(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(response => response.json())
  .then((object) => {
    const { id: sku, title: name, price: salePrice } = object;
    const itemList = createCartItemElement({ sku, name, salePrice });
    createCartListItem(itemList);
    setLocalStorage();
    sumListItems(salePrice);
  })
  .catch(error => window.alert(error));
}

function getId(button) {
  if (button.target.className === 'item__add') {
    const id = button.target.parentNode.firstChild.innerText;
    searchID(id);
  }
}

function addList() {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', getId);
}

function getLocalStorage() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cartItemsList');
  const item = document.querySelectorAll('.cart__item');
  for (let i = 0; i < item.length; i += 1) {
    item[i].addEventListener('click', cartItemClickListener);
  }
}
// consultei o repositório da colega Leticia Lima para consultar a posição dos elementos
// para a questão do GetItem e com auxílio do Rafa Reis para me ajudar no que não estava rodando
// nomes de variável diferente onde deveria ser igual

function btnEmptyCart() {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', function () {
    const cartLists = document.querySelector('.cart__items');
    cartLists.innerHTML = null;
    localStorage.clear();
  });
}

window.onload = function onload() {
  mercadoLivreResults('computador');
  addList();
  btnEmptyCart();
  getLocalStorage();
};
