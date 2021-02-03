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

function totalPrice(price) {
  const value = Number(document.querySelector('.total-price').innerText);
  document.querySelector('.total-price').innerText = (value + price);
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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  const total = document.querySelector('.total-price');
  const priceTarget = Number(event.target.innerText.split('$')[1]);
  if (Number(total.innerText) - priceTarget < 1) {
    total.innerText = '';
  } else {
    total.innerText = Number(total.innerText) - priceTarget;
  }
  localStorage.totalPrice = total.innerText;
  localStorage.myCart = document.querySelector('.cart__items').innerHTML;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchList(item) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${item}`);
}

function fetchListItem(itemId) {
  return fetch(`https://api.mercadolibre.com/items/${itemId}`);
}

function addItemToCart({ sku, name, salePrice }) {
  const myCart = document.querySelector('.cart__items');
  myCart.appendChild(createCartItemElement({ sku, name, salePrice }));
  return myCart;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function buttonsListener(button) {
  button.addEventListener('click', () => {
    fetchListItem(getSkuFromProductItem(button.parentNode))
    .then(obj => obj.json())
    .then(({ id: sku, title: name, price: salePrice }) => {
      totalPrice(salePrice);
      // return setTimeout(() => addItemToCart({ sku, name, salePrice }), 2000);
      return addItemToCart({ sku, name, salePrice });
    })
    .then((result) => {
      localStorage.setItem('myCart', result.innerHTML);
      localStorage.setItem('totalPrice', Number(document.querySelector('.total-price').innerText));
    })
    .catch(() => alert('Outro erro! Dá uma olhado nos botões "Adicionar ao carrinho"'));
  });
}

function addCartButton() {
  const myButtons = document.querySelectorAll('.item__add');
  myButtons.forEach(buttonsListener);
}

function createProductsList(item) {
  const items = document.querySelector('.items');

  fetchList(item)
  .then(obj => obj.json())
  .then(({ results }) => {
    document.querySelector('.loading').remove();
    results.map(({ id: sku, title: name, thumbnail: image }) =>
    items.appendChild(createProductItemElement({ sku, name, image })));
    addCartButton();
  })
  .catch(() => {
    alert('Deu ruim e eu não sei o que é!');
  });
}

function storageItems() {
  const myCart = document.querySelector('.cart__items');
  const total = document.querySelector('.total-price');
  if (localStorage.myCart && localStorage.totalPrice) {
    myCart.innerHTML = localStorage.myCart;
    myCart.childNodes.forEach(item => item.addEventListener('click', cartItemClickListener));
    total.innerText = localStorage.totalPrice;
  }
}

function clearCartItems() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    const cartItems = document.querySelectorAll('.cart__item');
    cartItems.forEach(item => item.remove());
    document.querySelector('.total-price').innerText = '';
    localStorage.totalPrice = 0;
    localStorage.myCart = '';
  });
}

window.onload = function onload() {
  document.querySelector('.items').appendChild(createCustomElement('span', 'loading', 'Loading'));
  // setTimeout(createProductsList, 2000, 'computador');
  createProductsList('computador');
  document.querySelector('.cart').appendChild(createCustomElement('span', 'total-price', ''));
  storageItems();
  clearCartItems();
};
