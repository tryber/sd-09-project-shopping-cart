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

function saveCartChanges() {
  const cartSelect = document.querySelector('.cart__items');
  localStorage.setItem('cart', cartSelect.innerHTML);
}

async function price() {
  const items = document.querySelectorAll('.cart__item');
  let total = 0;
  items.forEach((item) => {
    total += parseFloat(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
}

function cartItemClickListener(event) {
  event.target.remove();
  price();
  saveCartChanges();
}

function loadCartChanges() {
  const cartSelect = document.querySelector('.cart__items');
  if (localStorage.cart) {
    cartSelect.innerHTML = localStorage.getItem('cart');
    cartSelect.addEventListener('click', (event) => {
      if (event.target.classList.contains('cart__item')) {
        cartItemClickListener(event);
      }
    });
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemCart(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((itemsID) => {
      const object = {
        sku,
        name: itemsID.title,
        salePrice: itemsID.price,
      };
      document.querySelector('.cart__items').appendChild(createCartItemElement(object));
    });
  price();
  saveCartChanges();
}

function btnAddItemCart() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach(button => button.addEventListener('click', addItemCart));
}

async function listProducts() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((items) => {
      items.results.forEach((item) => {
        const object = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(object));
      });
    });
  btnAddItemCart();
}

function createPricesElement(callback) {
  const paragraphPrice = document.createElement('span');
  paragraphPrice.className = 'total-price';
  document.querySelector('.amount').appendChild(paragraphPrice);
  callback();
}

window.onload = function onload() {
  listProducts();
  loadCartChanges();
  createPricesElement(price);
};
