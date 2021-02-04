let storageCartItems = [];

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

function cartItemClickListener(events) {
  events.target.remove();
  const idSku = events.target.innerText.split(' ')[1];
  storageCartItems = storageCartItems
    .filter(storageItem => idSku !== storageItem.sku);
  localStorage.setItem('products', JSON.stringify(storageCartItems));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchIdItem = async (event) => {
  const cartItems = document.querySelector('.cart__items');
  const getSku = getSkuFromProductItem(event.target.parentNode);
  const urlId = `https://api.mercadolibre.com/items/${getSku}`;
  try {
    const response = await fetch(urlId);
    const idObject = await response.json();
    const { id: sku, title: name, price: salePrice } = idObject;
    const itemCart = createCartItemElement({ sku, name, salePrice });
    cartItems.appendChild(itemCart);
    storageCartItems.push({ sku, name, salePrice });
    localStorage.setItem('products', JSON.stringify(storageCartItems));
  } catch (error) {
    window.alert(error);
  }
};

const cartClickAddItem = () => {
  const itemAdd = document.querySelectorAll('.item__add');
  itemAdd.forEach((element) => {
    element.addEventListener('click', fetchIdItem);
  });
};

const fetchListApi = async () => {
  const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  try {
    const response = await fetch(apiUrl);
    const object = await response.json();
    object.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
      const appendItem = document.querySelector('.items');
      const element = createProductItemElement({ sku, name, image });
      appendItem.appendChild(element);
    });
    cartClickAddItem();
  } catch (error) { window.alert(error); }
};

const localStorageCart = () => {
  const cartStorage = document.querySelector('.cart__items');
  const storageItem = JSON.parse(localStorage.getItem('products'));
  if (localStorage) {
    storageItem.forEach(item =>
      cartStorage.appendChild(createCartItemElement(item)));
  }
};

window.onload = function onload() {
  fetchListApi();
  localStorageCart();
};
