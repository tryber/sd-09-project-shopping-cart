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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function createProductList() {
  const endpoint =
    'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  try {
    const response = await fetch(endpoint);
    const objectJson = await response.json();
    const objectJsonResults = objectJson.results;
    const sectionLocal = document.querySelector('.items');

    objectJsonResults.forEach((element) => {
      const { id: sku, title: name, thumbnail: image } = element;
      const itemsForSale = createProductItemElement({ sku, name, image });
      sectionLocal.append(itemsForSale);
    });
  } catch (error) {
    alert('Error');
  }
}

async function addIdToEndpoint(clickedId) {
  const cartItemsLocal = document.querySelector('.cart__items');
  const endpointId = `https://api.mercadolibre.com/items/${clickedId}`;
  const responseId = await fetch(endpointId);
  const objectJsonId = await responseId.json();
  const { id: sku, title: name, price: salePrice } = objectJsonId;
  const itemOnList = createCartItemElement({ sku, name, salePrice });
  cartItemsLocal.appendChild(itemOnList);
}

function addItemToCart() {
  document.addEventListener('click', function (event) {
    if (event.target.className === 'item__add') {
      const parentName = event.target.parentElement;
      const clickedId = parentName.firstChild.innerText;
      addIdToEndpoint(clickedId);
    }
  });
}

function removeAllItems() {
  const emptyButtonLocal = document.querySelector('.empty-cart');
  emptyButtonLocal.addEventListener('click', function () {
    const itemOnCart = document.querySelectorAll('.cart__item');
    itemOnCart.forEach(element => element.remove());
  });
}

window.onload = function onload() {
  createProductList();
  addItemToCart();
  removeAllItems();
};
