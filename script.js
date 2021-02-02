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

function saveOnLocalStorage(singleProduct) {
  const index = Math.random() * 1000000;
  localStorage.setItem(index, JSON.stringify(singleProduct));
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

function removeFromLocalStorage() {
  const list = document.querySelector('.cart__items');
  list.addEventListener('click', function (event) {
    const textJson = event.target.innerText;
    const storageItems = Object.entries(localStorage);
    const productsArray = storageItems.map(product => [product[0], JSON.parse(product[1])]);
    const productToRemove = productsArray.find(element => textJson.includes(element[1].sku));
    localStorage.removeItem(productToRemove[0]);
  });
}

const loopProducts = (results) => {
  results.forEach(((element) => {
    const singleProduct = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const itemSection = document.querySelector('.items');
    itemSection.appendChild(createProductItemElement(singleProduct));
  }));
};

function appendProduct(response) {
  const product = {
    sku: response.id,
    name: response.title,
    salePrice: response.price,
  };
  const cart = document.querySelector('.cart__items');
  saveOnLocalStorage(product);
  cart.appendChild(createCartItemElement(product));
}

function creatEndpoint(element) {
  const sku = getSkuFromProductItem(element);
  return `https://api.mercadolibre.com/items/${sku}`;
}

const addToCart = () => {
  document.querySelectorAll('.item')
  .forEach(function (element) {
    element.addEventListener('click', function () {
      fetch(creatEndpoint(element))
      .then(response => response.json())
      .then((response) => {
        appendProduct(response);
      });
    });
  });
};

function loadStorageItems() {
  const storageItems = Object.entries(localStorage);
  storageItems.forEach((item) => {
    const cart = document.querySelector('.cart__items');
    cart.appendChild(createCartItemElement(JSON.parse(item[1])));
  });
}

const generateProductList = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computer';
  fetch(endpoint)
  .then(response => response.json())
  .then((response) => {
    loopProducts(response.results);
    addToCart();
  });
};

function clearCart() {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', function () {
    localStorage.clear();
    const node = document.querySelector('ol');
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  });
}

function cartSum() {
  let sum = 0;
  const totalPrice = document.querySelector('.total-price');
  const cartList = document.querySelector('ol');
  cartList.addEventListener('click', function (event) {
    const stringValue = event.target.innerText.split('$')[1];
    const numberValue = parseFloat(stringValue);
    sum -= numberValue;
    totalPrice.innerText = `${sum.toFixed(2)}`;
  });
}

window.onload = function onload() {
  generateProductList();
  loadStorageItems();
  cartSum();
  removeFromLocalStorage();
  clearCart();
};
