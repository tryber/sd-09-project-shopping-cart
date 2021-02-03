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

function getProductListFromAPIByQuerySearch(product) {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(endPoint)
    .then(response => response.json())
    .then(data => extractProductsData(data.results))
    .catch(error => console.log(error));
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProductListFromAPIByID(id) {
  const endPoint = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(endPoint);
  const data = await response.json();
  const productFormated = { sku: data.id, name: data.title, salePrice: data.price };
  const cartListItem = createCartItemElement(productFormated);
  const cartSection = document.querySelector('.cart__items');
  cartSection.appendChild(cartListItem);
}



function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}


window.onload = function onload() {
  getProductListFromAPIByQuerySearch('computador');
};

const btnsAddItemToCart = document.querySelector('.items');
btnsAddItemToCart.addEventListener('click', (event) => {
  if (event.target.className === 'item__add') {
    const id = event.target.parentNode.firstChild.innerText;
    getProductListFromAPIByID(id);
  }
});
