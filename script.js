function idToSkuTranslator(objectWithId) {
  const { id, title, thumbnail } = objectWithId;
  const objectWithSku = { sku: id, name: title, image: thumbnail };
  return objectWithSku;
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

function cartItemClickListener(event) {
  const item = event.target;
  // console.log(localStorage.getItem(item.innerText));
  localStorage.removeItem(item.innerText);
  item.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(event) {
  const productId = event.target.parentNode.firstChild.innerText;
  const cart = document.querySelector('.cart__items');
  return fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then(result => result.json())
    .then((details) => {
      const { id, title, price } = details;
      const cartDetails = { sku: id, name: title, salePrice: price };
      const cartItem = createCartItemElement(cartDetails);
      cart.appendChild(cartItem);
      cartItem.addEventListener('click', cartItemClickListener);
      localStorage.setItem(cartItem.innerText, JSON.stringify(details));
    })
    .catch(err => err);
}

function addProductToSection(productList) {
  const resultsList = productList.results;
  const sectionItems = document.querySelector('.items');
  resultsList.forEach((product) => {
    const productElement = createProductItemElement(idToSkuTranslator(product));
    sectionItems.appendChild(productElement);
    productElement.lastElementChild.addEventListener('click', addToCart);
  });
}

function mercadoLivreFetch(requiredProduct) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${requiredProduct}`)
    .then(result => result.json())
    .then(jsonList => addProductToSection(jsonList))
    .catch(err => err);
}

function localStorageCart() {
  const productKeys = Object.keys(localStorage);
  const cart = document.querySelector('.cart__items');
  if (productKeys.length > 0) {
    productKeys.forEach((productKey) => {
      const productObject = JSON.parse(localStorage[productKey]);
      const { id, title, price } = productObject;
      const cartDetails = { sku: id, name: title, salePrice: price };
      const cartItem = createCartItemElement(cartDetails);
      cart.appendChild(cartItem);
      cartItem.addEventListener('click', cartItemClickListener);
    });
  }
}

function clearCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
}

const buttonClear = document.querySelector('.empty-cart');
buttonClear.addEventListener('click', clearCart);

window.onload = function onload() {
  mercadoLivreFetch('computador');
  localStorageCart();
};
