const itemsSection = document.querySelector('.items');
const cartItemsOl = document.querySelector('.cart__items');
const totalPriceDiv = document.querySelector('.total-price');
const emptyCartButton = document.querySelector('.empty-cart');

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const loadingDisplay = {
  show() {
    const loadingElement = createCustomElement('div', 'loading', 'loading...');
    document.body.appendChild(loadingElement);
  },
  hide() {
    const loadingElement = document.querySelector('.loading');
    loadingElement.remove();
  },
};

const shoppingCart = {
  storageKey: 'cart',
  items: [],
  load() {
    const isInLocalStorage = Object.keys(localStorage).includes(this.storageKey);
    if (isInLocalStorage) {
      this.items = JSON.parse(localStorage.getItem(this.storageKey));
    }
  },
  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  },
  add(itemObject) {
    this.items.push(itemObject);
    this.save();
  },
  remove(itemSku) {
    this.items = this.items.filter(({ sku }) => sku !== itemSku);
    this.save();
  },
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

const sumItemsInCart = () => shoppingCart.items.reduce(
  (sumAccumulator, { salePrice }) => sumAccumulator + salePrice, 0);

const updateBalance = async () => {
  const cartSum = sumItemsInCart();
  totalPriceDiv.innerText = `${cartSum}`;
  totalPriceDiv.style.display = 'flex';
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const element = event.target;
  if (element.classList.contains('cart__item')) {
    const itemSku = element.innerText.split(':')[1].split('|')[0].trim();
    shoppingCart.remove(itemSku);
    element.remove();
    updateBalance();
  }
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
};

const retrieveJsonFor = async (...args) => {
  const url = urls.getFor(args);
  loadingDisplay.show();
  const jsonResponse = await fetch(url)
    .then(resp => resp.json());
  loadingDisplay.hide();
  return jsonResponse;
};

const showResultsFor = async (searchTerm) => {
  const { results } = await retrieveJsonFor('search', searchTerm);
  results.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const itemObject = { sku, name, image };
    const itemElement = createProductItemElement(itemObject);
    itemsSection.appendChild(itemElement);
  });
};

const searchFor = (searchTerm) => { showResultsFor(searchTerm); };

const addItemElementToCart = (itemObject) => {
  const itemCartElement = createCartItemElement(itemObject);
  cartItemsOl.appendChild(itemCartElement);
  updateBalance();
};

const addSearchItemToCart = async (element) => {
  const itemSku = getSkuFromProductItem(element.parentNode);
  const { id: sku, title: name, price: salePrice } = await retrieveJsonFor('itemInfo', itemSku);
  const itemObject = { sku, name, salePrice };
  shoppingCart.add(itemObject);
  addItemElementToCart(itemObject);
};

function setItemsEvents() {
  itemsSection.addEventListener('click', (event) => {
    const element = event.target;
    if (element.classList.contains('item__add')) {
      addSearchItemToCart(element);
    }
  });
}

const setEmptyCartEvents = () => {
  emptyCartButton.addEventListener('click', () => {
    cartItemsOl.innerHTML = '';
    shoppingCart.items = [];
    shoppingCart.save();
    updateBalance();
  });
};

const loadCartItems = () => {
  shoppingCart.load();
  shoppingCart.items.forEach((item) => { addItemElementToCart(item); });
};

window.onload = function onload() {
  loadCartItems();
  searchFor('computador');
  setItemsEvents();
  setEmptyCartEvents();
};
