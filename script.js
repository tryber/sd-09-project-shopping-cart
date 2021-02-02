let totalPrice = 0;
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
  const parent = event.target.parentNode;
  parent.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const calculateTotalPrice = async (price) => {
  totalPrice = totalPrice + price;
  return totalPrice;
};
/* const calculateTotalPrice = async (price) => {
  totalPrice = totalPrice + price;
  return totalPrice;
}; */

const fetchSingleProduct = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;

  try {
    const response = await fetch(endpoint);
    const searchResult = await response.json();
    const { id: sku, title: name, price: salePrice } = searchResult;

    const listItem = createCartItemElement({ sku, name, salePrice });
    const cartItemsList = document.querySelector('.cart__items');
    cartItemsList.appendChild(listItem);
    const result = await calculateTotalPrice(salePrice);
    const totalPriceElement = document.querySelector('.total-price p span');
    totalPriceElement.innerText = result.toFixed(2);
    console.log(result);
    if (searchResult.error) {
      throw new Error(searchResult.error);
    }
  } catch (error) {
    console.log(error);
  }
};

function handleClickAddToCart(event) {
  const sectionItem = event.target.parentNode;
  const sku = getSkuFromProductItem(sectionItem);
  fetchSingleProduct(sku);
}

function addEventInAddToCartButton() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', handleClickAddToCart);
  });
}

const mapProducts = (product) => {
  const { id, title, thumbnail, price } = product;
  return {
    sku: id,
    name: title,
    image: thumbnail,
    salePrice: price,
  };
};

const getfetchProductsResult = ({ results }) => {
  const filterData = results.map(mapProducts);
  filterData.forEach((product) => {
    const sectionItems = document.querySelector('.items');
    const item = createProductItemElement(product);
    sectionItems.appendChild(item);
  });
  addEventInAddToCartButton();
};

async function fetchProducts() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const searchResult = await response.json();
    if (searchResult.results.length === 0) {
      throw new Error('Produto nao encontrado!');
    }
    getfetchProductsResult(searchResult);
  } catch (error) {
    console.log(error);
  }
}

window.onload = function onload() {
  fetchProducts();
};
