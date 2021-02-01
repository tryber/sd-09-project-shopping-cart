async function fetchProductList() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const productList = await response.json();
  return productList;
}

async function fetchItemById(itemID) {
  const fetchResponse = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const item = await fetchResponse.json();
  return item;
}

async function calculateTotalPrice() {
  const cartItems = document.querySelectorAll('li.cart__item');
  const totalPrice = Array.from(cartItems).reduce((total, item) => {
    const priceIndex = item.innerText.lastIndexOf('PRICE');
    return (total + Number(item.innerText.substr(priceIndex + 8)));
  }, 0);
  const priceSpan = document.querySelector('span.total-price');
  // priceSpan.innerText = Math.round(totalPrice * 100) / 100;
  priceSpan.innerText = totalPrice;
}

function saveCart() {
  const cartList = document.querySelector('ol.cart__items');
  localStorage.setItem('cart', cartList.innerHTML);
  calculateTotalPrice();
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
}

function loadCart() {
  const cartList = document.querySelector('ol.cart__items');
  cartList.innerHTML = localStorage.getItem('cart');
  const cartItems = document.querySelectorAll('li.cart__item');
  cartItems.forEach(item => item.addEventListener('click', cartItemClickListener));
  calculateTotalPrice();
}

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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  const itemId = event.target.parentNode.firstChild.innerText;
  const item = await fetchItemById(itemId);
  const cartItem = createCartItemElement({
    sku: item.id,
    name: item.title,
    salePrice: item.price,
  });
  document.querySelector('ol.cart__items').appendChild(cartItem);
  saveCart();
}

async function createItemList() {
  const itemsSection = document.querySelector('section.items');
  const productList = await fetchProductList();
  document.querySelector('span.loading').remove();
  productList.results.forEach((product) => {
    const productItem = createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    });
    itemsSection.appendChild(productItem);
  });
  const addCartButtonList = document.querySelectorAll('button.item__add');
  addCartButtonList.forEach(button => button.addEventListener('click', addToCart));
}

function emptyCart() {
  const cartList = document.querySelector('ol.cart__items');
  cartList.innerHTML = '';
  saveCart();
}

window.onload = function () {
  createItemList();
  loadCart();
  const emptyCartButton = document.querySelector('button.empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);
};
