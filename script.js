function getLoading() {
  const span = document.createElement('span');
  span.className = 'loading';
  span.innerText = 'loading...';
  const sectionLoad = document.querySelector('section.cart');
  sectionLoad.appendChild(span);
}

function dropLoading() {
  const sectionItems = document.querySelector('.loading');
  sectionItems.remove();
}

function fetchApi() {
  const param = 'computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${param}`;
  getLoading();

  return fetch(endpoint)
  .then(response => response.json()
    .then(data => data.results));
}

function fetchItems(itemId) {
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  getLoading();
  return fetch(endpoint)
    .then(response => response.json());
}

function addLocalStorage() {
  if (localStorage.TESTE !== null) {
    const list = document.querySelector('ol.cart__items').innerText;
    localStorage.setItem('TESTE', list);
  }
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
  event.target.remove();
  addLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// aqui
function totalPrice(params) {
  console.log(params);
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
// aqui
      itemCart.addEventListener('click', totalPrice(product.price));
      addLocalStorage();
    });
  dropLoading();
}

/* function initLocalStorage() {
 const teste = localStorage.getItem('TESTE')
 console.log(teste);
 } */

function getButtonAdd(itemElement) {
  const buttonAdd = itemElement.querySelector('.item__add');
  const sku = getSkuFromProductItem(itemElement);
  buttonAdd.addEventListener('click', () => addProductToCart(sku));
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
// aqui
  dropLoading();
}

function emptyCart() {
  const emptyButton = document.querySelector('button.empty-cart');
  emptyButton.addEventListener('click', () => {
    const mylist = document.querySelectorAll('ol .cart__item');
    mylist.forEach((element) => {
      element.remove();
    });
    localStorage.clear();
  });
}

window.onload = () => {
  listOfProducts();
// initLocalStorage();
  emptyCart();
};
