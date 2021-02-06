// window.onload = function onload() {
//   console.log(x);
// };


// projeto jlfagundes
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

async function calculateTotalPrice() {
  const cartItems = document.querySelector('.cart__items');

  const price = [];
  cartItems.childNodes.forEach((child) => {
    price.push(parseFloat(child.textContent
      .substr(child.textContent
        .indexOf('$') + 1, 9)));
  });

  let precoSomado = 0;
  if (price.length !== 0) {
    precoSomado = price.reduce((prev, cur) => prev + cur);
  }
  document.querySelector('.total-price').innerText = precoSomado;
}

function saveLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('carrinho', cartItems.innerHTML);
  calculateTotalPrice();
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  calculateTotalPrice();
  saveLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getProduct(id) {
  const term = id;
  const URL = `https://api.mercadolibre.com/items/${term}`;
  const cartItems = document.querySelector('.cart__items');

  fetch(URL)
    .then(response => response.json()
      .then((res) => {
        const obj = {};
        obj.sku = res.id;
        obj.name = res.title;
        obj.salePrice = res.price;
        cartItems.appendChild(createCartItemElement(obj));
        calculateTotalPrice();
        saveLocalStorage();
      }))
    .catch(error => window.alert(error));
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

function loadLocalStorage() {
  const cartItemsStorage = localStorage.getItem('carrinho');
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = cartItemsStorage;

  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach(element => element.addEventListener('click', cartItemClickListener));

  calculateTotalPrice();
}

async function getProductList() {
  const term = 'computador';
  const URL = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;

  const sectionItems = document.querySelector('.items');
  const loading = document.createElement('spam');

  loading.className = 'loading';
  loading.innerText = 'loading...';
  loading.style.fontSize = '36px';
  sectionItems.appendChild(loading);

  try {
    const response = await fetch(URL);
    const products = await response.json();

    document.querySelector('.loading').remove();

    products.results.forEach((result) => {
      const { id: sku, title: name, thumbnail: image } = result;
      sectionItems.appendChild(createProductItemElement({ sku, name, image }));
    });
  } catch (error) {
    window.alert(error);
  }
}

function emptyCart() {
  const cartItems = document.querySelector('.cart__items');
  const cartItemsLength = cartItems.childElementCount - 1;

  // limpar parent.innerHTML = '';
  for (let index = cartItemsLength; index >= 0; index -= 1) {
    cartItems.removeChild(cartItems.children[index]);
  }
  calculateTotalPrice();
  saveLocalStorage();
}

function createTotalPriceElement() {
  const totalPrice = document.createElement('spam');
  totalPrice.className = 'total-price';
  totalPrice.innerText = 'Preco Total: $';
  document.querySelector('.cart').appendChild(totalPrice);
}

window.onload = function onload() {
  getProductList();
  addItems();
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
  createTotalPriceElement();
  loadLocalStorage();
};

