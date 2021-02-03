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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  return event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  let array = [];
  array = document.querySelector('.cart__items').getElementsByTagName('li');
  const newArray = [];
  for (let local = 0; local < array.length; local += 1) {
    newArray.push(array[local].innerText);
  }
  localStorage.setItem('cartList', JSON.stringify(newArray));
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
    const response = await fetch(productChoise);
    const object = await response.json();
    if (object.results.length === 0) {
      throw new Error('Busca inválida');
    }
    objectFilterElement(object);
  } catch (error) {
    alert(error);
  }
};

function updateLocalStorage() {
  const li = document.querySelector('.cart__items');
  li.addEventListener('click', (event) => {
   event.target.remove();
    let array = [];
    array = document.querySelector('.cart__items').getElementsByTagName('li');
    const newArray = [];
    for (let local = 0; local < array.length; local += 1) {
      newArray.push(array[local].innerText);
    }
    localStorage.setItem('cartList', JSON.stringify(newArray));
    return event;
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

window.onload = function onload() {
  productItemElement();
  getIdByEventListener();
  storageListSaved();
};
