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

function setLocalStorage() {
  const item = document.querySelector('.cart__items');
  localStorage.setItem('cart', item.innerText);
}

function getLocalStorageToCart() {
  const savedItens = localStorage.getItem('cart');
  const cart = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = savedItens;
  cart.appendChild(li);
}

function startLoading() {
  const body = document.querySelector('body');
  const p = document.createElement('p');
  body.appendChild(p);
  p.className = 'loading';
  p.innerHTML = 'loading...';
}

function stopLoading() {
  const pLoading = document.querySelector('.loading');
  pLoading.remove();
}

function cartItemClickListener(event) {
  event.target.remove();
  setLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fecthApi(url) {
  startLoading();
  return fetch(url)
    .then(response => response.json());
}

function getItemsElements() {
  const createItemsList = document.querySelector('.items');
  urlApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fecthApi(urlApi)
    .then((data) => {
      data.results.forEach((item) => {
        const items = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        createItemsList.appendChild(createProductItemElement(items));
      });
    });
  stopLoading();
}

function getItemsById(itemId) {
  const cartItens = document.querySelector('.cart__items');
  urlById = `https://api.mercadolibre.com/items/${itemId}`;
  fecthApi(urlById)
    .then((data) => {
      const itemDetails = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      cartItens.appendChild(createCartItemElement(itemDetails));
      setLocalStorage();
    });
}

function buttonAddClickListener() {
  const listItems = document.querySelector('.items');
  listItems.addEventListener('click', (element) => {
    if (element.target.className === 'item__add') {
      const idOnFocus = element.target.parentNode;
      const itemId = getSkuFromProductItem(idOnFocus);
      getItemsById(itemId);
    }
  });
}

function removeAllItems() {
  const cartItens = document.querySelector('.cart__items');
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    const list = document.querySelectorAll('li');
    list.forEach((element) => {
      element.remove();
    });
  });
  setLocalStorage();
}

window.onload = function onload() {
  getItemsElements();
  getLocalStorageToCart();
  buttonAddClickListener();
  removeAllItems();
};
