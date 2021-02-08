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

let pricesArray = [];

async function totalPrice(prices) {
  const sumPrices = prices.reduce((total, price) =>
    Math.round(((Math.round(total * 100) / 100)
    + (Math.round(price * 100) / 100)) * 100) / 100, 0);
  document.querySelector('.total-price').innerText = `${sumPrices}`;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const cartItemsList = document.querySelector('.cart__items');
  const indexOfCartItem = Array.prototype.indexOf.call(cartItemsList.children, event.target);
  pricesArray.splice(indexOfCartItem, 1);
  event.target.remove();
  totalPrice(pricesArray);
  localStorage.setItem('savedCartList', cartItemsList.innerHTML);
  localStorage.setItem('pricesList', JSON.stringify(pricesArray));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchQuery(query) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((result) => {
        const { id, title, thumbnail } = result;
        const itemParams = {
          sku: id,
          name: title,
          image: thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(itemParams));
      });
    });
}

function cartListListeners() {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(cartItem => cartItem.addEventListener('click', cartItemClickListener));
}

function addToCartButtons() {
  const buttons = document.querySelectorAll('.items');
  buttons.forEach((button) => {
    button.addEventListener('click', function (event) {
      const cartList = document.querySelector('.cart__items');
      const itemId = getSkuFromProductItem(event.target.parentNode);
      fetch(`https://api.mercadolibre.com/items/${itemId}`)
        .then(itemResponse => itemResponse.json())
        .then((itemObject) => {
          const { id, title, price } = itemObject;
          const itemInfos = {
            sku: id,
            name: title,
            salePrice: price,
          };
          cartList.appendChild(createCartItemElement(itemInfos));
          cartListListeners();
          pricesArray.push(price);
          totalPrice(pricesArray);
          localStorage.setItem('savedCartList', cartList.innerHTML);
          localStorage.setItem('pricesList', JSON.stringify(pricesArray));
        });
    });
  });
}

function checkLocalStorage() {
  const listCheck = localStorage.getItem('savedCartList');
  if (listCheck) {
    document.querySelector('.cart__items').innerHTML = listCheck;
  }
  const pricesCheck = JSON.parse(localStorage.getItem('pricesList'));
  if (pricesCheck) {
    pricesArray = pricesCheck;
  }
}

function emptyCartList() {
  document.querySelector('.cart__items').innerHTML = '';
  pricesArray = [];
  totalPrice(pricesArray);
  localStorage.removeItem('savedCartList');
  localStorage.removeItem('pricesList');
}

window.onload = function onload() {
  fetchQuery('computador');
  pricesArray = [];
  checkLocalStorage();
  totalPrice(pricesArray);
  addToCartButtons();
  cartListListeners();
  document.querySelector('.empty-cart').addEventListener('click', emptyCartList);
};
