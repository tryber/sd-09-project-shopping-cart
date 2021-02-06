function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  // e.className = className;
  className.forEach(item => e.classList.add(item));
  e.innerText = innerText;
  return e;
}
async function fetchAPI(endpoint) {
  const body = document.querySelector('body');
  body.appendChild(createCustomElement('p', ['loading'], 'loading...'));
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    body.removeChild(body.lastChild);
    return object;
  } catch (error) {
    body.removeChild(body.lastChild);
    return window.alert('Error');
  }
}
const calculateTotalPrice = () => {
  const cartItems = document.querySelector('.cart__items').childNodes;
  let totalPrice = 0;
  cartItems.forEach((element) => {
    const elementText = element.innerText.split(' ');
    const priceIndex = elementText.indexOf('PRICE:') + 1;
    const price = elementText[priceIndex];
    totalPrice += Number(price.substring(1));
  });
  return totalPrice;
};

const updateTotalPrice = async () => {
  const totalPrice = await calculateTotalPrice();
  const totalPriceField = document.querySelector('.total-price');
  totalPriceField.innerText = totalPrice;
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({
  sku,
  name,
  image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', ['item__sku'], sku));
  section.appendChild(createCustomElement('span', ['item__title'], name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', ['item__add', 'button', 'is-dark'], 'Adicionar ao carrinho!'));

  return section;
}

function createListOfItems(object) {
  object.results.forEach((item) => {
    const itemsContainer = document.querySelector('.items');
    const {
      id: sku,
      title: name,
      thumbnail: image,
    } = item;
    const newItemElement = createProductItemElement({
      sku,
      name,
      image,
    });
    itemsContainer.appendChild(newItemElement);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getCartItemSku = string => string.split(' ')[1];


function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  localStorage.removeItem(getCartItemSku(event.target.innerText));
  updateTotalPrice();
}

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCartItem = async (event) => {
  const cartContainer = document.querySelector('.cart__items');
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  const item = await fetchAPI(endpoint);
  const {
    id: sku,
    title: name,
    price: salePrice,
  } = item;
  cartContainer.appendChild(createCartItemElement({
    sku,
    name,
    salePrice,
  }));
  localStorage.setItem(sku, JSON.stringify(item));
  updateTotalPrice();
};

const loadLocalStorage = () => {
  Object.keys(localStorage).forEach((key) => {
    const item = JSON.parse(localStorage.getItem(key));
    const cartContainer = document.querySelector('.cart__items');
    const {
      id: sku,
      title: name,
      price: salePrice,
    } = item;
    cartContainer.appendChild(createCartItemElement({
      sku,
      name,
      salePrice,
    }));
  });
  updateTotalPrice();
};

const siteInitialize = async () => {
  const searchEndpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const object = await fetchAPI(searchEndpoint);
  createListOfItems(object);
  const addItemsButtons = document.querySelectorAll('.item__add');
  addItemsButtons.forEach((button) => {
    button.addEventListener('click', addCartItem);
  });
};

const clearCart = () => {
  localStorage.clear();
  const cartItems = document.querySelector('.cart__items');
  while (cartItems.firstChild) {
    cartItems.removeChild(cartItems.lastChild);
  }
  updateTotalPrice();
};

window.onload = function onload() {
  siteInitialize();
  const clearCartButton = document.querySelector('.empty-cart');
  clearCartButton.addEventListener('click', clearCart);
  loadLocalStorage();
};