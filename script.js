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

async function fetchResponse(URL) {
  const response = await fetch(URL);
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function fetchItemsByType(query = 'computador') {
  const URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  return fetchResponse(URL);
}

async function fetchItemsById(ItemID) {
  const URL = `https://api.mercadolibre.com/items/${ItemID}`;

  return fetchResponse(URL);
}

function roundNum(number) {
  return parseFloat((Math.round(number * 100) / 100).toFixed(2));
}

async function priceSum(itemID) {
  const data = await fetchItemsById(itemID);
  const spanTextPrice = document.querySelector('.total-price');
  let sum = parseFloat(spanTextPrice.innerText);
  sum += data.price;
  spanTextPrice.innerText = roundNum(sum);
}

function currentCartValue() {
  const spanTextPrice = document.querySelector('.total-price');
  spanTextPrice.innerText = 0;
  if (localStorage.length > 0) {
    let acc = 0;
    Object.values(localStorage).forEach((value) => {
      acc += JSON.parse(value).salePrice;
    });
    spanTextPrice.innerText = roundNum(acc);
  }
}

function clearCart() {
  const buttonClear = document.querySelector('.empty-cart');
  const cartListItems = document.querySelector('.cart__items');
  buttonClear.addEventListener('click', function () {
    cartListItems.innerHTML = '';
    localStorage.clear();
    currentCartValue();
  });
}

function cartItemClickListener(event) {
  eventTextIDproduct = event.target.innerText.split('').splice(5, 13).join('');
  const obj1 = [...Object.entries(localStorage)];
  for (let index = 0; index < obj1.length; index += 1) {
    const [position, data] = obj1[index];
    const searchKey = JSON.parse(data).sku;
    if (eventTextIDproduct === searchKey) {
      localStorage.removeItem(position);
      event.target.remove();
      break;
    }
  }
  if (localStorage.length === 0) {
    const cartListItems = document.querySelector('.cart__items');
    cartListItems.innerHTML = '';
  }
  currentCartValue();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function itemListClickListener() {
  const buttons = document.querySelectorAll('.item__add');
  const cartList = document.querySelector('.cart__items');
  buttons.forEach(button => button.addEventListener('click', async function (event) {
    const itemID = getSkuFromProductItem(event.target.parentNode);
    const itemSearched = await fetchItemsById(itemID);
    const obj = { sku: itemSearched.id, name: itemSearched.title, salePrice: itemSearched.price };
    cartList.appendChild(createCartItemElement(obj));
    // local storage save
    localStorage.setItem(localStorage.length, JSON.stringify(obj));
    await priceSum(itemSearched.id);
  }));
}

function fillSectiomItems(data) {
  const sectionItems = document.querySelector('.items');
  data.results.forEach((item) => {
    const object = { sku: item.id, name: item.title, image: item.thumbnail };
    const element = createProductItemElement(object);
    sectionItems.appendChild(element);
  });
}

function fillCartLoadItems() {
  const values = Object.entries(localStorage);
  values.sort((a, b) => Number(a[0]) - Number(b[0]));
  values.forEach((value) => {
    const obj = JSON.parse(value[1]);
    const cartList = document.querySelector('.cart__items');
    const cartObject = { sku: obj.sku, name: obj.name, salePrice: obj.salePrice };
    cartList.appendChild(createCartItemElement(cartObject));
  });
}

async function start() {
  try {
    await fetchItemsByType().then(data => fillSectiomItems(data));
    await itemListClickListener();
    clearCart();
    fillCartLoadItems();
    currentCartValue();
    document.querySelector('.loading').remove();
  } catch (error) {
    alert(error);
  }
}

window.onload = function onload() {
  start();
};
