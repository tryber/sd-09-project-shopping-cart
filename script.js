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

const removeLoading = () => {
  document.querySelector('.loading').remove();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const substractFromCart = (price) => {
  let totalPrice = document.querySelector('.total-price').innerText;
  totalPrice = Math.round((totalPrice - price) * 100) / 100;
  document.querySelector('.total-price').innerText = totalPrice;
};

async function cartItemClickListener(event) {
  // coloque seu código aqui
  const item = event.target;
  const itemID = item.id;

  let myCartItems = JSON.parse(localStorage.getItem('savedCartItems'));
  const itemToRemove = myCartItems.find(myItem => itemID === myItem.sku);
  const indexToRemove = myCartItems.indexOf(itemToRemove);
  myCartItems = myCartItems.slice(0, indexToRemove).concat(myCartItems.slice(indexToRemove + 1));
  localStorage.setItem('savedCartItems', JSON.stringify(myCartItems));

  document.querySelector('.cart__items').removeChild(item);
  const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
  fetch(endpoint)
    .then(response => response.json())
    .then(myitem => substractFromCart(myitem.price));
}

const addToPrice = async (price) => {
  let total = document.querySelector('.total-price').innerText;
  total = await parseFloat(total);
  total = Math.round((total + price) * 100) / 100;
  document.querySelector('.total-price').innerText = total;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  addToPrice(salePrice);
  return li;
}

const sendToCart = async (event) => {
  const mySku = getSkuFromProductItem(event.target.parentNode);
  const endpoint = `https://api.mercadolibre.com/items/${mySku}`;

  const myResponse = await fetch(endpoint)
  .then(response => response.json());

  const myItem = {
    sku: mySku,
    name: myResponse.title,
    salePrice: myResponse.price,
  };
  const myCartItems = JSON.parse(localStorage.getItem('savedCartItems'));
  myCartItems.push(myItem);
  localStorage.setItem('savedCartItems', JSON.stringify(myCartItems));
  const myListItem = createCartItemElement(myItem);
  document.querySelector('.cart__items').appendChild(myListItem);
};

const addSendToCart = () => {
  const myButtons = document.querySelectorAll('.item__add');
  myButtons.forEach((button) => {
    button.addEventListener('click', sendToCart);
  });
};

const fetchSearch = async (query) => {
  const queryEndpoint = `https://api.mercadolibre.com/sites/MLB/search?q=$${query}`;

  const resultArray = await fetch(queryEndpoint)
  .then(response => response.json())
  .then((object) => {
    removeLoading();
    return object.results;
  });

  resultArray.forEach((item) => {
    const myObject = {
      name: item.title,
      sku: item.id,
      image: item.thumbnail,
    };
    const myItem = createProductItemElement(myObject);
    document.querySelector('.items').appendChild(myItem);
  });
  addSendToCart();
};

const emptyCart = () => {
  document.querySelector('.cart__items').innerHTML = '';
  document.querySelector('.total-price').innerText = 0;
};

const emptyStorage = () => localStorage.setItem('savedCartItems', JSON.stringify([]));

const getCartFromStorage = () => {
  const mySavedItems = JSON.parse(localStorage.getItem('savedCartItems'));
  emptyCart();
  mySavedItems.forEach((item) => {
    const myLi = createCartItemElement(item);
    document.querySelector('.cart__items').appendChild(myLi);
  });
};

window.onload = function onload() {
  if (!localStorage.getItem('savedCartItems')) {
    console.log('teste');
    localStorage.setItem('savedCartItems', JSON.stringify([]));
  } else {
    getCartFromStorage();
  }

  fetchSearch('Computador');
  document.querySelector('.empty-cart').addEventListener('click', () => {
    emptyCart();
    emptyStorage();
  });
};
