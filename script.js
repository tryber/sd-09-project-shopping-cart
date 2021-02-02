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

function addProductItem(section) {
  const loading = document.querySelector('.loading');
  if (loading) {
    loading.remove();
  }
  const items = document.querySelector('.items');
  items.appendChild(section);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  addProductItem(section);
}

function searchElements() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(object => object.results)
  .then((array) => {
    array.forEach((object) => {
      const { id: sku, title: name, thumbnail: image } = object;
      createProductItemElement({ sku, name, image });
    });
  })
  .catch(error => window.alert(error));
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function saveCart() {
  const listItem = document.getElementsByClassName('cart__item');
  let contador = 0;
  if (listItem.length === 0) {
    localStorage.removeItem('contador');
  }
  if (listItem.length > 0) {
    Object.values(listItem).forEach((value, index) => {
      localStorage.setItem(`itemCart${index}`, value.innerHTML);
      localStorage.setItem(`itemCartID${index}`, value.id);
      contador += 1;
      localStorage.setItem('contador', contador);
    });
  }
}

async function searchPriceByID(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(response => response.json())
  .then(object => object.price)
  .catch(error => window.alert(error));
}

// async function getPrice(item) {
//   const price = await searchPriceByID(item);
//   return price;
// }

function sumPrices() {
  const items = document.querySelectorAll('.cart__item');
  const ids = [];
  for (let index = 0; index < items.length; index += 1) {
    ids.push(items[index].id);
  }
  const labelPrice = document.querySelector('.total-price');
  if (items.length === 0) {
    labelPrice.innerHTML = '0,00';
  } else {
    let totalPrice = 0;
    ids.forEach(async (value) => {
      const price = await searchPriceByID(value);
      totalPrice += price;
      labelPrice.innerHTML = `${totalPrice}`;
    });
  }
}

function cartItemClickListener(event) {
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
  saveCart();
  sumPrices();
}

function addCartItem(listItem) {
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(listItem);
  saveCart();
  sumPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function searchElementesByID(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(response => response.json())
  .then((object) => {
    const { id: sku, title: name, price: salePrice } = object;
    const listItem = createCartItemElement({ sku, name, salePrice });
    addCartItem(listItem);
  })
  .catch(error => window.alert(error));
}

function captureID(e) {
  if (e.target.className === 'item__add') {
    const item = e.target.parentNode;
    const id = item.firstChild.innerText;
    searchElementesByID(id);
  }
}

function loadlocalStorage() {
  const cartList = document.querySelector('.cart__items');
  const cont = localStorage.getItem('contador');
  for (let index = 0; index < cont; index += 1) {
    const newLI = document.createElement('li');
    newLI.className = 'cart__item';
    newLI.innerHTML = localStorage.getItem(`itemCart${index}`);
    newLI.id = localStorage.getItem(`itemCartID${index}`);
    cartList.appendChild(newLI);
  }
  sumPrices();
}

function empytCart() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = ' ';
}

function setupEventListener() {
  const items = document.querySelector('.items');
  items.addEventListener('click', captureID);
  const cartList = document.querySelector('.cart__items');
  cartList.addEventListener('click', cartItemClickListener);
  const buttonEmpytCart = document.querySelector('.empty-cart');
  buttonEmpytCart.addEventListener('click', empytCart);
}


window.onload = function onload() {
  searchElements();
  setupEventListener();
  loadlocalStorage();
};
