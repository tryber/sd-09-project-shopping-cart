
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

const retrieveResultsFor = async (searchTerm) => {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`);
  const { results } = await response.json();
  return results;
};

const getCustomObjectFor = ({ id, title, thumbnail }) =>
  ({ sku: id, name: title, image: thumbnail });

const showResultsFor = async (searchTerm) => {
  const results = await retrieveResultsFor(searchTerm);
  const itemsSection = document.querySelector('.items');
  results.forEach((item) => {
    const itemObject = getCustomObjectFor(item);
    const itemElement = createProductItemElement(itemObject);
    itemsSection.appendChild(itemElement);
  });
};

const searchFor = (searchTerm) => { showResultsFor(searchTerm); };

window.onload = function onload() {
  searchFor('computador');
};
