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

async function sumPrices() {
  let totalPrice = 0;
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(item => (totalPrice += parseFloat(item.innerText.split('$')[1])));
  return totalPrice;
}

async function createTotalPriceElement() {
  try {
    const totalPrice = await sumPrices();
    const cart = document.querySelector('.cart');
    const totalPriceElement = document.createElement('span');
    totalPriceElement.className = 'total-price';
    totalPriceElement.innerText = totalPrice;
    cart.appendChild(totalPriceElement);
  } catch (error) {
    window.alert(error);
  }
}

function cartItemClickListener(event) {
  const totalPriceElement = document.querySelector('.total-price');
  const cartProduct = event.target;
  const cart = cartProduct.parentElement;
  cart.removeChild(cartProduct);
  cart.parentElement.removeChild(totalPriceElement);
  const currentCart = cart.innerHTML;
  localStorage.setItem('cart', JSON.stringify(currentCart));
  createTotalPriceElement();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProductToTarget(parentClass, productObject, callback) {
  const targetParent = document.querySelector(parentClass);
  const productResult = callback(productObject);
  targetParent.appendChild(productResult);
  if (parentClass === '.cart__items') {
    localStorage.setItem('cart', JSON.stringify(targetParent.innerHTML));
    const totalPriceElement = document.querySelector('.total-price');
    if (totalPriceElement) {
      targetParent.parentElement.removeChild(totalPriceElement);
      createTotalPriceElement();
    }
  }
}

function addProductToShoppingCart({ id: sku, title: name, price: salePrice }) {
  const productDetails = { sku, name, salePrice };
  addProductToTarget('.cart__items', productDetails, createCartItemElement);
}

async function fetchItemById(event) {
  const productId = event.target.parentElement.firstChild.innerText;
  try {
    const response = await (
      await fetch(`https://api.mercadolibre.com/items/${productId}`)
    ).json();
    addProductToShoppingCart(response);
  } catch (error) {
    window.alert(error);
  }
}

function addClickEventToAddButton() {
  const addItemButtons = document.querySelectorAll('.item__add');
  addItemButtons.forEach((button) => {
    button.addEventListener('click', fetchItemById);
  });
}

async function createProductList(productName) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=$${productName}`;
  try {
    const results = (await (await fetch(endpoint)).json()).results;
    results.forEach(({ id, title, thumbnail }) => {
      const productObject = { sku: id, name: title, image: thumbnail };
      addProductToTarget('.items', productObject, createProductItemElement);
    });
    addClickEventToAddButton();
  } catch (error) {
    window.alert(error);
  }
}

function loadCurrentCart() {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const cartElement = document.querySelector('.cart__items');
  if (cart) {
    cartElement.innerHTML = cart;
    const cartItems = document.querySelectorAll('.cart__item');
    cartItems.forEach(element => element.addEventListener('click', cartItemClickListener));
  }
}

window.onload = function onload() {
  createProductList('computador');
  loadCurrentCart();
  createTotalPriceElement();
};
