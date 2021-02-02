function createListing(search) {
  const sectionItems = document.querySelector('.items');
  const promiseAPI = fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
  .then(response => response.json());
  const arrayResults = promiseAPI.then(response => response.results);
  arrayResults.then(response => response.forEach((value) => {
    resultOgj = {
      sku: value.id,
      name: search,
      image: value.thumbnail,
    };
    sectionItems.appendChild(createProductItemElement(resultOgj));
  }));
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

window.onload = function onload() {
  createListing('computador');
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
