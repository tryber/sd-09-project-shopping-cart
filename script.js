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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function btnShoppingCar() {
  const cartItems = document.querySelector('.cart__items');
  document.querySelectorAll('.item__add')
  .forEach((element) => {
    element.addEventListener('click', (event) => {
      const itemID = event.target.parentNode.firstElementChild.innerText;
      const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
      fetch(endpoint)
      .then((response) => {
        response.json()
          .then((data) => {
            const sku = data.id;
            const name = data.title;
            const salePrice = data.price;
            cartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
          });
      });
    });
  });
}
function fetchMercadoLivre(term) {
  const itemElement = document.querySelector('.items');
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  fetch(endpoint)
    .then((response) => {
      response.json()
        .then((data) => {
          data.results.forEach((element) => {
            const { id: sku, title: name, thumbnail: image } = element;
            itemElement.appendChild(createProductItemElement({ sku, name, image }));
          });
          btnShoppingCar();
        });
    });
}

window.onload = function onload() {
  fetchMercadoLivre('computador');
};
