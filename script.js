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

function loadStorage(storage) {
  if (localStorage.getItem(storage) != null) {
    const arrayStorage = JSON.parse(localStorage.getItem(storage));
    arrayStorage.forEach((item) => {
      console.log(item);
      const classCartItems = document.querySelector('.cart__items');
      const itemList = document.createElement('li');
      itemList.className = 'cart__item';
      itemList.innerText = item;
      classCartItems.appendChild(itemList);
      classCartItems.addEventListener('click', function (event) {
        cartItemClickListener(event);
      });
    });
    totalCart();
  }
}

async function totalCart() {
  let cartValue = 0;
  let arrayStorage = [];
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => {
    const text = item.innerText;
    const value = parseFloat(text.substring(text.lastIndexOf('$') + 1, text.lenght));
    cartValue += value;
    arrayStorage.push(text);
  });
  let price = document.querySelector('.total-price');
  if (!price) {
    const classCart = document.querySelector('.cart');
    price = document.createElement('div');
    price.className = 'total-price';
    price.innerText = `Preço Total: $${cartValue.toFixed(2)}`;
    classCart.appendChild(price);
  } else {
    price.innerText = `Preço Total: $${cartValue.toFixed(2)}`;
  }
  if (cartValue === 0) {
    price.remove();
  }
  localStorage.setItem('sd-09-shopping-cart', JSON.stringify(arrayStorage));
}

async function cartItemClickListener(event) {
  event.path[0].remove();
  await totalCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loading(operation) {
  const classContainer = document.querySelector('body');
  let loadingMeessage = document.createElement('p');
  if (operation) {
    loadingMeessage.innerText = 'loading...';
    loadingMeessage.className = 'loading';
    classContainer.appendChild(loadingMeessage);
  } else {
    loadingMeessage = document.querySelector('.loading');
    loadingMeessage.remove();
  }
}

function apiCall(url) {
  return fetch(url).then(response => response.json());
}

async function searchItemCart(sku) {
  const API_URL = `https://api.mercadolibre.com/items/${sku}`;
  const classCartItems = document.querySelector('.cart__items');
  loading(true);
  await apiCall(API_URL).then((item) => {
    const objectItem = {};
    objectItem.sku = item.id;
    objectItem.name = item.title;
    objectItem.salePrice = item.price;
    const itemCart = classCartItems.appendChild(createCartItemElement(objectItem));
    itemCart.addEventListener('click', function (event) {
      cartItemClickListener(event);
    });
  });
  loading(false);
  await totalCart();
}

function makeButtonsListner() {
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((button) => {
    button.addEventListener('click', function (event) {
      searchItemCart(event.path[1].querySelector('.item__sku').innerText);
    });
  });
}

async function makeItems() {
  const searchItem = 'computador';
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${searchItem}`;
  const classItems = document.querySelector('.items');
  loading(true);

  await apiCall(API_URL)
    .then((response) => {
      response.results.forEach((item) => {
        classItems.appendChild(createProductItemElement({ sku: item.id,
          name: item.title,
          image: item.thumbnail }));
      });
    });

  loading(false);
  makeButtonsListner();
}

function clearCart() {
  const classEmptyCart = document.querySelector('.empty-cart');
  classEmptyCart.addEventListener('click', function () {
    const classCartItems = document.querySelectorAll('.cart__item');
    classCartItems.forEach(item => item.remove());
  });
}

window.onload = function onload() {
  makeItems();
  loadStorage('sd-09-shopping-cart');
  clearCart();
};
