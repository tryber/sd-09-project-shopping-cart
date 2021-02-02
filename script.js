const cart = document.querySelector('.cart');
const totalValue = document.createElement('h3');
totalValue.className = 'total-price';
cart.appendChild(totalValue);
if (localStorage.getItem('value')) {
  totalValue.innerText = localStorage.getItem('value');
} else {
  totalValue.innerText = '0.00';
}
async function sumPrice() {
  const array = [];
  const productsList = document.querySelectorAll('.cart__item');
  productsList.forEach((item) => {
    if (!array.includes(item)) {
      array.push(parseFloat(item.innerText.split('PRICE: $')[1]));
    }
  });
  const sum = await array.reduce((acc, curr) => acc + curr, 0);
  localStorage.setItem('value', sum.toFixed(0));
  totalValue.innerText = localStorage.getItem('value');
}

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

function saveCart() {
  const cartItemsContainer = document.querySelector('.cart__items');
  localStorage.setItem('cart', cartItemsContainer.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
  sumPrice();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadingPage() {
  const h2 = document.createElement('h2');
  h2.className = 'loading';
  h2.innerText = 'loading...';
  document.body.appendChild(h2);
  return h2;
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
        .then((productObject) => {
          appendProductToCart(productObject);
          saveCart();
          sumPrice();
        });
    });
  });
}

function appendProducts(products) {
  const itemsContainer = document.querySelector('.items');
  itemsContainer.appendChild(createProductItemElement(products));
}

function fetchProducts() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const loading = loadingPage();
  fetch(endpoint)
    .then(response => response.json())
    .then(productObject => productObject.results)
    .then((products) => {
      products.forEach((product) => {
        appendProducts(product);
      });
      addProductToCart();
      loading.remove();
    });
}

function deleteCart() {
  const deleteCartBt = document.querySelector('.empty-cart');
  deleteCartBt.addEventListener('click', () => {
    const cartItem = document.querySelectorAll('.cart__item');
    cartItem.forEach((item) => {
      item.remove();
    });
    saveCart();
    sumPrice();
  });
}

function loadCart() {
  const cartItemsContainer = document.querySelector('.cart__items');
  if (localStorage.getItem('cart')) {
    cartItemsContainer.innerHTML = localStorage.getItem('cart');
  } else {
    cartItemsContainer.innerHTML = '';
  }
}

window.onload = function onload() {
  fetchProducts();
  deleteCart();
  loadCart();
};
