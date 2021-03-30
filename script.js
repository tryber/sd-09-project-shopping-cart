/** Linha 83 é uma lógica bem resumida da qual eu estava tentando implementar. */
/** Este código do @rafaelrnascimento200, vi a utilização no projeto e foi de muita aprendizagem. */
/** Link do repositório: https://github.com/tryber/sd-09-project-shopping-cart/pull/13/commits/0be4b51c8e809eaff1e754c72acb4f9e853fa732 */
async function totalPrice() {
  let sum = 0;
  const mylist = document.querySelectorAll('.cart__item');
  const total = document.querySelector('.total-price');
  mylist.forEach(product => (sum += +product.innerText.split('$')[1]));
  total.innerText = sum;
}

function getLoading() {
  const p = document.createElement('p');
  p.className = 'loading';
  p.innerText = 'loading...';
  const sectionLoad = document.querySelector('section.container');
  sectionLoad.appendChild(p);
  totalPrice();
}

function dropLoading() {
  const sectionItems = document.querySelector('.loading');
  sectionItems.remove();
  totalPrice();
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
  const list = document.querySelector('ol.cart__items').innerHTML;
  localStorage.TESTE = list;
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
  totalPrice();
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
      // itemCart.addEventListener('click', totalPrice(product.price));
      addLocalStorage();
    });
  dropLoading();
}

function initLocalStorage() {
  const myList = document.querySelector('.cart__items');
  if (localStorage.TESTE) {
    myList.innerHTML = localStorage.TESTE;
  }
}

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
      dropLoading();
    });
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
  initLocalStorage();
  emptyCart();
  totalPrice();
};
