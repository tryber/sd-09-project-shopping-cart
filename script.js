/**
 * Consultei o repositório da Bruna Campos para resolver essa parte.
 * Link: https://github.com/tryber/sd-09-project-shopping-cart/tree/bruna-campos-shopping-cart
*/
async function fullfillQueryResults(query) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const fetchValue = await fetch(endpoint);
  const objectFetched = await fetchValue.json();
  const retrivedItems = objectFetched.results;
  const itemList = document.querySelector('.items');
  retrivedItems.forEach((currentItem) => {
    const { id: sku, title: name, thumbnail: image } = currentItem;
    const item = createProductItemElement({ sku, name, image });
    itemList.appendChild(item);
  });
}

window.onload = function onload() {
  fullfillQueryResults('computador')
};


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
