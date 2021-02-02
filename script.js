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
  const list = document.querySelector('.cart__items');
  list.removeChild(event.target);
  saveMyCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function emptyCart() {
  const list = document.querySelector('.cart__items');
  list.innerHTML = '';
  saveMyCart();
}

function saveMyCart() {
  const listItems = document.querySelector('.cart__items');
  localStorage.setItem('myCart', listItems.innerHTML);
}

function restoreMyCart() {
  const listItems = document.querySelector('.cart__items');
  listItems.innerHTML = localStorage.getItem('myCart');
  const items = document.querySelectorAll('.cart__item');
  if (items !== null) {
    items.forEach((value) => value.addEventListener('click', cartItemClickListener));
  }
}

async function addEventItemInMyCart(element, id) {
  element.lastChild.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then(resp => resp.json()
      .then((item) => {
        const obj = { sku: item.id, name: item.title, salePrice: item.price };
        const li = createCartItemElement(obj);
        li.addEventListener('click', cartItemClickListener);
        const listItems = document.querySelector('.cart__items');
        listItems.appendChild(li);
        saveMyCart();
      }));
  });
}

async function loadingItems() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(response => response.json()
    .then(item => item.results.forEach((value) => {
      const obj = { sku: value.id, name: value.title, image: value.thumbnail };
      const section = createProductItemElement(obj);
      addEventItemInMyCart(section, value.id);
      const containerItems = document.querySelector('.items');
      containerItems.appendChild(section);
  })));
}

window.onload = function onload() {
  restoreMyCart();
  loadingItems();
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', emptyCart);
};
