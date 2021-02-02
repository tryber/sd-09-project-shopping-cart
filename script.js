const itemsSection = document.querySelector('.items');
const cartItemsOl = document.querySelector('.cart__items');
const totalPriceDiv = document.querySelector('.total-price');

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
  add(itemObject) { this.items.push(itemObject); },
  remove(itemSku) {
    this.items = this.items.filter(({ sku }) => sku !== itemSku);
  },
};

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

const sumItemsInCart = () => shoppingCart.items.reduce(
  (sumAccumulator, { salePrice }) => sumAccumulator + salePrice, 0);

const updateBalance = async () => {
  const cartSum = sumItemsInCart();
  totalPriceDiv.innerText = `Total: R$ ${cartSum}`;
  totalPriceDiv.style.display = 'flex';
};

function cartItemClickListener() {
  // coloque seu código aqui
  cartItemsOl.addEventListener('click', (event) => {
    const element = event.target;
    if (element.classList.contains('cart__item')) {
      const itemSku = getSkuFromProductItem(element);
      shoppingCart.remove(itemSku);
      shoppingCart.save();
      element.remove();
      updateBalance();
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
};

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

const addItemElementToCart = (itemObject) => {
  const itemCartElement = createCartItemElement(itemObject);
  itemCartElement.appendChild(createCustomElement('span', 'item__sku', itemObject.sku));
  cartItemsOl.appendChild(itemCartElement);
  updateBalance();
};

const addSearchItemToCart = async (element) => {
  const itemSku = getSkuFromProductItem(element.parentNode);
  const { id: sku, title: name, price: salePrice } = await retrieveJsonFor('itemInfo', itemSku);
  const itemObject = { sku, name, salePrice };
  shoppingCart.add(itemObject);
  shoppingCart.save();
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

const loadCartItems = () => {
  shoppingCart.load();
  shoppingCart.items.forEach((item) => { addItemElementToCart(item); });
};

window.onload = function onload() {
  loadCartItems();
  searchFor('computador');
  setItemsEvents();
  cartItemClickListener();
};
