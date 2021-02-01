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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchItemById(event) {
  const productId = event.target.parentElement.firstChild.innerText;
  const response = await (await fetch(`https://api.mercadolibre.com/items/${productId}`)).json();
  addProductToShoppingCart(response);
}

function addProductToShoppingCart({id:sku, title:name, price:salePrice}) {
  const shoppingCart = document.querySelector('.cart__items');
  const productDetails = {sku, name, salePrice};
  const cartProduct = createCartItemElement(productDetails);
  shoppingCart.appendChild(cartProduct);
}

function addClickEventToAddButton() {
  const addItemButtons = document.querySelectorAll('.item__add');
  addItemButtons.forEach((button) => {
    button.addEventListener('click', fetchItemById);
  });
}

async function createProductList(product) {
  const endpoint =
    `https://api.mercadolibre.com/sites/MLB/search?q=$${product}`;
  try {
    const results = (await (await fetch(endpoint)).json()).results;
    results.forEach(({ id, title, thumbnail }) => {
      const items = document.querySelector('.items');
      const productObject = { sku: id, name: title, image: thumbnail };
      const product = createProductItemElement(productObject);
      items.appendChild(product);
    });
    addClickEventToAddButton();
  } catch (error) {
    window.alert(error);
  }
}

window.onload = function onload() {
  createProductList('computador');
};
