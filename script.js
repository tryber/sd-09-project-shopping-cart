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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchCartItemElement(ItemID) {
  const endpoint = `https://api.mercadolibre.com/items/${ItemID}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const { id: sku, title: name, price: salePrice } = object;
  const elementHTM = createCartItemElement({ sku, name, salePrice });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(elementHTM);
}

async function fetchProductList(QUERY) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const productObj = object.results;

  productObj.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const item = createProductItemElement({ sku, name, image });
    listItems = document.querySelector('.items');
    listItems.appendChild(item);
  });

  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach(button => button
    .addEventListener('click', (event) => {
      const productId = getSkuFromProductItem(event.target.parentNode);
      fetchCartItemElement(productId);
    }));
}

window.onload = function onload() {
  fetchProductList('computador');
};
