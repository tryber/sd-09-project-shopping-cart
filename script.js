function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  const listProducts = document.querySelector('.cart__items');
  window.localStorage.setItem('listProducts', listProducts.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchProductByIdAndAddCart(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`).then((response) => {
    response.json().then(({ id: sku, title: name, price: salePrice }) => {
      const productItemCart = createCartItemElement({ sku, name, salePrice });
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(productItemCart);
      const listProducts = document.querySelector('.cart__items');
      window.localStorage.setItem('listProducts', listProducts.innerHTML);
    });
  });
}

const itemClickListener = (event) => {
  const skuItemClicked = event.target.parentNode.firstChild.innerText;
  fetchProductByIdAndAddCart(skuItemClicked);
};

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
  if (element === 'button') {
    e.addEventListener('click', itemClickListener);
  }
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

function fetchAllProductsAndList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then((response) => {
    response.json().then((data) => {
      data.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
        document.querySelector('section .items')
          .appendChild(createProductItemElement({ sku, name, image }));
      });
    });
  });
}

function getListProductsCartItemsAndRender() {
  const listProducts = localStorage.getItem('listProducts');
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = listProducts;
  const li = document.querySelectorAll('.cart__item');
  li.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  })
}

window.onload = function onload() {
  fetchAllProductsAndList();
  getListProductsCartItemsAndRender();
};