let itemsArrayLocalStorage = [];

function updateTotalPrice(itemPrice) {
  const priceElement = document.getElementById('price');
  const currentTotalPrice = priceElement.innerText ? parseFloat(priceElement.innerText) : 0;
  const newTotalPrice = (currentTotalPrice + parseFloat(itemPrice)).toFixed(2);
  priceElement.innerText = newTotalPrice;
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

function extractProductsData(productData) {
  const sectionItems = document.querySelector('.items');
  productData.forEach((product) => {
    let formatedProduct = {};
    formatedProduct = { sku: product.id, name: product.title, image: product.thumbnail };
    const productSection = createProductItemElement(formatedProduct);
    sectionItems.appendChild(productSection);
  });
}

function extractItemID(itemData) {
  const itemDataSplitedArray = (itemData.innerText).split('|');
  const itemID = (itemDataSplitedArray[0]).split(' ');
  return itemID[1];
}

function saveItemToLocalStorage(itemsArray) {
  localStorage.setItem(0, itemsArray);
}

function removeItemFromLocalStorage(itemID) {
  itemsArrayLocalStorage.forEach((product, index) => {
    if (product.sku === itemID) {
      updateTotalPrice(parseFloat(product.salePrice) * -1);
      itemsArrayLocalStorage.splice(index, 1);
    }
  });
  if (itemsArrayLocalStorage.length) {
    saveItemToLocalStorage(itemsArrayLocalStorage);
  } else {
    localStorage.clear();
  }
}

function cartItemClickListener(event) {
  if (event.target.className) {
    const cartItems = document.querySelector('.cart__items');
    cartItems.removeChild(event.target);
    const itemID = extractItemID(event.target);
    removeItemFromLocalStorage(itemID);
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProductFromAPIByID(id) {
  const endPoint = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(endPoint);
  const data = await response.json();
  const productFormated = { sku: data.id, name: data.title, salePrice: data.price };
  itemsArrayLocalStorage.push(productFormated);
  saveItemToLocalStorage(JSON.stringify(itemsArrayLocalStorage));
  await updateTotalPrice(productFormated.salePrice);
  const cartListItem = createCartItemElement(productFormated);
  const cartSection = document.querySelector('.cart__items');
  cartSection.appendChild(cartListItem);
}

function getItemsFromLocalStorage() {
  if (window.localStorage && localStorage.length) {
    itemsArrayLocalStorage = (JSON.parse(localStorage.getItem(0)));
    itemsArrayLocalStorage.forEach((product) => {
      updateTotalPrice(product.salePrice);
      const cartListItem = createCartItemElement(product);
      const cartSection = document.querySelector('.cart__items');
      cartSection.appendChild(cartListItem);
    });
  } else {
    updateTotalPrice(0);
  }
}

function getProductListFromAPIByQuerySearch(product) {
  const loadingMessage = document.createElement('span');
  loadingMessage.className = 'loading';
  loadingMessage.innerText = 'loading...';
  const itemsElement = document.querySelector('.items');
  itemsElement.appendChild(loadingMessage);
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(endPoint)
    .then(response => response.json())
    .then(data => extractProductsData(data.results))
    .then(() => itemsElement.removeChild(loadingMessage))
    .catch(error => console.log(error));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  getProductListFromAPIByQuerySearch('computador');
  getItemsFromLocalStorage();
};

const btnEmptyCart = document.querySelector('.empty-cart');
btnEmptyCart.addEventListener('click', () => {
  const cartItemsContainer = document.querySelector('.cart__items');
  localStorage.clear();
  itemsArrayLocalStorage = [];
  cartItemsContainer.innerHTML = '';
});
const btnsAddItemToCart = document.querySelector('.items');
btnsAddItemToCart.addEventListener('click', (event) => {
  if (event.target.className === 'item__add') {
    const id = event.target.parentNode.firstChild.innerText;
    getProductFromAPIByID(id);
  }
});
