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

const appendChild = (father, element) => {
  document.querySelector(father).appendChild(element);
};

const saveCartToLocalStorage = () => {
  const getCart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('currentCart', getCart);
};

async function sumPrices() {
  const getCartItems = document.querySelectorAll('.cart__item');
  const getTotalPrice = document.querySelector('.total-price');
  let totalPrice = 0;
  getCartItems.forEach((cartItemElement) => {
    totalPrice += parseFloat(cartItemElement.innerText.split('$')[1]);
  });
  getTotalPrice.innerText = totalPrice;
}

const initialCart = () => {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('currentCart');
  sumPrices();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  sumPrices();
  saveCartToLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


const addToCart = async (itemId) => {
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const { id, title, price } = object;
  appendChild('.cart__items', createCartItemElement({ sku: id, name: title, salePrice: price }));
  await sumPrices();
  saveCartToLocalStorage();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  const createButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createButton);
  createButton.addEventListener('click', (event) => {
    const productClicked = event.target;
    const fatherElement = productClicked.parentNode;
    addToCart(getSkuFromProductItem(fatherElement));
  });
  return section;
}

const fetchProduct = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      document.querySelector('.loading').remove();
      object.results.forEach((product) => {
        const { id, title, thumbnail } = product;
        appendChild('.items', createProductItemElement({ sku: id, name: title, image: thumbnail }));
      });
    })
    .catch(error => window.alert(`${error}, não foi possível achar este produto`));
};

function cleanCart() {
  const getButtonEmptyCart = document.querySelector('.empty-cart');
  getButtonEmptyCart.addEventListener('click', () => {
    const cartElement = document.querySelector('.cart__items');
    const totalPriceElement = document.querySelector('.total-price');
    cartElement.innerText = ' ';
    totalPriceElement.innerText = ' ';
    saveCartToLocalStorage();
  });
}

window.onload = function onload() {
  fetchProduct();
  cleanCart();
  initialCart();
};
