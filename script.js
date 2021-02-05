

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

async function addItemsToCart(sku, name, loading, loadingElement) {
  const cart = document.getElementsByClassName('cart__items')[0];
  const fetchedProduct = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  let jsonifyProduct = {};
  if (!jsonifyProduct.salePrice) {
    jsonifyProduct = await fetchedProduct.json();
  }
  const { price: salePrice } = jsonifyProduct;
  container.removeChild(loadingElement);
  cart.appendChild(createCartItemElement({ sku, name, salePrice }));
}

async function LoadProducts() {
  const itemsUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(itemsUrl);
  let jsonify = [];
  const loading = createCustomElement('div', 'loading', 'loading...');
  const container = document.getElementsByClassName('container')[0];
  if (!jsonify.results) {
    container.appendChild(loading);
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
      await addItemsToCart(sku, name, loading, loadingElement);
    });
  });
}


window.onload = async function onload() {
  await LoadProducts();
};
