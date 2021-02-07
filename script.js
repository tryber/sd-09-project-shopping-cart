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
  if (element === 'button') e.addEventListener('click', btnAddItem);
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

function createCartItemElement({ id: sku, title: name, price: salePrice  }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function btnAddItem(event) {
  const product = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${product}`)
  .then((response) => {
    response.json()
    .then((object) => {
      const li = createCartItemElement(object);
      document.querySelector('.cart__items').appendChild(li);
    });
  });
}

function createItems(object) {
  const section = document.querySelector('.items');
  object.results.forEach((element) => {
    const { id: sku, title: name, thumbnail: image } = element;
    section.appendChild(createProductItemElement({ sku, name, image }));
  });
}

function requestMercadoLivre() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => {
    response.json()
    .then((object) => {
      createItems(object);
    });
  });
}

window.onload = function onload() {
  requestMercadoLivre();
};
