function saveState() {
  localStorage.clear();
  const cartItemsList = document.querySelectorAll('.cart__item');
  for (let i = 0; i < cartItemsList.length; i += 1) {
    const cartItemText = cartItemsList[i].innerHTML;
    localStorage.setItem(i, cartItemText);
    localStorage.setItem('count', cartItemsList.length);
  }
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function clearCart() {
  // const cart = document.querySelector('.cart__items');
  const cartList = document.querySelectorAll('.cart__item');
  const comp = cartList.length;
  for (let i = comp - 1; i >= 0; i -= 1) {
    cartList[0].parentElement.removeChild(cartList[i]);
  }
  localStorage.clear();
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const item = event.target;
  item.parentElement.removeChild(item);
  saveState();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function aplyState() {
  const cartItems = document.querySelector('.cart__items');
  for (let i = 0; i < localStorage.getItem('count'); i += 1) {
    const item = localStorage[i].split('|');
    const sku = item[0].split(':')[1].trim();
    const name = item[1].split(':')[1].trim();
    const salePrice = item[2].split(':')[1].trim().slice(1);
    cartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
  }
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const cartItems = document.querySelector('.cart__items');

  section.lastChild.addEventListener('click', async () => {
    const itemId = section.firstChild.innerText;
    const endpoint = `https://api.mercadolibre.com/items/${itemId}`;

    const response = await fetch(endpoint);
    const object = await response.json();

    const { price: salePrice } = object;

    cartItems.appendChild(createCartItemElement({ sku, name, salePrice }));

    saveState();
  });

  return section;
}

async function createItems() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  const response = await fetch(endpoint);
  const object = await response.json();
  const results = object.results;

  const itemsParent = document.querySelector('.items');

  results.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const element = createProductItemElement({ sku, name, image });
    itemsParent.appendChild(element);
  });
}

window.onload = function onload() {
  createItems();
  aplyState();
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
