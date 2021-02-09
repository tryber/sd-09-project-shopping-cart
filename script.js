function fetchProductList() {
  const productName = 'computador';
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productName}`)
    .then(response => response.json())
    .then(data => data.results);
}

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
  // coloque seu código aqui, iniciando
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function initializeProductList() {
  const sectionItems = document.querySelector('section.items');
  fetchProductList()
    .then((products) => {
      products.forEach((product) => {
        const productElement = createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
        sectionItems.appendChild(productElement);
      });
    });
}

window.onload = function onload() {
  initializeProductList();
};
