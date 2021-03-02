function saveLocalStorage() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartItems);
  total();
}

function loadingOn() {
  const body = document.body;
  const loading = document.createElement('h1');
  loading.className = 'loading';
  loading.innerHTML = 'Loading...';
  body.appendChild(loading);
}

function loadingRemove() {
  const body = document.body;
  const loading = document.querySelector('.loading');
  body.removeChild(loading);
}

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalStorage();
  total();
}

function localStorageInit() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = localStorage.getItem('cart');
  cartItems.addEventListener('click', ((event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  }));
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

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const clear = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    total();
    saveLocalStorage();
  });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function retrieveMLResults(term) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  loadingOn();

  const response = await fetch(endpoint);
  const object = await response.json();
  const results = object.results;
  const itemsElement = document.querySelector('.items');
  loadingRemove();
  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(element);
  });
}

const fetchID = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)

    .then(response => response.json())
    .then((data) => {
      const dataProduct = {
        sku,
        name: data.title,
        salePrice: data.price,
      };
      const list = document.querySelector('.cart__items');
      list.appendChild(createCartItemElement(dataProduct));
      total();
      saveLocalStorage();
    });
};

const getId = () => {
  const getSectionItem = document.querySelector('.items');
  getSectionItem.addEventListener('click', (event) => {
    const item = event.target.parentNode;
    const sku = item.querySelector('span.item__sku').innerText;
    fetchID(sku);
  });
};

const total = () => {
  const totalPrice = document.querySelector('.total-price');
  const cartItems = document.querySelectorAll('.cart__item');
  let acc = 0;
  cartItems.forEach((element) => {
    acc += parseFloat(element.innerHTML.split('$')[1]);
  });
  totalPrice.innerHTML = acc;
}

window.onload = function onload() {
  retrieveMLResults('computador');
  getId();
  clear();
  localStorageInit();
};
