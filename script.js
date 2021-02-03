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
  const itemList = document.querySelectorAll('.cart__item');
  itemList.forEach((cartItem) => {
    cartItem.addEventListener('click', () => {
      cartItem.remove();
    });
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


function fetchProductById(itemId) {
  const url = `https://api.mercadolibre.com/items/${itemId}`;
  const cartItem = document.querySelector('.cart__items');
  fetch(url)
  .then(response => response.json())
  .then((product) => {
    const item = product;
    const obj = {
      sku: item.id,
      name: item.title,
      salePrice: item.price,
    };
    cartItem.appendChild(createCartItemElement(obj));
  });
}

function fetchProducts() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const htmlElement = document.querySelector('.items');
  fetch(url)
  .then(response => response.json())
  .then((pc) => {
    const itens = pc.results;
    itens.forEach((element) => {
      const itenObj = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      htmlElement.appendChild(createProductItemElement(itenObj));
    });
    const buttons = document.querySelectorAll('.item__add');
    buttons.forEach((elementButton) => {
      elementButton.addEventListener('click', () => {
        const elementId = elementButton.parentNode.querySelector('.item__sku');
        fetchProductById(elementId.innerText);
      });
    });
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  fetchProducts();
};
