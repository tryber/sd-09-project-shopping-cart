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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
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
  button.addEventListener('click', async () => {
    fetchListItem(getSkuFromProductItem(button.parentNode))
    .then(obj => obj.json())
    .then(({ id: sku, title: name, price: salePrice }) => addItemToCart({ sku, name, salePrice }))
    .then(result => localStorage.setItem('myCart', result.innerHTML))
    .catch(() => alert('Outro erro! Dá uma olhado nos botões "Adicionar ao carrinho"'));
  });
}

function buttonTest() {
  const myButtons = document.querySelectorAll('.item__add');
  myButtons.forEach(buttonsListener);
}

function createProductsList(item) {
  const items = document.querySelector('.items');

  fetchList(item)
  .then(obj => obj.json())
  .then(({ results }) => {
    results.map(({ id: sku, title: name, thumbnail: image }) =>
    items.appendChild(createProductItemElement({ sku, name, image })));
    buttonTest();
  })
  .catch(() => {
    alert('Deu ruim e eu não sei o que é!');
  });
}

function storageItems() {
  const myCart = document.querySelector('.cart__items');
  if (localStorage.myCart) {
    myCart.innerHTML = localStorage.myCart;
    myCart.childNodes.forEach(item => item.addEventListener('click', cartItemClickListener));
  }
}

window.onload = function onload() {
  createProductsList('computador');
  storageItems();
  buttonTest();
};
