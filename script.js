function addProductToSection(productList) {
  const resultsList = productList.results;
  const sectionItems = document.querySelector('.items');
  resultsList.forEach((product) => {
    const { id, title, thumbnail } = product;
    const newProductObject = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const productElement = createProductItemElement(newProductObject);
    sectionItems.appendChild(productElement);
  });
}

function mercadoLivreFetch(requiredProduct) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${requiredProduct}`)
    .then(result => result.json())
    .then(jsonList => addProductToSection(jsonList))
    .catch(err => err);
}

window.onload = function onload() {
  mercadoLivreFetch('computador');
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
