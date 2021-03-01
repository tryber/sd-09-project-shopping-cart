function fetchProductList() {
  const productName = 'computador';
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productName}`)
    .then(response => response.json())
    .then(data => data.results);
}

function createLoadingMessage() {
  const loadingElement = document.createElement('span');
  loadingElement.innerText = 'loading...';
  loadingElement.classList.add('loading');
  document.body.appendChild(loadingElement);
}

function removeLoadingMessage() {
  const loadingElement = document.querySelector('.loading');
  loadingElement.remove();
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

function loadItemsFromLocalStorage() {
  const stringItems = localStorage.getItem('cart-items');
  if (!stringItems) {
    return [];
  }
  const productItems = JSON.parse(stringItems);
  return productItems;
}

function saveItemsToLocalStorage(items) {
  const stringItems = JSON.stringify(items);
  localStorage.setItem('cart-items', stringItems);
}

function addItemToLocalStorage(product) {
  const itemsFromLocalStorage = loadItemsFromLocalStorage();
  itemsFromLocalStorage.push(product);
  saveItemsToLocalStorage(itemsFromLocalStorage);
}

function removeItemFromLocalStorage(sku) {
  const items = loadItemsFromLocalStorage();
  const itemIndex = items.findIndex(item => item.id === sku);
  items.splice(itemIndex, 1);
  saveItemsToLocalStorage(items);
}

function getSkuFromCartItem(cartItem) {
  const result = cartItem.innerText.match(/^SKU: (.+) \| NAME.+/);
  const sku = result[1];
  return sku;
}

async function calculateCartTotalValue() {
  const products = loadItemsFromLocalStorage();
  const total = products.reduce((prevValue, product) => prevValue + product.price, 0);
  const totalValueElement = document.querySelector('.total-price');
  totalValueElement.innerText = total;
}

function cartItemClickListener(event) {
  const { target } = event;
  const sku = getSkuFromCartItem(target);
  removeItemFromLocalStorage(sku);
  target.remove();
  calculateCartTotalValue();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchProductDetail(productId) {
  const url = `https://api.mercadolibre.com/items/${productId}`;
  return fetch(url)
    .then(response => response.json());
}

function addProductToCart(product) {
  const productCartItem = createCartItemElement({
    sku: product.id,
    name: product.title,
    salePrice: product.price,
  });
  const cartList = document.querySelector('ol.cart__items');
  cartList.appendChild(productCartItem);
}

function addButtonEventListener(itemElement) {
  const button = itemElement.querySelector('.item__add');
  const sku = getSkuFromProductItem(itemElement);
  button.addEventListener('click', () => {
    createLoadingMessage();
    fetchProductDetail(sku)
      .then((product) => {
        addProductToCart(product);
        addItemToLocalStorage(product);
        calculateCartTotalValue();
        removeLoadingMessage();
      });
  });
}

function initializeProductList() {
  const sectionItems = document.querySelector('section.items');
  createLoadingMessage();
  fetchProductList()
    .then((products) => {
      products.forEach((product) => {
        const productElement = createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
        addButtonEventListener(productElement);
        sectionItems.appendChild(productElement);
      });
      removeLoadingMessage();
    });
}

function loadItemsToCart() {
  const products = loadItemsFromLocalStorage();
  products.forEach(addProductToCart);
  calculateCartTotalValue();
}

function addEventListenerToClearCart() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    localStorage.removeItem('cart-items');
    document.querySelector('.cart__items').innerHTML = '';
    calculateCartTotalValue();
  });
}

window.onload = function onload() {
  // Teste
  initializeProductList();
  loadItemsToCart();
  addEventListenerToClearCart();
};
