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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchAddToCartRequest(itemId) {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const object = await response.json();
  const { id, title, price } = object;
  const item = createCartItemElement({ sku: id, name: title, salePrice: price });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(item);
}

function getProductId(event) {
  const id = event.target.parentNode.firstChild.innerText;
  fetchAddToCartRequest(id);
}

function addToCart() {
  document.querySelectorAll('.item__add')
  .forEach((button) => {
    button.addEventListener('click', getProductId);
  });
}

function fetchAllProducts(query) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((dataAll) => {
      if (dataAll.error) {
        throw new Error(dataAll.error);
      }
      const allProductsInfo = dataAll.results;
      allProductsInfo.forEach((object) => {
        const { id, title, thumbnail } = object;
        const item = createProductItemElement({
          sku: id,
          name: title,
          image: thumbnail });
        document.querySelector('.items').appendChild(item);
      });
      addToCart();
    })
    .catch((error) => {
      window.alert(error);
    });
}

window.onload = function onload() {
  fetchAllProducts('computador');
};
