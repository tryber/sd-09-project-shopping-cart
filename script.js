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

// My Functions
async function fetchProductSearch() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  return response.json();
}

async function fetchItemId(itemID) {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  return response.json();
}

async function addItemToCart(clickedItem) {
  const clickedItemId = clickedItem.target.parentNode.firstChild.innerText;
  const clickedItemInfo = await fetchItemId(clickedItemId);
  const cartList = document.querySelector('ol.cart__items');
  const output = {
    sku: clickedItemInfo.id,
    name: clickedItemInfo.title,
    salePrice: clickedItemInfo.price,
  };

  cartList.appendChild(createCartItemElement(output));
}

async function generateProductList() {
  const productListContainer = document.querySelector('.items');
  const productsList = await fetchProductSearch();
  const { results } = productsList;
  results.forEach((product) => {
    const output = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };

    productListContainer.appendChild(createProductItemElement(output));
  });

  const buttons = document.querySelectorAll('button.item__add');
  buttons.forEach(button => button.addEventListener('click', addItemToCart));
}

window.onload = function onload() {
  generateProductList();
};
