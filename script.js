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
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  items.appendChild(section);
}

function cartItemClickListener(event) {
  return event.target.remove();
}

const updateCartPrice = async () => {
  const span = document.querySelector('.price');
  const items = document.querySelectorAll('.cart__item');
  const list = [...items];
  const result = list.map((item) => {
    const text = item.innerText;
    return parseFloat(text.substring(text.indexOf('$') + 1));
  }).reduce((acc, cur) => acc + cur, 0);
  span.innerText = !result ? 'Carrinho vazio!' : Math.round(result * 100) / 100;
};

const saveLocalStorage = () => {
  const nodeList = document.querySelectorAll('.cart__item');
  const list = [...nodeList];
  const text = list.map(item => item.innerText);
  localStorage.setItem('cartList', JSON.stringify(text));
};

function updateLocalStorage() {
  const li = document.querySelector('.cart__items');
  li.addEventListener('click', (event) => {
    saveLocalStorage();
    updateCartPrice();
    return event.target.remove();
  });
}

const storageListSaved = () => {
  const ol = document.querySelector('.cart__items');
  const storageList = JSON.parse(localStorage.getItem('cartList'));
  if (storageList) {
    storageList.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = item;
      ol.appendChild(li);
      updateLocalStorage();
    });
  }
};

function createCartItemElement({ sku, name, salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  saveLocalStorage();
  updateCartPrice();
}

const filterIdElement = ({ id, title, price }) => {
  const object = {
    sku: id,
    name: title,
    salePrice: price,
  };
  createCartItemElement(object);
};

const cartItemElement = async (idElement) => {
  const productId = `https://api.mercadolibre.com/items/${idElement}`;
  try {
    const response = await fetch(productId);
    const object = await response.json();
    if (object.message) {
      throw new Error(object.message);
    }
    filterIdElement(object);
    updateCartPrice();
  } catch (error) {
    alert(error);
  }
};

function getIdByEventListener() {
  const items = document.querySelector('.items');
  items.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const idElement = event.target.parentNode.firstChild.innerText;
      cartItemElement(idElement);
    }
  });
}

const objectFilterElement = (productsDatas) => {
  const entries = Object.entries(productsDatas.results);
  entries.forEach((info) => {
    const infos = {
      sku: info[1].id,
      name: info[1].title,
      image: info[1].thumbnail,
    };
    createProductItemElement(infos);
  });
};

const productItemElement = async () => {
  const productChoise = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const items = document.querySelector('.items');
    const span = document.createElement('span');
    span.className = 'loading';
    span.innerText = 'loading';
    items.appendChild(span);
    const response = await fetch(productChoise);
    const object = await response.json();
    if (object.results.length === 0) {
      throw new Error('Busca inválida');
    }
    items.removeChild(span);
    objectFilterElement(object);
  } catch (error) {
    alert(error);
  }
};

const removeAllItems = () => {
  const ol = document.querySelector('.cart__items');
  ol.innerText = '';
  updateCartPrice();
  localStorage.clear();
};

window.onload = function onload() {
  const itemsCart = document.querySelector('.items');
  itemsCart.addEventListener('click', saveLocalStorage);
  const olList = document.querySelector('.cart__items');
  olList.addEventListener('click', saveLocalStorage);
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', removeAllItems);
  storageListSaved();
  productItemElement();
  getIdByEventListener();
  updateCartPrice();
  updateLocalStorage();
};
