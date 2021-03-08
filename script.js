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
/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

*/
function cartItemClickListener(event) {
  event.target.remove();
  localStorage.removeItem(event.target.item);
}

async function storeValue(param) {
  const totalV = document.querySelector('.totalValor');
  const b = await Number(localStorage.getItem('value')) + (param);
  await localStorage.setItem('value', b);
  totalV.innerText = `R$ ${localStorage.getItem('value')}`;
}

function retrieveValue() {
  const totalV = document.querySelector('.totalValor');
  const value = localStorage.getItem('value');
  totalV.innerText = `R$ ${value}`;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const a = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  storeValue(salePrice);
  li.innerText = a;
  localStorage.setItem('item', a);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function storeInfo() {
  const items = document.querySelector('.cart__items').innerText;
  localStorage.setItem('item', items);
}

function emptyAllCart() {
  const emptyComplete = document.querySelectorAll('.cart__item');
  for (i = 0; i < emptyComplete.length; i += 1) {
    emptyComplete[i].remove();
    localStorage.clear();
  }
}

function deleteCart() {
  const emptyAll = document.querySelector('.empty-cart');
  emptyAll.addEventListener('click', emptyAllCart);
}

function loading() {
  const container = document.querySelector('.container');
  const paragraph = document.createElement('p');
  paragraph.innerText = 'loading...';
  paragraph.className = 'loading';
  container.appendChild(paragraph);
}

function loadEnd() {
  const container = document.querySelector('.loading');
  container.remove();
}
async function createElement(term) {
  await fetch(`https://api.mercadolibre.com/items/${term}`)
    .then(response =>
      response.json())
      .then((data) => {
        const ol = document.querySelector('.cart__items');
        ol.appendChild(createCartItemElement(data));
      });
  storeInfo();
  deleteCart();
}

function chosen(event) {
  buttonText = event.target.parentNode.firstChild.innerText;
  createElement(buttonText);
}

function select() {
  const buttonAdd = document.querySelectorAll('.item__add');
  for (let i = 0; i < buttonAdd.length; i += 1) {
    buttonAdd[i].addEventListener('click', chosen);
  }
}

function retrieveLocalStorage() {
  const cartItems = localStorage.getItem('item');
  const frases = cartItems.split('\n');
  for (let i = 0; i < frases.length; i += 1) {
    console.log(frases[i]);
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = frases[i];
    li.addEventListener('click', cartItemClickListener);
    const ol = document.querySelector('.cart__items');
    ol.appendChild(li);
    deleteCart();
  }
}

retrieveMercadoLivre = (term) => {
  loading();
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`)
  .then(response => response.json())
    .then((data) => {
      const itensMercado = document.querySelector('.items');
      loadEnd();
      data.results.forEach((result) => {
        const { id: sku, title: name, thumbnail: image } = result;
        const element = createProductItemElement({ sku, name, image });
        itensMercado.appendChild(element);
      });
      select();
    });
};

window.onload = function onload() {
  retrieveMercadoLivre('computador');
  retrieveLocalStorage();
  retrieveValue();
};
