window.onload = function onload() { };

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// REQ 5: Summing up cart's total
const calculateCartTotal = async (price, operator) => {
  const priceField = document.querySelector('span.total-price');
  if (operator === '+') {
    priceField.innerText = Math.round((parseFloat(priceField.innerText) + price) * 100) / 100;
  } else {
    priceField.innerText = Math.round((parseFloat(priceField.innerText) - price) * 100) / 100;
  }
};
// ------------------------------------------------

const saveCartInLocalStorage = () => {
  const cartItems = document.querySelector('ol.cart__items');
  const cartsTotal = document.querySelector('span.total-price');
  localStorage.cartList = cartItems.innerHTML;
  localStorage.cartsTotal = cartsTotal.innerHTML;
};

function cartItemClickListener(event) {
  event.target.remove();
  const takePrice = itemTitle =>
    parseFloat(itemTitle.split('PRICE: $')[1]);
  calculateCartTotal(takePrice(event.target.innerText), '-');
  saveCartInLocalStorage();
}

const recoverCart = () => {
  if (localStorage.cartList) {
    const cartItems = document.querySelector('ol.cart__items');
    const cartsTotal = document.querySelector('span.total-price');
    cartItems.innerHTML = localStorage.cartList;
    cartsTotal.innerText = localStorage.cartsTotal;
    const itemsRecovered = document.querySelectorAll('li.cart__item');
    itemsRecovered.forEach(item => item.addEventListener('click', cartItemClickListener));
  }
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// REQ 2: Adding listener to Fetch product's info and append it to the cart list
const addToCartListener = (event) => {
  const cartItems = document.querySelector('ol.cart__items');
  const itemId = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(response => response.json())
    .then(({ id, title, price }) => {
      const obj = {
        sku: id,
        name: title,
        salePrice: price,
      };
      cartItems.appendChild(createCartItemElement(obj));
      calculateCartTotal(price, '+');
      saveCartInLocalStorage();
    });
};
// --------------------------------------------------------------------------

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToCartBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartBtn.addEventListener('click', addToCartListener);
  section.appendChild(addToCartBtn);

  return section;
}

const removeLoading = () => {
  const loading = document.querySelector('span.loading');
  loading.remove();
};

// REQ 1: Fetching products and appending them to the page
const createProductsList = (product) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then(response => response.json())
    .then((data) => {
      removeLoading();
      data.results.forEach(({ id, title, thumbnail }) => {
        const obj = {
          sku: id,
          name: title,
          image: thumbnail,
        };
        const itemsSection = document.querySelector('section.items');
        itemsSection.appendChild(createProductItemElement(obj));
      });
    },
    );
};
// ------------------------------------------------------
const emptyCartListener = () => {
  const emptyCart = () => {
    const cartItems = document.querySelector('ol.cart__items');
    const priceField = document.querySelector('span.total-price');
    cartItems.innerHTML = '';
    priceField.innerText = '0.00';
    saveCartInLocalStorage();
  };
  const emptyCartBtn = document.querySelector('button.empty-cart');
  emptyCartBtn.addEventListener('click', emptyCart);
};

window.onload = async () => {
  await createProductsList('computador');
  recoverCart();
  emptyCartListener();
};
