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

function getfetchProductsResult({ results }) {
  // const productData = {};

  const filterData = results.map(product => { 
    return {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
      salePrice: product.price,
    };
  });
  // console.log(product);
  filterData.forEach(product => {
    const sectionItems = document.querySelector('.items');
    const item = createProductItemElement(product);
    sectionItems.appendChild(item);
  });
  // console.log(filterData);
}

function fetchProducts() {
  const endpoint = "https://api.mercadolibre.com/sites/MLB/search?q=$computador";

  fetch(endpoint)
    .then((response) => response.json())
    .then((object) => {
      if (object.results.length === 0) {
        throw new Error('Produto nao encontrado!');
      }
      getfetchProductsResult(object);
    })
    .catch((error) => console.log(error));
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

window.onload = function onload() {
  fetchProducts();
};
