function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const button = document.querySelector('.empty-cart');
button.addEventListener('click', () => {
  const Cart = document.querySelector('.cart__items');
  Cart.innerHTML = '';
});

function cartItemClickListener(event) {
  event.currentTarget.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchCartItem(itemId) {
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  const itemCart = document.querySelector('.cart__items');
  const response = await fetch(endpoint);
  const itemValues = await response.json();
  const { id: sku, title: name, price: salePrice } = itemValues;

  // Adicionando item ao carrinho
  itemCart.appendChild(createCartItemElement({ sku, name, salePrice }));

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
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  button.addEventListener('click', () => fetchCartItem(sku));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

console.log(fetchCartItem('MLB1341706310'));

async function fetchListItem() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  const response = await fetch(endpoint);
  const responseItem = await response.json();
  const itemObj = responseItem.results;
  const listItems = document.querySelector('.items');

  itemObj.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const productItem = createProductItemElement({ sku, name, image });
    listItems.appendChild(productItem);
  });

  const getButton = document.querySelector('.item__add');
  const section = getButton.parentNode.querySelector('.item__sku');
  console.log(section);
}

console.log(fetchListItem());

window.onload = function onload() {};
