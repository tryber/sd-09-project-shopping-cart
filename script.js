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

function loading(operation) {
  const classContainer = document.querySelector('body');
  let loadingMeessage = document.createElement('p');
  if (operation) {
    loadingMeessage.innerText = 'loading...';
    loadingMeessage.className = 'loading';
    classContainer.appendChild(loadingMeessage);
  } else {
    loadingMeessage = document.querySelector('.loading');
    loadingMeessage.remove();
  }
}

async function searchItemCart(sku) {
  if (sku) {
    loading(true);
  }
  loading(false);
}

function makeButtonsListner() {
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((button) => {
    button.addEventListener('click', function (event) {
      searchItemCart(event.path[1].querySelector('.item__sku').innerText);
    });
  });
}

async function makeItems() {
  const searchItem = 'computador';
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${searchItem}`;
  const classItems = document.querySelector('.items');
  loading(true);

  await fetch(API_URL)
    .then(response => response.json())
      .then((response) => {
        response.results.forEach((item) => {
          const objectItem = {};
          objectItem.sku = item.id;
          objectItem.name = item.title;
          objectItem.image = item.thumbnail;
          classItems.appendChild(createProductItemElement(objectItem));
        });
      });

  loading(false);
  makeButtonsListner();
}

window.onload = function onload() {
  makeItems();
}
