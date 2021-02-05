let localStorageCart = [];

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

function saveLocalStorage() {
  const customerCart = document.querySelector('.cart__items');
  const retrievedLocalStorage = JSON.parse(localStorage.getItem('MLCartItems'));
  if (retrievedLocalStorage === null) {
    localStorage.setItem('MLCartItems', JSON.stringify([]));
  } else {
    retrievedLocalStorage.forEach(item => customerCart.appendChild(createCartItemElement(item)));
  }
}

function saveCartInLocalStorageCartArray(param) {
  localStorageCart.push(param)
}


// function removeFromLocalStorage(item) {
//   const itemToRemoveSKu = item.innerText.split('|')[0].replace('SKU: ', '');
//   const localStorage = JSON.parse(localStorage.getItem('MLCartItem'));
//   const itemToRemove = localStorage.find((cartList) => {
//      return cartList.sku === itemToRemoveSKu;
//   })
//   console.log(itemToRemove)
 
// }

// function restoreFromLocalStorage() {
//   const restoredItems = JSON.parse(localStorage.getItem('MLCartItem'))
//   restoredItems.forEach((item) => {
//     const { sku, name, salePrice } = item;
//     document.querySelector('ol')
//     .appendChild(createCartItemElement({sku, name, salePrice}));
//   })
// }

// function saveCart() {
//   localStorage.cartItems = document.querySelector('ol').innerHTML;
// }


function cartItemClickListener(event) {
  document.querySelector('.cart__items').removeChild(event.target);
  const itemToRemoveSku = event.target.innerText.split(' ')[1];
  localStorageCart = localStorageCart.filter(cartItem => cartItem.sku !== itemToRemoveSku );
  localStorage.setItem('MLCartItems', JSON.stringify(localStorageCart));
  // removeFromLocalStorage(event.target);
  // saveCart();
}


// function restoreCart() {
//   if (localStorage.length !== 0) {
//     document.querySelector('ol').innerHTML = localStorage.getItem('cartItems');
//   }
//   document.querySelectorAll('li').forEach(item => item.addEventListener('click', cartItemClickListener));
// }


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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
      // saveCart();
      // saveCartInLocalStorage(param);
    });
}


function clearCart() {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => {
    document.querySelector('.cart__items').removeChild(item);
  });
  localStorage.removeItem('MLCartItems');
}


const getTotalOrder = async () => {

};


function addLoadingElement() {
  document.querySelector('.cart').appendChild(createCustomElement('span', 'loading', 'loading'));
}

function removeLoadingElement() {
  document.querySelector('.cart').lastChild.remove();
}

const loadPage = async (endpoint) => {
  try {
    addLoadingElement();
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
  removeLoadingElement();
};


window.onload = function onload() {
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  loadPage(endpoint);
  saveLocalStorage();
  // restoreCart();
  // restoreFromLocalStorage();

};
