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

function totalPrice() {
  let price = 0;
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(item => (price += parseFloat(item.innerText.split('$')[1])));
  document.querySelector('.total-price').innerText = `$${price}`;
}

function updatePrice() {
  document.querySelector('.total-price').innerText = '';
  totalPrice();
}

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.removeItem(localStorage.key(event));
  updatePrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const populateStorage = (name, value) => {
  localStorage[name] = value;
};

const addToCart = async (event) => {
  const itemId = event.target.parentNode.firstChild.innerHTML;
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  try {
    const response = await fetch(endpoint);
    const item = await response.json();
    const { id: sku, title: name, price: salePrice } = item;
    const cartItem = createCartItemElement({ sku, name, salePrice });
    document.querySelector('.cart__items').appendChild(cartItem);

    const cartItemText = cartItem.innerHTML;
    populateStorage(itemId, cartItemText);
    updatePrice();
  } catch (error) {
    console.log(error);
  }
};

const fetchProducts = async (query) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    object.results.forEach((item) => {
      const { id: sku, title: name, thumbnail: image } = item;
      const eachResult = createProductItemElement({ sku, name, image });
      document.querySelector('.items').appendChild(eachResult);
    });

    document.querySelectorAll('.item__add')
      .forEach(element => element.addEventListener('click', addToCart));
  } catch (error) {
    console.log(error);
  }
};

const loadCartItemsFromStorage = () => {
  const values = Object.values(localStorage);
  values.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `${item}`;
    document.querySelector('.cart__items').appendChild(li);
    li.addEventListener('click', cartItemClickListener);
  });
  totalPrice();
};

function clearCart() {
  const items = document.querySelectorAll('.cart__item');
  const cartItems = document.querySelector('.cart__items');
  items.forEach((item) => {
    cartItems.removeChild(item);
    localStorage.removeItem(localStorage.key(item));
  });
}

window.onload = function () {
  fetchProducts('computador');
  loadCartItemsFromStorage();

  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', clearCart);
};
