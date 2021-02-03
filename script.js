function textLoading(action) {
  const elementLoading = document.querySelector('.loading');
  if (action === 'display') {
    elementLoading.innerText = 'LOADING...';
  }
  elementLoading.innerText = '';
}

async function retrieveProductsList() {
  // recupera a lista do mercado livre
  textLoading('display');
  try {
    const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    const response = await fetch(endpoint);
    const object = await response.json();
    return object.results;
  } finally {
    textLoading('hide');
  }
}

function createProductImageElement(imageSource) { // base
  // cria elementos html image
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // base
  // cria elementos personalizaveis de acordo os paramentros
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) { // base
  // cria a section .item e add seus elements e images
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getSkuFromProductItem(item) { // base
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) { // base
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) { // base
  // Cria elementos li e add sua class, innerText e EVENT
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addProductToShoppingCart(event) {
  // Realiza uma requisição para o end point e add ao Carrinho
  const selectItem = event.target.parentNode.firstElementChild.innerText;
  const endpoint = `https://api.mercadolibre.com/items/${selectItem}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const { id: sku, title: name, price: salePrice } = object;
  father = document.querySelector('.cart__items');
  father.appendChild(createCartItemElement({ sku, name, salePrice }));
}

function addEventListenerToButton() {
  // add o evento aos botoes dos itens
  const allButtons = document.querySelectorAll('.item__add');
  allButtons.forEach((button) => {
    button.addEventListener('click', addProductToShoppingCart);
  });
}

async function displayProductList() {
  // append os elements recuperados do endpoint na section items
  const results = await retrieveProductsList();
  const itemsElement = document.querySelector('.items');
  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(element);
    addEventListenerToButton();
  });
}

function clearAllShoppingCart() {
  const buttonClearAll = document.querySelector('.empty-cart');
  buttonClearAll.addEventListener('click', function () {
    const itemsCart = document.querySelectorAll('.cart__item');
    itemsCart.forEach((item) => {
      item.remove();
    });
  });
}

window.onload = function onload() {
  displayProductList();
  clearAllShoppingCart();
};
