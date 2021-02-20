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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

// TOTAL VALUE OF THE SHOPPING CART
const totalValue = async () => {
  const totalPriceSpan = document.querySelector('.total-price');
  const liCartItems = document.querySelectorAll('.cart__item');
  let sumValues = 0;
  await [...liCartItems].forEach((cartItem) => {
    sumValues += parseFloat(cartItem.innerHTML.split('$')[1]);
  });
  totalPriceSpan.innerHTML = sumValues;
};

// SAVE SELECTED ITEMS ON LOCALSTORAGE
function localStorageSave() {
  const olCartItems = document.querySelector('.cart__items');
  localStorage.setItem('cart', olCartItems.innerHTML);
  totalValue();
}

function localStorageLoad() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('cart');
  totalValue();
}

// ADD LOADING BEFORE FETCH
const displayLoading = () => {
  const loader = document.querySelector('.loading');
  loader.classList.add('display');
  setTimeout(() => {
    loader.classList.remove('display');
  }, 5000);
};

// const hideLoading = () => {
//   const loader = document.querySelector('.loading');
//   loader.classList.remove('display');
// };

const fetchShoppingCart = (productQuery) => {
  const loader = document.querySelector('.loading');
  displayLoading();
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${productQuery}`;
  // let loader = document.createElement('div').innerText = 'Loading...';
  // document.querySelector('.items').innerHTML = loader;
  fetch(endpoint)
    .then(response => response.json())
    .then(object => object.results.forEach((productItem) => {
      if (object.error) {
        throw new Error(object.error);
      }
      document.querySelector('.items').appendChild(createProductItemElement(productItem));
      loader.remove();
      // hideLoading();
    }))
    .catch((error) => {
      window.alert(`Error: ${error}`);
    });
};

// REMOVE ALL ITEMS FROM CART BY CLICKING ON IT
const emptyCart = () => {
  const olCartItems = document.querySelector('.cart__items');
  const clearCartButton = document.querySelector('.empty-cart');
  const totalPriceSpan = document.querySelector('.total-price');
  clearCartButton.addEventListener('click', () => {
    olCartItems.innerHTML = '';
    totalPriceSpan.innerHTML = 0;
    localStorageSave();
  });
};

// REMOVE ITEM FROM CART BY CLICKING ON IT
function cartItemClickListener() {
  const olCartItems = document.querySelector('.cart__items');
  olCartItems.addEventListener('click', (event) => {
    event.target.remove();
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToCart() {
  const items = document.querySelector('.items');
  items.addEventListener('click', async (event) => {
    const itemSku = getSkuFromProductItem(event.target.parentNode);
    const endpoint = `https://api.mercadolibre.com/items/${itemSku}`;
    const response = await fetch(endpoint)
      .then(object => object.json());
    const item = {
      sku: itemSku,
      name: response.title,
      salePrice: response.price,
    };
    const cartItems = document.querySelector('.cart__items');
    const cartItem = createCartItemElement(item);
    cartItems.appendChild(cartItem);
    localStorageSave();
  });
}

// const addToLocalStorage = () => {

// }

window.onload = function onload() {
  fetchShoppingCart('computador');
  addItemToCart();
  emptyCart();
  localStorageLoad();
  // totalValue();
};
