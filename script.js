function printTotalPrice(value) {
  const price = document.querySelector('.total-price');
  price.innerText = value;
}

async function getTotalPriceItems() {
  const cartItems = document.querySelectorAll('.cart__item');
  let price = 0;
  cartItems.forEach((item) => {
    price += +(item.innerText.split('$')[1]);
    printTotalPrice(price);
  })
  if (cartItems.length === 0) printTotalPrice(0);
}

// async function getTotalPriceItems() {
//   let saved = [];
//   if (localStorage.getItem('itemToBuy')) saved = JSON.parse(localStorage.getItem('itemToBuy'));
//   let amount = 0;
//   saved.forEach(async (item) => {
//     const linkItem = `https://api.mercadolibre.com/items/${item}`;
//     if (item) {
//       try {
//         const responseItem = await fetch(linkItem);
//         const responseItemJSON = await responseItem.json();
//         amount += responseItemJSON.price;
//       } catch (error) {
//         alert(error);
//       }
//     }
//     printTotalPrice(amount);
//   });
//   if (saved.length === 0) printTotalPrice(0);
// }

function clearCart() {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', () => {
    const itemsInCart = document.querySelectorAll('.cart__item');
    itemsInCart.forEach(item => item.remove());
    localStorage.setItem('itemToBuy', '');
    getTotalPriceItems();
  });
}

function createDivTotalPrice() {
  const cart = document.querySelector('.cart');
  const total = document.createElement('div');
  const price = document.createElement('span');
  total.classList.add('total');
  total.innerHTML = 'Preço total: $';
  price.classList.add('total-price');
  price.innerText = 0;
  cart.appendChild(total);
  total.appendChild(price);
}

function saveItemCartOnLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('itemToBuy', cartItems.innerHTML);
  getTotalPriceItems();
}

// function saveItemCartOnLocalStorage() {
//   let saved = [];
//   if (localStorage.getItem('itemToBuy')) saved = JSON.parse(localStorage.getItem('itemToBuy'));
//   saved.push(item.sku);
//   localStorage.setItem('itemToBuy', JSON.stringify(saved));
//   getTotalPriceItems();
// }

async function removeFromLocalStorage(item) {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('itemToBuy', cartItems.innerHTML);
  getTotalPriceItems();
}

// async function removeFromLocalStorage(item) {
//   const itemID = item.innerText.slice(5, 18);
//   const saved = JSON.parse(localStorage.getItem('itemToBuy'));
//   const toDelete = saved.indexOf(itemID);
//   saved.splice(toDelete, 1);
//   localStorage.setItem('itemToBuy', JSON.stringify(saved));
//   getTotalPriceItems();
// }

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

function cartItemClickListener(event) {
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
  removeFromLocalStorage(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function appendChildCartItemList(item) {
  const cart = document.querySelector('.cart__items');
  cart.appendChild(item);
}

async function fetchItemMercadoLivre(item, addItem) {
  const linkItem = `https://api.mercadolibre.com/items/${item}`;

  try {
    const responseItem = await fetch(linkItem);
    const responseItemJSON = await responseItem.json();
    const newItem = {
      ...item,
      sku: responseItemJSON.id,
      name: responseItemJSON.title,
      salePrice: responseItemJSON.price,
    };
    appendChildCartItemList(createCartItemElement(newItem));
    if (addItem) saveItemCartOnLocalStorage(newItem);
  } catch (error) {
    alert(error);
  }
}

function addItemInCartListener() {
  const addButtons = document.querySelectorAll('.item__add');
  addButtons.forEach(addButton => (addButton
    .addEventListener('click', (event) => {
      const itemID = getSkuFromProductItem(event.target.parentNode);
      fetchItemMercadoLivre(itemID, addItem = true);
    },
  )));
}

function appendChildItemsList(item) {
  const items = document.querySelector('.items');
  items.appendChild(item);
}

function showLoadingStatus() {
  const items = document.querySelector('.items');
  const loading = document.createElement('div');
  loading.classList.add('loading');
  loading.innerHTML = 'Loading...';
  items.appendChild(loading);
}

function removeLoadingStatus() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

async function fetchMercadoLivreAPI(search) {
  const link = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;

  try {
    showLoadingStatus();
    const response = await fetch(link);
    const responseJSON = await response.json();
    responseJSON.results.forEach((result) => {
      const item = {
        ...result,
        sku: result.id,
        name: result.title,
        image: result.thumbnail,
      };
      appendChildItemsList(createProductItemElement(item));
    });
    addItemInCartListener();
    removeLoadingStatus();
  } catch (error) {
    alert(error);
  }
}

function loadCartListeners() {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

function loadItemCartSavedOnLocalStorage() {
  let saved;
  const cartItems = document.querySelector('.cart__items');
  if (localStorage.getItem('itemToBuy')) {
    saved = localStorage.getItem('itemToBuy');
    cartItems.innerHTML = saved;
  } else cartItems.innerHTML = '';
  loadCartListeners();
  getTotalPriceItems();
}

// function loadItemCartSavedOnLocalStorage() {
//   let saved = [];
//   if (localStorage.getItem('itemToBuy')) saved = JSON.parse(localStorage.getItem('itemToBuy'));
//   saved.forEach((item) => {
//     if (item) fetchItemMercadoLivre(item, addItem = false);
//   });
//   getTotalPriceItems();
// }

window.onload = function onload() {
  createDivTotalPrice();
  fetchMercadoLivreAPI('computador');
  loadItemCartSavedOnLocalStorage();
  clearCart();
};
