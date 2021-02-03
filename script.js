const storageArray = JSON.parse(localStorage.getItem('productsOnCart')) || [];

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

async function cartSum(value) {
  const priceParagraph = document.querySelector('.total-price');
  const previusValue = parseFloat(priceParagraph.innerText);
  const sum = previusValue + value;
  priceParagraph.innerText = `${sum}`;
}

function removeFromLocalStorage(event) {
  const prod = [];
  for (let index = 0; index < storageArray.length; index += 1) {
    const { sku, name, salePrice } = storageArray[index];
    if (`SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}` === event.path[0].innerText) {
      prod.push(index);
      prod.push(salePrice);
      break;
    }
  }
  const removeValue = prod[1] * -1;
  cartSum(removeValue);
  storageArray.splice(prod[0], 1);
  localStorage.setItem('productsOnCart', JSON.stringify(storageArray));
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
  cartSum(product.salePrice);
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
  storageArray.forEach((product) => {
    const cart = document.querySelector('.cart__items');
    cart.appendChild(createCartItemElement(product));
  });
}

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
    localStorage.removeItem('productsOnCart');
    const node = document.querySelector('ol');
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  });
}

function loadStorageValue() {
  if (storageArray.length > 0) {
    let sum = 0;
    storageArray.forEach((prod) => {
      sum += prod.salePrice;
    });
    cartSum(sum);
  }
}

window.onload = function onload() {
  generateProductList();
  clearCart();
  loadStorageValue();
};
