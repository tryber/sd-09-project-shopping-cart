// window.onload = async function onload() {
//   await cartItemClickListener();
// };

// const fetch = require('node-fetch');

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// async function cartItemClickListener(event) {
//   // area estranha
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

async function fechApiML() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return fetch(endpoint)
    .then(listProducts => listProducts.json())
    .then(listProducts => listProducts.results);
}

async function createProdutctsList() {
  const listProducts = await fechApiML();
  const sectionSelect = document.getElementsByClassName('items');
  listProducts.forEach((itemList) => {
    const { id: sku, title: name, thumbnail: image } = itemList;
    sectionSelect[0].appendChild(createProductItemElement({ sku, name, image }));
  });
}

window.onload = function onload() {
  fechApiML();
  createProdutctsList();
};
