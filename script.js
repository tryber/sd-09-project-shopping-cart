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

function cartItemClickListener() {
  const dadItemsList = document.querySelector('.cart__items');
  dadItemsList.addEventListener('click', (event) => {
    event.target.remove();
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadingStar() {
  const loadingAdd = document.createElement('h1');
  loadingAdd.className = 'loading';
  loadingAdd.innerText = 'loading...';
  document.body.appendChild(loadingAdd);
}

function loadingStop() {
  const loadingRemove = document.querySelector('.loading');
  loadingRemove.remove();
}

async function listProduct() {
  const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  loadingStar();
  const response = await fetch(apiUrl);
  const object = await response.json();
  const results = object.results;
  const items = document.querySelector('.items');
  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    items.appendChild(element);
  });
  loadingStop();
}

function saveList() {
  const dadCartList = document.querySelector('.cart__items');
  dadCartList.setItem('cart', dadCartList.innerHTML);
}

function LoadingList() {
  let cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cart');
}

function addProductCart() {
  const sectionButtons = document.querySelector('.items');
  sectionButtons.addEventListener('click', async (event) => {
    const myId = getSkuFromProductItem(event.target.parentNode);
    const apiProduct = `https://api.mercadolibre.com/items/${myId}`;
    const response = await fetch(apiProduct);
    const object = await response.json();
    const objProduct = {
      sku: myId,
      name: object.title,
      salePrice: object.price,
    };
    const cartDadList = document.querySelector('.cart__items');
    const productToCart = createCartItemElement(objProduct);
    cartDadList.appendChild(productToCart);
    saveList();
  });
}

function buttonRemovelist() {
  const buttoClear = document.querySelector('.empty-cart');
  buttoClear.addEventListener('click', () => {
    const cartDadList = document.querySelector('.cart__items');
    cartDadList.innerHTML = '';
    saveList();
  });
}

window.onload = function onload() {
  listProduct();
  addProductCart();
  buttonRemovelist();
  LoadingList();
};
