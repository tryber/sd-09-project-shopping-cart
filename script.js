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
  // coloque seu código aqui
  const item = event.target;
  const id = Number(item.id);
  document.querySelector('.cart__items').removeChild(item);
  const storageItem = JSON.parse(localStorage.getItem('MLCart'));
  const newStorage = storageItem.filter(itens => itens.id !== id);
  localStorage.setItem('MLCart', JSON.stringify(newStorage));
}

function getRandomInt() {
  min = Math.ceil(1);
  max = Math.floor(8000);
  return Math.floor(Math.random() * (max - min)) + min;
}

function rebuildCart() {
  const stored = localStorage;
}

function createCartItemElement({ sku, name, salePrice, id }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = id;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

let objLocalStorage = [];
const fetchSelectedItem = async (event) => {
  const id = getSkuFromProductItem(event.target.parentNode);
  const endpoint = `https://api.mercadolibre.com/items/${id}`;

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    }
    const salePrice = object.price;
    const name = object.title;
    const sku = object.id;
    const id = getRandomInt();
    const result = createCartItemElement({ sku, name, salePrice, id });
    const cartItens = document.querySelector('.cart__items');
    cartItens.appendChild(result);
    objLocalStorage.push({ sku: sku, name: name, salePrice: salePrice, id: id });
    localStorage.setItem('MLCart', JSON.stringify(objLocalStorage));
  } catch (error) {
    window.alert(error);
  }
};

const fetchItensComputers = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    }
    object.results.forEach((item) => {
      const image = item.thumbnail;
      const name = item.title;
      const sku = item.id;
      const eachResult = createProductItemElement({ sku, name, image });
      const itens = document.querySelector('.items');
      itens.appendChild(eachResult);
    });
  } catch (error) {
    window.alert(error);
  }
  const addToCartButtons = document.querySelectorAll('.item__add');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', fetchSelectedItem);
  });
};

window.onload = function onload() {
  fetchItensComputers();
  rebuildCart();
};
