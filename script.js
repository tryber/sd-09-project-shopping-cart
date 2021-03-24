function fetchApi() {
  const param = 'computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${param}`;
  return fetch(endpoint)
  .then(response => response.json()
    .then(data => data.results));
}

function fetchItems(itemId) {
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  return fetch(endpoint)
    .then(response => response.json());
}

function addLocalStorage(idItem, itemName) {
  const key = idItem;
  const value = itemName.querySelector('span.item__title').textContent;
  localStorage.setItem(key, value);
}

function removeLocalStorage(params) {
  localStorage.removeItem(localStorage.key(params));
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
  removeLocalStorage(event);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProductToCart(sku) {
  fetchItems(sku)
    .then((product) => {
      const itemCart = createCartItemElement({
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      });
      const listOfCart = document.querySelector('ol.cart__items');
      listOfCart.appendChild(itemCart);
    });
}

function initLocalStorage() {
  for (let i = 1; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    addProductToCart(key, value);
  }
}

function getButtonAdd(itemElement) {
  const buttonAdd = itemElement.querySelector('.item__add');
  const sku = getSkuFromProductItem(itemElement);
  buttonAdd.addEventListener('click', () => addProductToCart(sku));
  buttonAdd.addEventListener('click', () => addLocalStorage(sku, itemElement));
}

function listOfProducts() {
  const sectionItems = document.querySelector('section.items');
  fetchApi()
    .then((response) => {
      response.forEach((object) => {
        const product = createProductItemElement({
          sku: object.id,
          name: object.title,
          image: object.thumbnail,
        });
        getButtonAdd(product);
        sectionItems.appendChild(product);
      });
    });
}

window.onload = () => {
  listOfProducts();
  initLocalStorage();
};
