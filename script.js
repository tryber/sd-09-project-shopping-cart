function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const loadCart = () => {
  const cart = document.querySelector('.cart__items');
  localStorage.setItem('cartItem', cart.innerHTML);
};

function cleanCart() {
  const cartItemsList = document.querySelector('.cart__items');
  cartItemsList.innerHTML = '';
  loadCart();
  totalPrice();
}

const totalPriceContainer = () => {
  const totalPriceLocation = document.querySelector('.cart');
  const labelPrice = document.createElement('div');
  const totalPrice = document.createElement('span');
  labelPrice.className = 'label-price';
  labelPrice.innerHTML = 'Total price: R$ ';
  totalPrice.className = 'total-price';
  labelPrice.appendChild(totalPrice);
  return totalPriceLocation.appendChild(labelPrice);
};

const totalPrice = () => {
  const itemsInCart = document.querySelectorAll('.cart__item');
  const totalResult = document.querySelector('.total-price');
  let summarize = 0;
  itemsInCart.forEach((item) => {
    summarize += parseFloat(item.innerHTML.split('$')[1]);
  });
  totalResult.innerHTML = summarize;
};

function cartItemClickListener(event) {
  event.target.remove();
  loadCart();
  totalPrice();
};

const loadingCartStatus = () => {
  const cartData = document.querySelector('.cart__items');
  cartData.innerHTML = localStorage.getItem('cartItem');
  const cartItemList = cartData.querySelectorAll('li');
  cartItemList.forEach(cartItem => cartItem.addEventListener('click', cartItemClickListener));
};

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const addItemToCart = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    const cartItems = document.querySelector('.cart__items');
    if (object.error) {
      throw new Error(object.error);
    } else {
      cartItems.appendChild(createCartItemElement(object));
      totalPrice();
      loadCart();
    }
  } catch (error) {
    showError(error);
  }
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
};

function itemId(event) {
  const targetItem = event.target.parentElement;
  const itemId = getSkuFromProductItem(targetItem);
  addItemToCart(itemId);
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToCartButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartButton.addEventListener('click', itemId);
  section.appendChild(addToCartButton);

  return section;
};

const getProduct = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const items = document.querySelector('.items');
      data.results.forEach((element) => {
        const { id: sku, title: name, thumbnail: image } = element;
        const product = createProductItemElement({ sku, name, image });
        items.appendChild(product);
      });
    });
};

const cleanCartButton = () => {
  const cleanButton = document.querySelector('.empty-cart');
  cleanButton.addEventListener('click', cleanCart);
};

window.onload = function onload() {
  cleanCartButton();
  getProduct();
  loadingCartStatus();
  totalPriceContainer();
  totalPrice();
};
