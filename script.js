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
  const myCartItems = document.querySelector('.cart__items');
  if (event.target.className === 'cart__item') {
    myCartItems.removeChild(event.target);
  }
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

function fetchItemList(itemId) {
  return fetch(`https://api.mercadolibre.com/items/${itemId}`);
}

function addItemToCart({ sku, name, salePrice }) {
  const myCart = document.querySelector('.cart__items');
  myCart.appendChild(createCartItemElement({ sku, name, salePrice }));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function buttonsListener(button, index) {
  button.addEventListener('click', () => {
    const myItems = document.querySelectorAll('.item');
    fetchItemList(getSkuFromProductItem(myItems[index]))
    .then(obj => obj.json())
    .then(({ id: sku, title: name, price: salePrice }) => addItemToCart({ sku, name, salePrice }))
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

window.onload = function onload() {
  createProductsList('computador');
};
