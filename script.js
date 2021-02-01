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


function saveCart() {
  // if(document.querySelector('li')) {
  //   localStorage.clear();
  //   const cart = document.querySelectorAll('li');
  //   cart.forEach((cartItem, index) => {
  //     localStorage.setItem(index, cartItem)
  //   });
  // }
}


function restoreCart() {
  // if(localStorage) {
  //   const cartItems = Object.entries(localStorage);
  //   cartItems.forEach(item => {
  //     console.log(item)
  //   })
  // }
}


function cartItemClickListener(event) {
  document.querySelector('.cart__items').removeChild(event.target);
  
}


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
      saveCart();
    });
}



function clearCart() {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => {
    document.querySelector('.cart__items').removeChild(item);
  });
}

const loadPage = async (endpoint) => {
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
};


window.onload = function onload() {
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  loadPage(endpoint);
  restoreCart();
};
