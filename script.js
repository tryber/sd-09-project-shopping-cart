function idToSkuTranslator(objectWithId) {
  const { id, title, thumbnail } = objectWithId;
  const objectWithSku = { sku: id, name: title, image: thumbnail };
  return objectWithSku;
}

async function totalPrice() {
  const priceSection = document.querySelector('.price');
  const localStorageContent = JSON.parse(localStorage.carrinho);
  let completePrice = 0;
  await localStorageContent.forEach((product) => {
    const productPrice = product.salePrice;
    completePrice += productPrice;
  });
  priceSection.innerText = completePrice;
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

function getSkuFromItem(itemInnertext) {
  return itemInnertext.split(':')[1].split('|')[0].trim();
}

function cartItemClickListener(event) {
  const item = event.target;
  const localStorageContent = JSON.parse(localStorage.carrinho);
  const indexToRemove = localStorageContent.findIndex((product) => {
    const itemSku = getSkuFromItem(item.innerText);
    return product.sku === itemSku;
  });
  localStorageContent.splice(indexToRemove, 1);
  const newValueForCart = JSON.stringify(localStorageContent) || [];
  localStorage.setItem('carrinho', newValueForCart);
  totalPrice();
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
      const productsArray = JSON.parse(localStorage.getItem('carrinho')) || [];
      productsArray.push(cartDetails);
      localStorage.setItem('carrinho', JSON.stringify(productsArray));
      totalPrice();
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
  const loadingMessage = document.createElement('span');
  const itemSection = document.querySelector('.items');
  loadingMessage.innerText = 'loading';
  loadingMessage.classList.add('loading');
  itemSection.appendChild(loadingMessage);
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${requiredProduct}`)
    .then(result => result.json())
    .then((jsonList) => {
      loadingMessage.remove();
      return addProductToSection(jsonList);
    })
    .catch(err => err);
}

function localStorageCart() {
  const products = JSON.parse(localStorage.carrinho);
  const cart = document.querySelector('.cart__items');
  products.forEach((product) => {
    const cartItem = createCartItemElement(product);
    cart.appendChild(cartItem);
    cartItem.addEventListener('click', cartItemClickListener);
  });
}

function clearCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  localStorage.setItem('carrinho', JSON.stringify([]));
  totalPrice();
}

window.onload = function onload() {
  mercadoLivreFetch('computador');
  localStorageCart();
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', clearCart);
  totalPrice();
};
