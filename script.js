function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function cartItemClickListener(event) {}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// const addProduct = (event) => {}

const addProductToCart = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach(button => button.addEventListener('click', (event) => {
    const getId = getSkuFromProductItem(event.target.parentNode);
    const ol = document.querySelector('.cart__items');

    const endPoint = `https://api.mercadolibre.com/items/${getId}`;
    fetch(endPoint)
      .then(response => response.json())
      .then((obj) => {
        if (obj.error) throw new Error(obj.error);
        const sku = getId;
        const name = obj.title;
        const salePrice = obj.price;
        ol.appendChild(createCartItemElement({ sku, name, salePrice }));
      })
      .catch(error => window.alert(error));
  }));
};

const fetchProducts = (product) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  const section = document.querySelector('section.items');

  fetch(endPoint)
    .then(response => response.json())
    .then((object) => {
      if (object.error) {
        throw new Error(object.error);
      }
      object.results.map((result) => {
        const sku = result.id;
        const name = result.title;
        const image = result.thumbnail;
        return section.appendChild(createProductItemElement({ sku, name, image }));
      });
      addProductToCart();
    })
    .catch(error => window.alert(error));
};
window.onload = function onload() {
  fetchProducts('computador');
};
