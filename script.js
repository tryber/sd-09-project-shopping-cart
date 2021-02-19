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

const fetchShoppingCart = (productQuery) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${productQuery}`;
  fetch(endpoint)
    .then(response => response.json())
    .then(object => object.results.forEach((productItem) => {
      if (object.error) {
        throw new Error(object.error);
      }
      document.querySelector('.items').appendChild(createProductItemElement(productItem));
    }))
    .catch((error) => {
      window.alert(`Error: ${error}`);
    });
};

// REMOVE ALL ITEMS FROM CART BY CLICKING ON IT
const emptyCart = () => {
  const olCartItems = document.querySelector('.cart__items');
  const buttonClearCart = document.querySelector('.empty-cart');

  buttonClearCart.addEventListener('click', () => {
    olCartItems.innerHTML = '';
  });
};

// const clickEvent = () => {
//   const buttonEmptyCart = document.querySelector('.empty-cart');
//   buttonEmptyCart.addEventListener('click', emptyCart);
// }

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
    // saveCart();
  });
}

// const addToLocalStorage = () => {

// }

window.onload = function onload() {
  fetchShoppingCart('computador');
  addItemToCart();
  emptyCart();
};
