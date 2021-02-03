function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function sumValuesOfProducts() {
  const valueOfProducts = [];
  const valueOfAllProducts = document.querySelector('.total-price');
  const listProducts = document.querySelectorAll('.cart__item');
  if (listProducts.length > 0) {
    listProducts.forEach((product) => {
      valueOfProducts.push(product.innerText.split('$')[1]);
    });
  }
  const totalValue = valueOfProducts.reduce((acc, crv) => parseFloat(acc) + parseFloat(crv), 0);
  valueOfAllProducts.innerText = totalValue;
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
  event.target.remove();
  sumValuesOfProducts();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProductToCar(event) {
  const ol = document.querySelector('.cart__items');
  const idTarget = event.target.parentNode.children[0].innerText;
  fetch(`https://api.mercadolibre.com/items/${idTarget}`)
    .then(response => response.json())
    .then(({ id, title, price }) => {
      const productCar = createCartItemElement({ sku: id, name: title, salePrice: price });
      ol.appendChild(productCar);
      sumValuesOfProducts();
    });
}

function fetchProducts() {
  const section = document.querySelector('.items');
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
    .then(response => response.json())
    .then((object) => {
      document.getElementsByClassName('loading')[0].remove();
      object.results.forEach(({ id, title, thumbnail }) => {
        section.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
        section.addEventListener('click', addProductToCar);
      });
    })
    .catch('Err');
}

function clearCart() {
  const listProducts = document.querySelectorAll('.cart__item');
  listProducts.forEach(product => product.remove());
  sumValuesOfProducts();
}

window.onload = function onload() {
  fetchProducts();
};
