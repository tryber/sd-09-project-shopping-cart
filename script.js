let localStorageCart = [];

async function getOrderPrice() {
  const orderPrice = document.querySelector('.total-price');
  orderPrice.innerText = 0;
  document.querySelector('.cart').appendChild(orderPrice);
  const cartItems = JSON.parse(localStorage.getItem('MLCartItems'));
  const finalPrice = cartItems.reduce((acc, curr) => acc + curr.salePrice, 0);
  console.log(finalPrice);
  orderPrice.innerText = finalPrice;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  // teste
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
function cartItemClickListener(event) {
  document.querySelector('.cart__items').removeChild(event.target);
  const itemToRemoveSku = event.target.innerText.split(' ')[1];
  localStorageCart = localStorageCart.filter(cartItem => cartItem.sku !== itemToRemoveSku);
  localStorage.setItem('MLCartItems', JSON.stringify(localStorageCart));
  getOrderPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function carregaLoading() {
  sectionSpan = document.querySelector('.cart');
  spanLoading = document.createElement('span');
  spanLoading.className = 'loading';
  sectionSpan.appendChild(spanLoading);
  spanLoading.innerText = 'loading';
}

function descarregaLoading() {
  sectionSpan = document.querySelector('.cart');
  spanLoading = document.querySelector('.loading');
  sectionSpan.removeChild(spanLoading);
}

function addItemToCart(event) {
  const productSKU = ((event.target).parentNode).firstChild.innerText;
  const endpoint = `https://api.mercadolibre.com/items/${productSKU}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const param = { sku: object.id, name: object.title, salePrice: object.price };
      document.querySelector('.cart__items')
      .appendChild(createCartItemElement(param));
      localStorageCart.push(param);
      localStorage.setItem('MLCartItems', JSON.stringify(localStorageCart));
      getOrderPrice();
    });
}

async function retriveMercadoLivreResults(term) {
  carregaLoading();
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;

  try {
    const response = await fetch(endpoint);
    const productsObject = await response.json();
    const productsArray = Object.entries(productsObject.results);
    const refinedProductArrays = productsArray.map(product => product[1]);

    refinedProductArrays.forEach((product) => {
      const param = { sku: product.id, name: product.title, image: product.thumbnail };
      const itemSection = createProductItemElement(param);
      itemSection.lastChild.addEventListener('click', addItemToCart);
      document.querySelector('.items').appendChild(itemSection);
    });
  } catch (error) {
    window.alert(error);
  }
  descarregaLoading();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function clearCart() {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => {
    document.querySelector('.cart__items').removeChild(item);
  });
  localStorage.removeItem('MLCartItems');
  getOrderPrice();
}

function saveLocalStorage() {
  const customerCart = document.querySelector('.cart__items');
  const retrievedLocalStorage = JSON.parse(localStorage.getItem('MLCartItems'));
  if (retrievedLocalStorage === null) {
    localStorage.setItem('MLCartItems', JSON.stringify([]));
  } else {
    retrievedLocalStorage.forEach(item => customerCart.appendChild(createCartItemElement(item)));
  }
}

window.onload = function onload() {
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
  retriveMercadoLivreResults('computador');
  saveLocalStorage();
};
