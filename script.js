async function fetchAPI(endpoint) {
  try {
    const response = await fetch(endpoint);
    console.log(response);
    const object = await response.json();
    return object;
  } catch (error) {
    return window.alert('Error');
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

function createProductItemElement({
  sku,
  name,
  image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function createListOfItems(object) {
  object.results.forEach((item) => {
    const itemsContainer = document.querySelector('.items');
    const {
      id: sku,
      title: name,
      thumbnail: image,
    } = item;
    const newItemElement = createProductItemElement({
      sku,
      name,
      image,
    });
    itemsContainer.appendChild(newItemElement);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCartItem = async (event) => {
  const cartContainer = document.querySelector('.cart__items');
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  const item = await fetchAPI(endpoint);
  const {
    id: sku,
    title: name,
    price: salePrice,
  } = item;
  cartContainer.appendChild(createCartItemElement({
    sku,
    name,
    salePrice,
  }));
};

const siteInitialize = async () => {
  const searchEndpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const object = await fetchAPI(searchEndpoint);
  createListOfItems(object);
  const addItemsButtons = document.querySelectorAll('.item__add');
  addItemsButtons.forEach((button) => {
    button.addEventListener('click', addCartItem);
  });
};

window.onload = function onload() {
  siteInitialize();
};
