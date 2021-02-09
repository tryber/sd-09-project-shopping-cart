function fetchProductList() {
  const productName = 'computador';
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productName}`)
    .then(response => response.json())
    .then(data => data.results);
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

function addItemToLocalStorage({ sku }) {
  const itemsFromLocalStorage = loadItemsFromLocalStorage();
  itemsFromLocalStorage.push({ sku });
  saveItemsToLocalStorage(itemsFromLocalStorage);
}

function removeItemFromLocalStorage(sku) {
  const items = loadItemsFromLocalStorage();
  const itemIndex = items.findIndex(item => item.sku === sku);
  items.splice(itemIndex, 1);
  saveItemsToLocalStorage(items);
}

function getSkuFromCartItem(cartItem) {
  const result = cartItem.innerText.match(/^SKU: (.+) \| NAME.+/);
  const sku = result[1];
  return sku;
}

function cartItemClickListener(event) {
  const { target } = event;
  const sku = getSkuFromCartItem(target);
  removeItemFromLocalStorage(sku);
  target.remove();
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

function addProductToCart(sku) {
  return fetchProductDetail(sku)
    .then((product) => {
      const productCartItem = createCartItemElement({
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      });
      const cartList = document.querySelector('ol.cart__items');
      cartList.appendChild(productCartItem);
    });
}

function addButtonEventListener(itemElement) {
  const button = itemElement.querySelector('.item__add');
  const sku = getSkuFromProductItem(itemElement);
  button.addEventListener('click', () => {
    addProductToCart(sku);
    addItemToLocalStorage({ sku });
  });
}

function initializeProductList() {
  const sectionItems = document.querySelector('section.items');
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
    });
}

function loadItemsToCart() {
  const items = loadItemsFromLocalStorage();
  items.forEach(item => addProductToCart(item.sku));
}

window.onload = function onload() {
  initializeProductList();
  loadItemsToCart();
};
