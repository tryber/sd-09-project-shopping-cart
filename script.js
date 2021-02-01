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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function appendProductToCart(product) {
  const cartItemsList = document.querySelector('.cart__items');
  cartItemsList.appendChild(createCartItemElement(product));
}

function addProductToCart() {
  const itemAddBt = document.querySelectorAll('.item__add');
  itemAddBt.forEach((item) => {
    item.addEventListener('click', (event) => {
      const itemId = event.target.parentNode.firstChild.innerText;
      const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
      fetch(endpoint)
        .then(response => response.json())
        .then(productObject => appendProductToCart(productObject));
    });
  });
}
addProductToCart();

function appendProducts(products) {
  const itemsContainer = document.querySelector('.items');
  itemsContainer.appendChild(createProductItemElement(products));
}

function fetchProducts() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    .then(response => response.json())
    .then(productObject => productObject.results)
    .then((products) => {
      products.forEach((product) => {
        appendProducts(product);
      });
      addProductToCart();
    });
}

function deleteCart() {
  const deleteCartBt = document.querySelector('.empty-cart');
  deleteCartBt.addEventListener('click', () => {
    const cartItem = document.querySelectorAll('.cart__item');
    cartItem.forEach((item) => {
      item.remove();
    });
  });
}

window.onload = function onload() {
  fetchProducts();
  deleteCart();
};
