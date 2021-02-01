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

function addProductItem(section) {
  const items = document.querySelector('.items');
  items.appendChild(section);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  addProductItem(section);
}

function searchElements() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(object => object.results)
  .then((array) => {
    array.forEach((object) => {
      const { id: sku, title: name, thumbnail: image } = object;
      createProductItemElement({ sku, name, image });
    });
  })
  .catch(error => window.alert(error));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
}

function addCartItem(listItem) {
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(listItem);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function searchElementesByID(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(response => response.json())
  .then((object) => {
    const { id: sku, title: name, price: salePrice } = object;
    const listItem = createCartItemElement({ sku, name, salePrice });
    addCartItem(listItem);
  })
  .catch(error => window.alert(error));
}

function captureID(e) {
  if (e.target.className === 'item__add') {
    const item = e.target.parentNode;
    const id = item.firstChild.innerText;
    searchElementesByID(id);
  }
}

function setupEventListener() {
  const items = document.querySelector('.items');
  items.addEventListener('click', captureID);
  const cartList = document.querySelector('.cart__items');
  cartList.addEventListener('click', cartItemClickListener);
}

window.onload = function onload() {
  searchElements();
  setupEventListener();
};
