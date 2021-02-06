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

function addProductsOnList(productsList) {
  const mainBody = document.querySelector('.items');
  mainBody.innerHTML = '';
  productsList.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const productElement = createProductItemElement({ sku, name, image });
    const listOfProducts = document.querySelector('.items');
    listOfProducts.appendChild(productElement);
  });
}

function cartItemClickListener(event) {
  console.log(event);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchProductByID = (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;

  fetch(url)
  .then(response => response.json())
  .then((productData) => {
    const { id: sku, title: name, price: salePrice } = productData;
    const productParameter = { sku, name, salePrice };
    const productElement = createCartItemElement(productParameter);
    const cartList = document.querySelector('.cart__items');
    cartList.appendChild(productElement);
  });
};

function addProductOnCart(event) {
  const itemClicked = event.target.parentNode;
  const itemSku = getSkuFromProductItem(itemClicked);
  fetchProductByID(itemSku);
}

function startLoadingInformation() {
  const loading = document.createElement('h2');
  loading.innerText = 'loading...';
  loading.classList.add('loading');
  document.body.appendChild(loading);
}

function stopLoadingInformation() {
  document.querySelector('.loading').remove();
}

const fetchProducts = (ProductToSearched) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${ProductToSearched}`;

  startLoadingInformation();

  fetch(url)
  .then(response => response.json())
  .then((siteResponse) => {
    stopLoadingInformation();
    const productsList = siteResponse.results;
    addProductsOnList(productsList);
    const buttons = document.querySelectorAll('.item__add');
    buttons.forEach(button => button.addEventListener('click', addProductOnCart));
  });
};

window.onload = function onload() {
  fetchProducts('computador');
};
