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

function addItems(objectApi) {
  const section = document.querySelector('.items');
  objectApi.forEach((obj) => {
    const objeto = {
      name: obj.title,
      sku: obj.id,
      image: obj.thumbnail,
    };
    section.appendChild(createProductItemElement(objeto));
  });
}

function saveListCart() {
  const cartList = document.querySelector('ol.cart__items');
  localStorage.setItem('cart', cartList.innerHTML);
  console.log(cartList.innerHTML);
}

function loadListCart() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('cart');
}

function cartItemClickListener(event) {
  event.target.remove();
  saveListCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCart(objectApiCart) {
  const ol = document.querySelector('ol.cart__items');
  const objeto = {
    name: objectApiCart.title,
    sku: objectApiCart.id,
    salePrice: objectApiCart.price,
  };
  ol.appendChild(createCartItemElement(objeto));
  saveListCart();
}

function callApiCart(idProduct) {
  const endpoint = `https://api.mercadolibre.com/items/${idProduct}`;
  fetch(endpoint)
  .then(response => response.json())
  .then(obj => addCart(obj))
  .catch(() => alert('erro cart'));
}

function selectIdElement() {
  const buttons = document.querySelectorAll('button.item__add');
  buttons.forEach(button => button.addEventListener('click', () => {
    callApiCart(button.parentNode.firstChild.innerText);
  }));
}

function addLoading() {
  const loading = document.createElement('h1');
  loading.innerText = 'Loading....';
  loading.className = 'loading';
  document.querySelector('body')
  .appendChild(loading);
}

function clearLoading() {
  document.querySelector('h1.loading').remove();
}

function callApi(item) {
  addLoading();
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  fetch(endpoint)
  .then(response => response.json())
  .then((objects) => {
    addItems(objects.results);
    selectIdElement();
    clearLoading();
    loadListCart();
  })
  .catch(() => alert('erro'));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function clearCart() {
  document.querySelector('button.empty-cart')
  .addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.clear();
  });
}

window.onload = function onload() {
  callApi('computador');
  clearCart();
};
