

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
  console.log(event);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemsToCart(sku, name, container) {
  const cart = document.getElementsByClassName('cart__items')[0];
  const loading = createCustomElement('div', 'loading', 'loading...');
  let jsonifyProduct = {};
  if (!jsonifyProduct.salePrice) {
    container.appendChild(loading);
  }
  const fetchedProduct = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  if (!jsonifyProduct.salePrice) {
    container.appendChild(loading);
  }
  jsonifyProduct = await fetchedProduct.json();
  const { price: salePrice } = jsonifyProduct;
  const loadingElement = document.getElementsByClassName('loading')[0];
  setTimeout(async (e) => {
    container.removeChild(loadingElement);
  }, 20);
  cart.appendChild(createCartItemElement({ sku, name, salePrice }));
}

async function LoadProducts() {
  let jsonify = [];
  const loading = createCustomElement('div', 'loading', 'loading...');
  const container = document.getElementsByClassName('container')[0];
  container.appendChild(loading);
  const itemsUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(itemsUrl);
  if (!jsonify.results) {
    jsonify = await response.json();
  }
  const loadingElement = document.getElementsByClassName('loading')[0];
  container.removeChild(loadingElement);
  const products = jsonify.results;
  const sectionItems = document.getElementsByClassName('items');
  products.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const createdproduct = createProductItemElement({ sku, name, image });
    sectionItems[0].appendChild(createdproduct);
    createdproduct.childNodes[3].addEventListener('click', async () => {
      await addItemsToCart(sku, name, container);
    });
  });
}


window.onload = async function onload() {
  await LoadProducts();
};
