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

// Updates the cart items saved to local storage
function updateLocalStorageItems() {
  localStorage.clear();
  const cartItems = document.querySelector('.cart__items');
  let items = '';
  if (cartItems.childNodes.length !== 0) {
    cartItems.childNodes.forEach((item) => {
      if (items === '') {
        items = `${item.innerText}`;
      } else {
        items = `${items}%${item.innerText}`;
      }
    });
    localStorage.setItem('cartItem', items);
  }
}

// Adds and subtracts the price of products in the shopping cart
function updateProductsPrice() {
  const cartItems = document.querySelectorAll('.cart__item');
  const priceContainer = document.querySelector('.total-price');
  let priceSum = 0;
  cartItems.forEach(({ innerText: item }) => {
    priceSum += parseFloat(item.substring(item.indexOf('$') + 1));
    priceSum = parseFloat(priceSum.toFixed(2));
  });
  priceContainer.innerText = priceSum;
}

// Remove li element from the cart and local storage
function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  updateLocalStorageItems();
  updateProductsPrice();
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
  updateLocalStorageItems();
  updateProductsPrice();
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

// Loads on page all cart items saved on local storage
function loadCartItemOnLocalSorage() {
  if (localStorage.length !== 0) {
    const shoppingCart = document.querySelector('.cart__items');
    const itemsArr = localStorage.getItem('cartItem').split('%');
    itemsArr.forEach((item) => {
      const itemValue = item.replace('SKU: ', '').replace('NAME: ', '').replace('PRICE: $', '');
      const localStorageArr = itemValue.split(' | ');
      const localStorageObj = {
        sku: localStorageArr[0],
        name: localStorageArr[1],
        salePrice: localStorageArr[2],
      };
      const cartItem = createCartItemElement(localStorageObj);
      shoppingCart.appendChild(cartItem);
    });
  }
}

// Deletes all items from the shopping cart
function deleteItemsFromCart() {
  const cartItems = document.querySelector('.cart__items');
  while (cartItems.firstChild) {
    cartItems.removeChild(cartItems.lastChild);
  }
  updateLocalStorageItems();
  updateProductsPrice();
}

// Event Listeners
function setupEvents() {
  const items = document.querySelector('.items');
  const buttonEmptyCart = document.querySelector('.empty-cart');
  items.addEventListener('click', fetchProduct);
  buttonEmptyCart.addEventListener('click', deleteItemsFromCart);
}

window.onload = function onload() {
  loadCartItemOnLocalSorage();
  fetchProductList('computador');
  setupEvents();
  updateProductsPrice();
};
