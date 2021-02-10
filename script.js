// Primeiro commit
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

function addingSection(section) {
  const childElementClassItem = document.querySelector('.items');
  childElementClassItem.appendChild(section);
}

function newRequest(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => {
      response.json()
        .then((data) => {
          const { id: sku, title: name , price: salePrice } = data;
          addingListItems(createCartItemElement({ sku, name, salePrice }));
        });
    });
}

function productsRequisition() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => {
    response.json()
    .then((data) => {
      const products = data.results;
      products.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product;
        addingSection(createProductItemElement({ sku, name, image }));
      });
      const retrievingClassItemAdd = document.querySelectorAll('.item__add');
      retrievingClassItemAdd.forEach((element) => {
        const sku = element.parentNode.firstChild.innerText;
        element.addEventListener('click', () => newRequest(sku));
      });
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

function addingListItems(li) {
  const cart__items = document.querySelector('.cart__items');
  cart__items.appendChild(li);
}

window.onload = function onload() {
  productsRequisition();
};

// *******************************************************************************************
// *******************************************************************************************
// *******************************************************************************************

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}
