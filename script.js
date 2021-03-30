let totalPrice = 0;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const sum = (price) => {
  totalPrice += price;
  document.querySelector('.total-price').innerText = totalPrice;
};

function saveLocal() {
  const cartList = document.querySelector('.cart__items');
  localStorage.setItem('cart', cartList.innerHTML);
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function loading() {
  sectionSpan = document.querySelector('.cart');
  spanLoading = document.createElement('span');
  spanLoading.className = 'loading';
  sectionSpan.appendChild(spanLoading);
  spanLoading.innerText = 'loading';
}

function unload() {
  sectionSpan = document.querySelector('.cart');
  spanLoading = document.querySelector('.loading');
  sectionSpan.removeChild(spanLoading);
}

function cartItemClickListener(event) {
  // event.target.remove();
  const element = event.target;
  const price = parseFloat(element.innerText.split('$')[1]);
  totalPrice -= price;
  document.querySelector('.total-price').innerText = totalPrice;
  element.remove();
  saveLocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (event) => {
  const itemId = event.target.parentNode.firstChild.innerText;
  const cart = document.querySelector('.cart__items');
  return fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then(response => response.json())
  .then((itemDetail) => {
    const { id, title, price } = itemDetail;
    const cartItem = { sku: id, name: title, salePrice: price };
    const add = createCartItemElement(cartItem);
    cart.appendChild(add);
    sum(price);
    saveLocal();
  });
};

function createProductItemElement({ sku, name, image }) {
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);
  button.addEventListener('click', addToCart);

  return section;
}

async function retrieveMercadoLivreResults(term) {
  loading();
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const results = object.results;
  const itemsElement = document.querySelector('.items');

  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(element);
  });
  unload();
}

function clear() {
  const deleteCart = document.querySelector('.empty-cart');
  deleteCart.addEventListener('click', function () {
    const cart = document.querySelector('.cart__items');
    cart.innerHTML = '';
    totalPrice = 0;
    saveLocal();
  });
}

// function getSkuFromProductItem(item) {
//  return item.querySelector('span.item__sku').innerText;
// }

function loadLoacal() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cart') || '';
}
window.onload = function onload() {
  retrieveMercadoLivreResults('computador');
  clear();
  loadLoacal();
};
