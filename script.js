let storageArray = JSON.parse(localStorage.getItem('productsOnCart')) || [];

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
  storageArray.push(singleProduct);
  localStorage.setItem('productsOnCart', JSON.stringify(storageArray));
}

function loadStorageItems() {
  storageArray.forEach((product) => {
    const cart = document.querySelector('.cart__items');
    cart.appendChild(createCartItemElement(product));
  });
}

function removeFromLocalStorage(event) {
  const prod = storageArray.map((product, index) => {
    const { sku, name, salePrice } = product;
    if (`SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}` === event.path[0].innerText) {
      return index;
    }
  });
  storageArray.splice(prod[0], 1);
  localStorage.setItem('productsOnCart', JSON.stringify(storageArray));
  console.log(prod);
}

function cartItemClickListener(event) {
  event.target.remove();
  removeFromLocalStorage(event);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

const generateProductList = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computer';
  fetch(endpoint)
  .then(response => response.json())
  .then((response) => {
    loopProducts(response.results);
    addToCart();
    loadStorageItems();
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

// function cartSum() {
//   let sum = 0;
//   const totalPrice = document.querySelector('.total-price');
//   const cartList = document.querySelector('ol');
//   cartList.addEventListener('click', function (event) {
//     const stringValue = event.target.innerText.split('$')[1];
//     const numberValue = parseFloat(stringValue);
//     sum -= numberValue;
//     totalPrice.innerText = `${sum.toFixed(2)}`;
//   });
// }

window.onload = function onload() {
  generateProductList();
  clearCart();
};
