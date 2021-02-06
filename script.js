
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

function fetchProduct() {
  const eachSection = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
    .catch(() => alert('Produto não encontrado!'))
    .then((object) => {
      const objResults = object.results;
      objResults.forEach((element) => {
        const { id: sku, title: name, thumbnail: image } = element;
        const newList = createProductItemElement({ sku, name, image });
        eachSection.appendChild(newList);
      });
    });
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

function addProductInTheCart(parentId) {
  fetch(`https://api.mercadolibre.com/items/${parentId}`)
  .then(response => response.json())
    .then((product) => {
      const list = document.querySelector('.cart__items');
      const { id: sku, title: name, price: salePrice } = product;
      const newItem = createCartItemElement({ sku, name, salePrice });
      list.appendChild(newItem);
    });
}

function getItemIdToFetch() {
  document.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const parent = event.target.parentElement;
      const parentId = parent.querySelector('span.item__sku').innerText;
      addProductInTheCart(parentId);
    }
  });
}

window.onload = function onload() {
  fetchProduct();
  getItemIdToFetch();
};
