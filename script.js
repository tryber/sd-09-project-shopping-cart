function fetchProductList() {
  const productName = 'computador';
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productName}`)
    .then(response => response.json())
    .then(data => data.results);
}

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
  // coloque seu código aqui, iniciando
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchProductDetail(productId) {
  const url = `https://api.mercadolibre.com/items/${productId}`;
  return fetch(url)
    .then(response => response.json())
}

function addProductToCart(sku) {
  fetchProductDetail(sku)
    .then((product) => {
      const productCartItem = createCartItemElement({
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      });
      const cartList = document.querySelector('ol.cart__items');
      cartList.appendChild(productCartItem);
    });
}

function addButtonEventListener(itemElement) {
  const button = itemElement.querySelector('.item__add');
  const sku = getSkuFromProductItem(itemElement);
  button.addEventListener('click', () => addProductToCart(sku));
}

function initializeProductList() {
  const sectionItems = document.querySelector('section.items');
  fetchProductList()
    .then((products) => {
      products.forEach((product) => {
        const productElement = createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
        addButtonEventListener(productElement);
        sectionItems.appendChild(productElement);
      });
    });
}

window.onload = function onload() {
  initializeProductList();
};
