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

// Remove li element from the cart
function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
}

// Retrieves the list of products from Mercado livre API and loads in 'items' section on HTML
function fetchProductList(item) {
  const itemsList = document.querySelector('.items');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${item}`)
    .then(response => response.json())
    .then(data => data.results
      .forEach(({ id: sku, title: name, thumbnail: image }) => {
        itemsList.appendChild(createProductItemElement({ sku, name, image }));
      }))
    .catch(error => alert(error));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Add the product to the 'cart items' HTML ol
function addProductToCart(product) {
  const shoppingCart = document.querySelector('.cart__items');
  const { id: sku, title: name, price: salePrice } = product;
  const cartItem = createCartItemElement({ sku, name, salePrice });
  shoppingCart.appendChild(cartItem);
}

// Retrieves the product from Mercado livre API by ID
function fetchProduct(event) {
  if (event.target.className === 'item__add') {
    const productId = event.target.parentNode.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${productId}`)
      .then((response) => {
        if (response.error) throw new Error(response.error);
        return response.json();
      })
      .then(data => addProductToCart(data))
      .catch(error => alert(error));
  }
}

// Event Listeners
function setupEvents() {
  const items = document.querySelector('.items');
  items.addEventListener('click', fetchProduct);
}

window.onload = function onload() {
  fetchProductList('computador');
  setupEvents();
};
