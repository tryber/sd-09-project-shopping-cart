function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchItemById(ItemID) {
  const endPoint = `https://api.mercadolibre.com/items/${ItemID}`;
  const response = await fetch(endPoint);
  const object = await response.json();
  const { id, title, price } = object;
  const cartElement = createCartItemElement({ sku: id, name: title, salePrice: price });
  document.querySelector('.cart__items').appendChild(cartElement);
}

function cartItemClickListener(event) {
event.target.remove();
}

async function fetchAllProducts(productType) {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${productType}`;
  const response = await fetch(endPoint);
  const object = await response.json();
  const results = object.results;
  results.forEach((result) => {
    const { id, title, thumbnail, price} = result;
    const structure = createProductItemElement({ sku: id, name: title, image: thumbnail });
    document.querySelector('.items').appendChild(structure);

  });
}



function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}


window.onload = function onload() {
  fetchAllProducts('computador');
};
