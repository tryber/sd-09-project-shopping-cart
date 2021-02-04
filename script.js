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

function cartItemClickListener() {
  const ol = document.querySelector('.cart__items');
  ol.addEventListener('click', (event) => {
    event.target.remove();
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function reloadPag() {
  const ol = document.querySelector('.cart__items');
  const valueOfStorage = JSON.parse(localStorage.getItem('ArrayOfObjts'));

  valueOfStorage.forEach(product => ol.appendChild(createCartItemElement(product)));
}

const arrayObj = [];
function saveToStorage({ sku, name, salePrice }) {
  const key = 'ArrayOfObjts';
  const objToAdd = {
    sku,
    name,
    salePrice,
  };
  arrayObj.push(objToAdd);
  localStorage.setItem(key, JSON.stringify(arrayObj));
}

function addToCar() {
  const buttonItemList = document.querySelectorAll('.item__add');
  buttonItemList.forEach((specifcButton) => {
    specifcButton.addEventListener('click', () => {
      const idSelected = specifcButton.parentNode.querySelector('.item__sku').innerText;
      fetch(`https://api.mercadolibre.com/items/${idSelected}`)
        .then(response => response.json())
        .then((response) => {
          const objResult = {
            sku: response.id,
            name: response.title,
            salePrice: response.price,
          };
          const ol = document.querySelector('.cart__items');
          ol.appendChild(createCartItemElement(objResult));
          // saveToStorage(objResult);
        });
    });
  });
}

function createListing(search) {
  const sectionItems = document.querySelector('.items');
  const promiseAPI = fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
    .then(response => response.json());
  const arrayResults = promiseAPI.then(response => response.results);
  arrayResults
    .then((response) => {
      response.forEach((value) => {
        resultOgj = {
          sku: value.id,
          name: value.title,
          image: value.thumbnail,
        };
        sectionItems.appendChild(createProductItemElement(resultOgj));
      });
      // Chamar a função reuisito 2
      addToCar();
    });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  createListing('computador');
  // reloadPag();
};
