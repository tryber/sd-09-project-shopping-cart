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

async function retrieveMLResults(term) {
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
}

const fetchID = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const dataProduct = {
        sku,
        name: data.title,
        salePrice: data.price,
      };
      const list = document.querySelector('.cart__items');
      list.appendChild(createCartItemElement(dataProduct));
    });
};

const getId = () => {
  const getSectionItem = document.querySelector('.items');
  getSectionItem.addEventListener('click', (event) => {
    const item = event.target.parentNode;
    const sku = item.querySelector('span.item__sku').innerText;
    fetchID(sku);
  });
};

window.onload = function onload() {
  retrieveMLResults('computador');
  getId();
};
