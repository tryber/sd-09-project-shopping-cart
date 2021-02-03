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

function setLocalStorage() {
  const lineItens = document.getElementsByTagName('li');
  for (let index = 0; index < lineItens.length; index += 1) {
    const objeto = {
      text: lineItens[index].innerText,
      class: lineItens[index].className,
    };
    localStorage.setItem(index, JSON.stringify(objeto));
  }
}

let totalPrice = 0;

function cartItemClickListener(event) {
  // coloque seu código aqui
  const procuctPrice = parseFloat(event.target.innerText.split('$')[1]);
  totalPrice -= Math.round(procuctPrice * 100) / 100;
  document.querySelector('.total-price').innerText = totalPrice.toFixed(2);
  event.target.remove();
  localStorage.clear();
  setLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getStorageItems() {
  const ol = document.querySelector('.cart__items');
  for (let index = 0; index < localStorage.length; index += 1) {
    const listItem = document.createElement('li');
    const objStorage = JSON.parse(localStorage.getItem(index));
    listItem.innerText = objStorage.text;
    listItem.className = objStorage.class;
    listItem.addEventListener('click', cartItemClickListener);
    ol.appendChild(listItem);
  }
}

// document.querySelector('.total-price').innerText = 'oie';

const fetchAddToCartRequest = async (itemId) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const object = await response.json();
  const { id, title, price } = object;
  const item = createCartItemElement({ sku: id, name: title, salePrice: price });
  totalPrice += Math.round(price * 100) / 100;
  document.querySelector('.total-price').innerText = Math.floor(totalPrice);
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(item);
  setLocalStorage();
};


function getSkuFromProductItem(item) {
  const id = item.querySelector('span.item__sku').innerText;
  fetchAddToCartRequest(id);
}
function addToCart() {
  document.querySelectorAll('.item__add').forEach((button) => {
    button.addEventListener('click', function (event) {
      const selectedElement = event.target.parentElement;
      getSkuFromProductItem(selectedElement);
    });
  });
}

async function fetchProducts(query) {
  const loadingElement = document.createElement('p');
  loadingElement.innerText = 'loading...';
  loadingElement.className = 'loading';
  document.body.appendChild(loadingElement);
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const object = await response.json();
  object.results.forEach((result) => {
    const { id, title, thumbnail } = result;
    const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
    document.querySelector('.items').appendChild(item);
  });
  document.body.removeChild(loadingElement);
  addToCart();
}
// function getProductId(event) {
//   const id = event.target.parentNode.firstChild.innerText;
//   fetchAddToCartRequest(id);
// }

function emptyCartList() {
  const emptyListButton = document.querySelector('.empty-cart');
  const ol = document.querySelector('ol');
  emptyListButton.addEventListener('click', function () {
    ol.innerHTML = '';
    totalPrice = 0;
    document.querySelector('.total-price').innerText = totalPrice;
    localStorage.clear();
  });
}

window.onload = function onload() {
  fetchProducts('computador');
  getStorageItems();
  emptyCartList();
};
