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
  // coloque seu código aqui.
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProductList() {
  const term = 'computador';
  const URL = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;

  try {
    const response = await fetch(URL);
    const products = await response.json();

    const items = {};
    products.results.forEach((element) => {
      items.sku = element.id;
      items.name = element.title;
      items.image = element.thumbnail;

      sectionItems = document.querySelector('.items');
      sectionItems.appendChild(createProductItemElement(items));
    });
  } catch (error) {
    window.alert(error);
  }
}

function getProduct(item) {
  const term = item;
  const URL = `https://api.mercadolibre.com/items/${term}`;

  fetch(URL)
    .then(response => response.json()
      .then((res) => {
        const obj = {};
        obj.sku = res.id;
        obj.name = res.title;
        obj.salePrice = res.price;

        cartItems = document.querySelector('.cart__items');
        cartItems.appendChild(createCartItemElement(obj));
      }))
    .catch(error => error);
}

function addItems() {
  const addItem = document.querySelector('.items');
  addItem.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const parentItem = (event.target.parentNode);
      const sku = parentItem.childNodes[0].innerText;
      getProduct(sku);
    }
  });
}

window.onload = function onload() {
  getProductList();
  addItems();
};
