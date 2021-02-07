window.onload = function onload() { };

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
  // coloque seu código aqui e seja feliz
  event.target.remove();
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCart() {
  const items = document.getElementsByClassName('items');
  items.addEventListener('click', async (event) => {
    const getSku = getSkuFromProductItem(event.target.parentNode);
    const endpoint = `https://api.mercadolibre.com/items/${mySku}`;
    const response = await fetch(endpoint).then(respo => respo.json());
    const item = { sku: getSku, name: response.title, salePrice: response.price };
    const cartItems = document.getElementsByClassName('cart_items');
    const createCartItem = createCartItemElement(item);
    cartItems.appendChild(createCartItem);
    saveCart();
  });
}

window.onload = () => {
  addCart();
};

