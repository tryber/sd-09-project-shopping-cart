window.onload = function onload() { };

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
const handleWithSearchResults = (object) => {
    object.results.forEach((result) => {
      const infosComput = {};
      infosComput.sku = result.id;
      infosComput.name = result.title;
      infosComput.image = result.thumbnail;
      const section = document.querySelector('.items');
      section.appendChild(createProductItemElement(infosComput));
    });
  }

const fetchComputers = (endpoint) => {
    fetch(endpoint)
      .then(response => response.json())
      .then((object) => {
        if (object.results.length === 0) {
          error = 'Produto não existe';
          throw new Error(error);
        }
        handleWithSearchResults(object);
      })
    .catch((error) => {
      window.alert(error);
    });
  }
function createStoreItens() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetchComputers(endpoint);
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

// Chamada de Funções
createStoreItens();
