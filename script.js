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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function  localStorageUpdate() {
  const cartItems = document.querySelector('ol.cart__items').childNodes;
  const savedCart = [];
  cartItems.forEach(item => savedCart.push(item.innerText));
  const myCart = JSON.stringify(savedCart);
  localStorage.setItem('cart', myCart);
}

function savedCartFetch() {
  const cart = document.querySelector('ol.cart__items');
  const key = JSON.parse(localStorage.getItem('cart'));
  let li;
  key.forEach(item => {
    li = createCustomElement('li', 'cart__item', item);
    li.addEventListener('click', cartItemClickListener);
    cart.appendChild(li);
  });
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.parentElement.removeChild(event.target);
  localStorageUpdate();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(event) {
  const cart = document.querySelector('ol.cart__items');
  const item = getSkuFromProductItem(event.target.parentElement);
  const api = `https://api.mercadolibre.com/items/${item}`;
  fetch(api)
    .then(response => response.json())
    .then(({ id: sku, title: name, price: salePrice }) =>
      createCartItemElement({ sku, name, salePrice }))
    .then(cartItem => cart.appendChild(cartItem))
    .then(() => localStorageUpdate());
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  section.querySelector('button').addEventListener('click', addToCart);

  return section;
}

function loadShoppingItems() {
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const shelf = document.querySelector('section.items');
  fetch(api)
    .then(response => response.json())
    .then(({ results }) =>
      results.forEach(({ id: sku, title: name, thumbnail: image }) =>
        shelf.appendChild(createProductItemElement({ sku, name, image }))));
}

window.onload = function onload() {
  loadShoppingItems();
  if (localStorage.length) savedCartFetch();
};
