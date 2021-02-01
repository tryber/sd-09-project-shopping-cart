
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
  console.log(event);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchApiResultsAddToPage = async () => {
  const query = 'computador';
  const endpointURL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  try {
    const queryResult = await fetch(endpointURL);
    const objectResult = await queryResult.json();

    objectResult.results.forEach((element) => {
      const { id: sku, title: name, thumbnail: image } = element;
      const itemsDePesquisa = document.querySelector('.items');
      itemsDePesquisa.appendChild(createProductItemElement({ sku, name, image }));
    });
  } catch (error) {
    alert(error);
  }
};

const addListenersToItems = () => {
  const pageItems = document.querySelector('.items');
  pageItems
}

window.onload = function onload() {
  fetchApiResultsAddToPage();
};
