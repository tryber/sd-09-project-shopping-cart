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

const appendChildElement = (father, elementChild) => {
  const elementFather = document.querySelector(`${father}`);
  elementFather.appendChild(elementChild);
};

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProductFromAPIIds = (event) => {
  const idProduct = event.path[1].firstChild.innerText;
  return fetch(`https://api.mercadolibre.com/items/${idProduct}`)
    .then(response => response.json())
    .then(object => appendChildElement('.cart__items', createCartItemElement(object)))
    .catch(error => window.alert(error));
};

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const buttonAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAdd.addEventListener('click', getProductFromAPIIds);
  section.appendChild(buttonAdd);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getProductsFromAPI = () =>
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((object) => {
      object.results.forEach((product) => {
        appendChildElement('.items', createProductItemElement(product));
      });
    })
    .catch((error) => window.alert(error));

window.onload = function onload() {
  getProductsFromAPI();
};
