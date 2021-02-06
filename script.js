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

function saveOnStorage(cartHTML) {
  JSON.parse(localStorage.getItem('id'));
  localStorage.setItem('id', JSON.stringify(cartHTML));
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  const cartLocal = document.querySelector('.cart__items');
  const cartHTML = cartLocal.innerHTML;
  saveOnStorage(cartHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.classList.add(`${sku}`);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function startLoading() {
  const title = document.createElement('h1');
  title.className = 'loading';
  title.innerText = 'Loading...';
  document.body.appendChild(title);
}

function stopLoading() {
  const loadingLocal = document.querySelector('.loading');
  loadingLocal.remove();
}

async function createProductList() {
  const endpoint =
    'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  try {
    const response = await fetch(endpoint);
    const objectJson = await response.json();
    const objectJsonResults = objectJson.results;
    console.log(objectJson);
    const sectionLocal = document.querySelector('.items');

    objectJsonResults.forEach((element) => {
      const { id: sku, title: name, thumbnail: image } = element;
      const itemsForSale = createProductItemElement({ sku, name, image });
      sectionLocal.append(itemsForSale);
    });
  } catch (error) {
    alert('Error');
  }
  stopLoading();
}

async function addIdToEndpoint(clickedId) {
  const cartItemsLocal = document.querySelector('.cart__items');
  const endpointId = `https://api.mercadolibre.com/items/${clickedId}`;
  const responseId = await fetch(endpointId);
  const objectJsonId = await responseId.json();
  const { id: sku, title: name, price: salePrice } = objectJsonId;
  const itemOnList = createCartItemElement({ sku, name, salePrice });
  cartItemsLocal.appendChild(itemOnList);
}

function getInnerHtml() {
  const cartLocal = document.querySelector('.cart__items');
  const cartHTML = cartLocal.innerHTML;
  saveOnStorage(cartHTML);
}

function addItemToCart() {
  document.addEventListener('click', async function (event) {
    if (event.target.className === 'item__add') {
      const parentName = event.target.parentElement;
      const clickedId = parentName.firstChild.innerText;
      await addIdToEndpoint(clickedId);
      getInnerHtml();
    }
  });
}

function onLoadPush() {
  if (localStorage.length > 0) {
    const getStorage = JSON.parse(localStorage.getItem('id'));
    const cartLocal = document.querySelector('.cart__items');
    cartLocal.innerHTML = getStorage;
    const cartLocalItems = document.querySelectorAll('.cart__item');
    for (let index = 0; index < cartLocalItems.length; index += 1) {
      cartLocalItems[index].addEventListener('click', cartItemClickListener);
    }
  }
}

function removeAllItems() {
  const emptyButtonLocal = document.querySelector('.empty-cart');
  emptyButtonLocal.addEventListener('click', function () {
    localStorage.clear();
    const itemOnCart = document.querySelectorAll('.cart__item');
    itemOnCart.forEach(element => element.remove());
  });
}

window.onload = function onload() {
  createProductList();
  addItemToCart();
  removeAllItems();
  startLoading();
  onLoadPush();
};
