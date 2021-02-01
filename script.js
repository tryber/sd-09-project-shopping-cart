const itemsSection = document.querySelector('.items');
const cartItemsOl = document.querySelector('.cart__items');
let shoppingCart = [];

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
  // coloque seu código aqui
  cartItemsOl.addEventListener('click', (event) => {
    const element = event.target;
    if (element.classList.contains('cart__item')) {
      element.remove();
    }
  });
}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const urls = {
  getFor([type, searchTerm]) {
    return [this[type], searchTerm].join('');
  },
  search: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  itemInfo: 'https://api.mercadolibre.com/items/',
}

const retrieveJsonFor = async (...args) => {
  const url = urls.getFor(args);
  const jsonResponse = await fetch(url).then(resp => resp.json());
  return jsonResponse;
};

const getCustomObjectFor = ({ id, title, thumbnail }) =>
  ({ sku: id, name: title, image: thumbnail });

const showResultsFor = async (searchTerm) => {
  const { results } = await retrieveJsonFor('search', searchTerm);
  results.forEach((item) => {
    const itemObject = getCustomObjectFor(item);
    const itemElement = createProductItemElement(itemObject);
    itemsSection.appendChild(itemElement);
  });
};

const searchFor = (searchTerm) => { showResultsFor(searchTerm); };

const addElementProductToCart = async (element) => {
  const itemSku = element.parentNode.firstChild.innerText;
  const { id, title, price } = await retrieveJsonFor('itemInfo', itemSku);
  const itemObject = { sku: id, name: title, salePrice: price };
  shoppingCart.push(itemObject);
  const itemCartElement = createCartItemElement(itemObject);
  cartItemsOl.appendChild(itemCartElement);
};

function setItemsEvents() {
  itemsSection.addEventListener('click', (event) => {
    const element = event.target;
    if (element.classList.contains('item__add')) {
      addElementProductToCart(element);
    }
  });
}


window.onload = function onload() {
  searchFor('computador');
  setItemsEvents();
  cartItemClickListener();
};
