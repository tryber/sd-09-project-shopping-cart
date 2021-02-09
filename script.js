
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

function startLoading() {
  const cartSection = document.querySelector('.cart');
  cartSection.appendChild(createCustomElement('h2', 'loading', 'loading...'));
}

function stopLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

function fetchProduct() {
  const eachSection = document.querySelector('.items');
  startLoading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
    .catch(() => {
      stopLoading();
      alert('Produto não encontrado!');
    })
    .then((object) => {
      stopLoading();
      const objResults = object.results;
      objResults.forEach((element) => {
        const { id: sku, title: name, thumbnail: image } = element;
        const newList = createProductItemElement({ sku, name, image });
        eachSection.appendChild(newList);
      });
    });
}

function saveCartList() {
  const cartList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartList', cartList);
}

async function totalPriceSum() {
  let subTotal = 0;
  const totalPrice = document.querySelector('.total-price');
  const eachItem = document.querySelectorAll('.cart__item');
  eachItem.forEach((item) => {
    const price = item.innerText.split('$')[1];
    subTotal += Number(price);
  });
  totalPrice.innerText = subTotal;
}

function cartItemClickListener(event) {
  event.target.remove();
  totalPriceSum();
  saveCartList();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProductInTheCart(parentId) {
  fetch(`https://api.mercadolibre.com/items/${parentId}`)
  .then(response => response.json())
  .then((product) => {
    const list = document.querySelector('.cart__items');
    const { id: sku, title: name, price: salePrice } = product;
    const newItem = createCartItemElement({ sku, name, salePrice });
    list.appendChild(newItem);
    totalPriceSum();
    saveCartList();
  });
}

function getItemIdToFetch() {
  document.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const parent = event.target.parentElement;
      const parentId = parent.querySelector('span.item__sku').innerText;
      addProductInTheCart(parentId);
    }
  });
}

function cartCleanButton() {
  const cleanButton = document.querySelector('.empty-cart');
  cleanButton.addEventListener('click', () => {
    const cartList = document.querySelector('.cart__items');
    cartList.innerHTML = '';
    saveCartList();
  });
}

function getCartListRefreshingPage() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cartList');
  const li = document.querySelectorAll('.cart__item');
  for (let index = 0; index < li.length; index += 1) {
    li[index].addEventListener('click', cartItemClickListener);
  }
  totalPriceSum();
}

window.onload = function onload() {
  fetchProduct();
  getItemIdToFetch();
  cartCleanButton();
  getCartListRefreshingPage();
};
